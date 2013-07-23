# -*- coding: utf-8 -*-

from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from patit.models import User, Pocket, Comment, Object, UserFeaturedPocket, SponsoredPocket, Vote, Resource
from patit.models import Resource as res
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.authentication import BasicAuthentication
from tastypie.authorization import DjangoAuthorization
from tastypie.cache import SimpleCache
from tastypie.serializers import Serializer
from tastypie.authorization import Authorization
from tastypie.authentication import Authentication
from secure_api import PatitAuthentication, PatitAuthorization

from django.utils import timezone
from django.db import IntegrityError
from django.http import HttpResponseRedirect, HttpResponse
from django.conf.urls import patterns, include, url
from django.conf import settings

from hashlib import sha1
from hmac import new as hmac
from tastypie.fields import FileField
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.mail import send_mail

import datetime
import random
import base64
import os

#Clases que definen los recursos de la aplicación. Para cada método del recurso se han creado varios métodos para poder autenticarlos de forma separada.

class UserResource(ModelResource):
	
	pockets = fields.ToManyField('api.api.PocketResource','pockets',full=True)
	featured = fields.ToManyField('api.api.UserFeaturedPocketResource','featuredpocketuser',full=True)

	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		excludes = ['password','email','api_key']
		allowed_methods = ['get']
		authorization = Authorization()
		always_return_data=True
		include_resource_uri = False
		object_class = User
		serializer = Serializer(formats=['json'])
		filtering = {
			'nick':['exact','in','contain'],
		}

	def override_urls(self):
		return [
			url(r"^(?P<resource_name>%s)/(?P<nick>[\w ]+)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
		]

class SingleUserResource(ModelResource):
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		excludes = ['password','email','api_key','reg_date','od_user']
		allowed_methods = ['get']
		authorization = Authorization()
		always_return_data=True
		include_resource_uri = False
		object_class = User
		serializer = Serializer(formats=['json'])

class PocketResource(ModelResource):
	user = fields.ToOneField(SingleUserResource, 'user', full=True)
	comments = fields.ToManyField('api.api.CommentResource','comments',full=True)
	objects = fields.ToManyField('api.api.ObjectResource','objs',full=True)

	class Meta:
		queryset = Pocket.objects.all().order_by('?')
		resource_name = 'pocket'
		include_resource_uri = True
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get']
		always_return_data=True
		ordering = ['create_date']
		filtering = {
			'id':ALL_WITH_RELATIONS,
			'name':['exact','in','contain'],
			'object':ALL_WITH_RELATIONS,
		}

	def override_urls(self):
		return [
			url(r"^(?P<resource_name>%s)/(?P<name>[\w ]+)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
		]

class ObjectResource(ModelResource):
	pocket = fields.ToOneField(PocketResource, 'pocket')

	class Meta:
		queryset = Object.objects.all()
		resource_name = 'object'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get']
		always_return_data=True 
		filtering = {
			'id':ALL_WITH_RELATIONS,
		}

class CommentResource(ModelResource):
	pocket = fields.ToOneField(PocketResource, 'pocket')

	class Meta:
		queryset = Comment.objects.all().order_by('create_date').reverse()
		resource_name = 'comment'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get']
		always_return_data=True

class UserFeaturedPocketResource(ModelResource):
	user = fields.ToOneField(UserResource, 'user')
	pocket = fields.ToOneField(PocketResource, 'pocket', full=True)
	class Meta:
		queryset = UserFeaturedPocket.objects.all()
		resource_name = 'featured'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get']
		always_return_data=True

class SponsoredPocketResource(ModelResource):
	pocket = fields.ToOneField(PocketResource, 'pocket',full=True)
	class Meta:
		queryset = SponsoredPocket.objects.all()
		resource_name = 'sponsored'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get']
		always_return_data=True
		filtering = {
			'pocket':ALL_WITH_RELATIONS,
			'create_date':ALL_WITH_RELATIONS,
		}

class VotePocketResource(ModelResource):
	user = fields.ToOneField(UserResource, 'user')
	pocket = fields.ToOneField(PocketResource, 'pocket')
	resultreg = "KO"

	class Meta:
		queryset = Vote.objects.all()
		resource_name = 'vote'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post','get']
		authentication = PatitAuthentication()
		authorization = Authorization()
		always_return_data=True
		object_class = Vote

	def obj_create(self, bundle, request=None, **kwargs):
		id_user,id_pocket, vote_user = bundle.data['id_user'],bundle.data['id_pocket'], bundle.data['vote']
		
		#se busca el voto
		vote_mem = None
		for vote in Vote.objects.all():
			if((int(id_user) == vote.user_id) & (int(id_pocket) == vote.pocket_id)):
				vote_mem = vote
		

		if(vote_mem == None): #no existe el voto, se crea

			pocket_aux = Pocket.objects.get(id=int(id_pocket))

			if( (int(vote_user)) > 0):
				bundle.obj = Vote(vote = 1, user_id = int(id_user), pocket_id = int(id_pocket))
				pocket_aux.pos_votes = pocket_aux.pos_votes + 1
			else:
				bundle.obj = Vote(vote = -1, user_id = int(id_user), pocket_id = int(id_pocket))
				pocket_aux.neg_votes = pocket_aux.neg_votes + 1

			pocket_aux.save()	
			bundle.obj.save()
			self.resultreg="OK"

		else: #si existe, se comprueba el tipo de voto
		
			if(vote_mem.vote == int(vote_user)):
				bundle.obj = Vote(vote = int(vote_user), user_id = int(id_user), pocket_id = int(id_pocket))
				self.resultreg="KO_VOTE_PREVIOUSLY"

			else:

				pocket_aux = Pocket.objects.get(id=int(id_pocket))
				bundle.obj = Vote(vote = int(vote_user), user_id = int(id_user), pocket_id = int(id_pocket))

				if( (int(vote_user)) > 0):
					vote_mem.vote = 1
					pocket_aux.pos_votes = pocket_aux.pos_votes + 1
					pocket_aux.neg_votes = pocket_aux.neg_votes -1
				else:
					vote_mem.vote = -1
					pocket_aux.pos_votes = pocket_aux.pos_votes -1
					pocket_aux.neg_votes = pocket_aux.neg_votes +1

				pocket_aux.save()
				vote_mem.save() #se almacena el voto
				self.resultreg="OK_CHANGED_VOTED"

		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle


class LoginPatit(ModelResource):
	result = "KO"

	class Meta:
		queryset = User.objects.all()
		resource_name = 'login'
		allowed_methods = ['post']
		authorization = Authorization()
		excludes = ['od_user']
		always_return_data=True
		include_resource_uri = False
		object_class = User
		serializer = Serializer(formats=['json'])

	def obj_create(self, bundle, request=None, **kwargs):
		username, password = bundle.data['nick'], bundle.data['password']
		user_mem = User()

		for user in User.objects.all():
			if((username == user.nick) & (password == user.password)):
				user_mem = user
				break

		if(user_mem ==user):
			bundle.obj = User(id= user_mem.id, nick=user_mem.nick, email=user_mem.email,password=user_mem.password,reg_date=timezone.now(),api_key=user_mem.api_key,od_user="od_test")
			self.result = "OK"
		else:
			bundle.obj =  User(id= "NULL", nick="NULL", email="NULL",password=user_mem.password,reg_date=timezone.now(),api_key="123",od_user="od_test")
		 	self.result = "KO"
		
		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.result
		return bundle

class RegisterPatit(ModelResource):
	resultreg = "KO"
	api_key = 12345

	class Meta:
		resource_name = 'register'
		allowed_methods = ['post']
		authorization = Authorization()
		always_return_data=True
		object_class = User
		serializer = Serializer(formats=['json'])

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		bundle.data['api_key'] = self.api_key
		return bundle


	def obj_create(self, bundle, request=None, **kwargs):
		username,email, password = bundle.data['nick'],bundle.data['email'], bundle.data['password']
		
		print bundle
		#obtenemos la PK del usuario en caso de que exista
		pk = -1
		for user in User.objects.all():
			if(username == user.nick):
				pk = user.id #return HttpResponse("[{ result : '%s', id : %s}]" % ("OK", username))
		
		if(pk == -1): #no existe el usuario y lo registramos
			#generamos una api_key
			r_key = random.choice(range(100000))
			self.api_key = str(r_key)
			bundle.obj = User(nick=username, email=email,password=password,reg_date=timezone.now(),api_key=r_key,od_user="od_test")
			bundle.obj.save()
			self.resultreg="OK"
		else: #provocamos un error
			bundle.obj = User(id = pk, nick=username, email="email@test",password=password,reg_date=timezone.now(),od_user="od_test",api_key="123123")
			self.resultreg="KO"

		return bundle

class NoPassEmail(ModelResource):
	class Meta:
		resource_name = 'no_key'
		authorization = Authorization()
		authentication = PatitAuthentication()
		always_return_data=True
		allowed_methods = ['get','post']
		excludes = ['password','email','reg_date','id','od_user','nick']
		object_class = User

	def obj_create(self, bundle, request=None, **kwargs):
		p_nick= bundle.data['nick']
		p_email = bundle.data['email']
		#comprobamos que el user existe
		user_mem = None
		for user in User.objects.all():
			if(str(p_nick) == str(user.nick)) & (str(p_email) == str(user.email)):
				user_mem = user
		if user_mem != None:
			send_mail('Patit Key for your account', 'Your password is:'+ user_mem.password , "patit.web@gmail.com",["jmj23elviso@gmail.com"], fail_silently=False)
			print("EAMIL RETREIVE PASS")
			
		bundle.obj = User(nick="a", email="a",password="a",reg_date=timezone.now(),api_key=123,od_user="od_test")
		return bundle

class ApiKeyResource(ModelResource):
	class Meta:
		queryset = User.objects.all()
		resource_name = 'api_key'
		excludes = ['password','email','reg_date','id','od_user','nick']
		allowed_methods = ['get']
		authorization = Authorization()
		always_return_data=True
		object_class = User
		serializer = Serializer(formats=['json'])

	def override_urls(self):
		return [
			url(r"^(?P<resource_name>%s)/(?P<nick>[\w\d_.-]+)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
		]

class PocketNewResource(ModelResource):

	resultreg = "KO"

	class Meta:
		resource_name = 'newpocket'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post']
		always_return_data = True
		authentication = PatitAuthentication()
		authorization = Authorization()
		object_class = Pocket

	def obj_create(self, bundle, request=None, **kwargs):
		p_user= bundle.data['nick']
		p_name = bundle.data['name']
		p_type = bundle.data['type']
		p_desc = bundle.data['description']

		#comprobamos que el user existe
		pk = -1
		for user in User.objects.all():
			if(p_user == user.nick):
				pk = user.id #return HttpResponse("[{ result : '%s', id : %s}]" % ("OK", username))
		
		if(pk != -1):
			bundle.obj = Pocket( name=p_name, 
				description=p_desc,
				type=p_type,
				user_id=pk,
				create_date=timezone.now(),
				last_mod=timezone.now(),
				neg_votes = 0,
				pos_votes = 0,)
			#guardamos el bolsillo
			bundle.obj.save() 
			self.resultreg="OK"
		else:
			bundle.obj = Pocket( name=p_name, 
				description=p_desc,
				type=p_type,
				create_date=timezone.now(),
				last_mod=timezone.now(),
				neg_votes = 0,
				pos_votes = 0,)
			self.resultreg="KO"

		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle

class PocketRemoveResource(ModelResource):
	
	#comments = fields.ToManyField('api.api.CommentResource','comments',full=True)
	class Meta:
		queryset = Pocket.objects.all()
		resource_name = 'deletepocket'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get','delete']
		always_return_data=True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()

class UserRemoveResource(ModelResource):
	
	#comments = fields.ToManyField('api.api.CommentResource','comments',full=True)
	class Meta:
		queryset = User.objects.all()
		resource_name = 'deleteuser'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get','delete']
		always_return_data=True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()

class ObjectRemoveResource(ModelResource):
	
	class Meta:
		queryset = Object.objects.all()
		resource_name = 'deleteobject'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get','delete']
		always_return_data=True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()

class FeaturedRemoveResource(ModelResource):
	class Meta:
		queryset = UserFeaturedPocket.objects.all()
		resource_name = 'deletefeatured'
		serializer = Serializer(formats=['json'])
		allowed_methods = ['get','delete']
		always_return_data=True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()

class CommentNewResource(ModelResource):

	resultreg = "KO"

	class Meta:
		resource_name = 'newcomment'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post']
		always_return_data = True
		authorization = Authorization()
		authentication = PatitAuthentication()
		object_class = Comment

	def obj_create(self, bundle, request=None, **kwargs):
		c_user= bundle.data['nick']
		c_text = bundle.data['text']
		c_id_pocket = bundle.data['id']

		#comprobamos que el user existe
		pk = -1
		for user in User.objects.all():
			if(c_user == user.nick):
				pk = user.id #return HttpResponse("[{ result : '%s', id : %s}]" % ("OK", username))
		
		if(pk != -1):
			bundle.obj = Comment( text=c_text,
				user_nick=c_user,
				create_date=timezone.now(),
				pocket_id=c_id_pocket)

			#guardamos el bolsillo
			bundle.obj.save() 
			self.resultreg="OK"
		else:
			bundle.obj = Comment( text=c_text,
				user_nick=c_user,
				create_date=timezone.now(),
				pocket_id=c_id_pocket)
			self.resultreg="KO"

		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle

class ObjectNewResource(ModelResource):

	resultreg = "KO"

	class Meta:
		resource_name = 'newobject'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post']
		always_return_data = True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()
		object_class = Object

	def obj_create(self, bundle, request=None, **kwargs):
		o_name= bundle.data['name']
		o_type = bundle.data['type']
		o_description = bundle.data['description']
		o_id_pocket = bundle.data['id_pocket']
		o_user = bundle.data['nick']
		o_URL = bundle.data['url']

		#comprobamos que el user existe
		pk = -1
		for user in User.objects.all():
			if(o_user == user.nick):
				pk = user.id #return HttpResponse("[{ result : '%s', id : %s}]" % ("OK", username))

		if(pk != -1):
			bundle.obj = Object(
				name = o_name,
				type = o_type,
				description = o_description,
				pocket_id = o_id_pocket,
				create_date = timezone.now(),
				last_mod = timezone.now(),
				n_mod = 0,
				url = o_URL
				)
			#guardamos el bolsillo
			bundle.obj.save()
			self.resultreg="OK"
		else:
			bundle.obj = Object(
				name = o_name,
				type = o_type,
				description = o_description,
				pocket_id = o_id_pocket,
				create_date = timezone.now(),
				last_mod = timezone.now(),
				n_mod = 0,
				url = o_URL
				)
			self.resultreg="KO"

		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle

class FeaturedResource(ModelResource):

	resultreg = "KO"

	class Meta:
		resource_name = 'newfeatured'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post']
		always_return_data = True
		authorization = Authorization()
		authentication = PatitAuthentication()
		
		object_class = UserFeaturedPocket

	def obj_create(self, bundle, request=None, **kwargs):
		f_nick= bundle.data['nick']
		f_id_pocket = bundle.data['id_pocket']

		#comprobamos que el user existe
		pk = -1
		for user in User.objects.all():
			if(f_nick == user.nick):
				pk = user.id #return HttpResponse("[{ result : '%s', id : %s}]" % ("OK", username))

		if(pk != -1):
			bundle.obj = UserFeaturedPocket(
				create_date = timezone.now(),
				user_id = pk,
				pocket_id = f_id_pocket,
				)
			#guardamos el bolsillo
			bundle.obj.save()
			self.resultreg="OK"
		else:
			bundle.obj = UserFeaturedPocket(
				create_date = timezone.now(),
				user_id = pk,
				pocket_id = f_id_pocket,
				pocket_id_access = f_id_pocket,
				)
			#guardamos el bolsillo
			self.resultreg="KO"

		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle


class MultipartResource(object):
	def deserialize(self, request, data, format=None):
		if not format:
			format = request.META.get('CONTENT_TYPE', 'application/json')

		if format == 'application/x-www-form-urlencoded':
			return request.POST
		
		if format.startswith('multipart'):
			print data
			data = request.POST.copy()
			data.update(request.FILES)

			return data

		return super(MultipartResource, self).deserialize(request, data, format)


class Base64FileField(FileField):
	def dehydrate(self, bundle):

		if not bundle.data.has_key(self.instance_name) and hasattr(bundle.obj, self.instance_name):
			file_field = getattr(bundle.obj, self.instance_name)
			if file_field:
				try:
					content_type, encoding = mimetypes.guess_type(file_field.file.name)
					b64 = open(file_field.file.name, "rb").read().encode("base64")
					ret = {
						"name": os.path.basename(file_field.file.name),
						"file": b64,
						"content-type": content_type or "application/octet-stream"
					}
					return ret
				except:
					pass
		return None

	def hydrate(self, obj):
		print "hpola2"
		value = super(FileField, self).hydrate(obj)
		if value:
			value = SimpleUploadedFile(value["name"], base64.b64decode(value["file"]), getattr(value, "content_type", "application/octet-stream"))
		return value

		
class ResourceNewResource(ModelResource):

	resultreg = "KO"
	fil = Base64FileField('data')

	class Meta:
		queryset = res.objects.all()
		resource_name = 'newresource'
		# serializer = Serializer(formats=['json'])
		allowed_methods = ['get','post']
		always_return_data=True
		authorization = Authorization()

	def obj_create(self, bundle, request=None, **kwargs):
		r_name= bundle.data['name']
		r_type = bundle.data['type']
		r_URL = ""

		print bundle.FILES
		if(True):
			bundle.obj = res(
				name = r_name,
				type = r_type,
				create_date = timezone.now(),
				route = r_URL,
				data = fil
				)
			#guardamos el bolsillo
			bundle.obj.save() 
			self.resultreg="OK"
		else:
			undle.obj = res(
				name = r_name,
				type = r_type,
				create_date = timezone.now(),
				route = r_URL
				)
			self.resultreg="KO"

		return bundle


class PocketUpdateResource(ModelResource):

	resultreg = ""

	class Meta:
		resource_name = 'updatepocket'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['put']
		always_return_data = True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()
		object_class = Pocket

	def obj_update(self, bundle, request=None, **kwargs):
		p_user= bundle.data['id_user']
		p_name = bundle.data['name']
		id_pocket = bundle.data['id_pocket']
		p_type = bundle.data['type']
		p_desc = bundle.data['description']

		pocket_mem = None

		pocket_mem = Pocket.objects.get(id=int(id_pocket))


		if(pocket_mem == None): #si no existe
			#se define la respuesta
			bundle.obj=Pocket( name=p_name, 
				description=p_desc,
				type=p_type,
				user_id=p_user,
				create_date=timezone.now(),
				last_mod=timezone.now(),
				neg_votes = 0,
				pos_votes = 0,)
			print "no encontrado"
			self.resultreg="KO_"
		else:
			#se define la respuesta
			bundle.obj=Pocket( name=p_name, 
				description=p_desc,
				type=p_type,
				user_id=p_user,
				create_date=timezone.now(),
				last_mod=timezone.now(),
				neg_votes = 0,
				pos_votes = 0,)
			if(int(p_user) != pocket_mem.user.id):
				self.resultreg="KO"
				print int(p_user) != pocket_mem.user.id
			else:
				print "modifi"
				pocket_mem.name = p_name
				pocket_mem.description = p_desc
				pocket_mem.type = p_type
				pocket_mem.last_mod=timezone.now()
				pocket_mem.save()
				self.resultreg="OK"
		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle


class ObjectUpdateResource(ModelResource):

	resultreg = ""

	class Meta:
		resource_name = 'updateobject'
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['put']
		always_return_data = True
		authorization = PatitAuthorization()
		authentication = PatitAuthentication()
		object_class = Object

	def obj_update(self, bundle, request=None, **kwargs):
		o_user= bundle.data['id_user']
		id_object = bundle.data['id_object']
		o_name = bundle.data['name']
		id_pocket = bundle.data['id_pocket']
		o_description = bundle.data['description']


		object_mem = None

		object_mem = Object.objects.get(id=int(id_object))


		if(object_mem == None): #si no existe
			#se define la respuesta
			bundle.obj=Object( name=o_name, 
				description=o_description,
				type="",
				create_date=timezone.now(),
				last_mod=timezone.now(),
				n_mod = 0,
				od_object = "",
				pocket_id = id_pocket,)

			self.resultreg="KO_"
		else:
			#se define la respuesta
			bundle.obj=Object( name=o_name, 
				description=o_description,
				type=object_mem.type,
				create_date=object_mem.create_date,
				last_mod=timezone.now(),
				n_mod = object_mem.n_mod +1,
				od_object = object_mem.od_object,
				pocket_id = id_pocket,)

			if(int(o_user) != object_mem.pocket.user.id):
				self.resultreg="KO"
				print int(o_user) != object_mem.pocket.user.id
			else:
				print "modifi"
				object_mem.name = o_name
				object_mem.description = o_description
				object_mem.last_mod=timezone.now()
				object_mem.pocket_id = id_pocket
				object_mem.n_mod = object_mem.n_mod+1
				object_mem.save()
				self.resultreg="OK"
		return bundle

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		return bundle



class ResUpdateResource(ModelResource):

	resultreg = ""
	route = ""

	class Meta:
		resource_name = 'upload'
		queryset = res.objects.all()
		include_resource_uri = False
		serializer = Serializer(formats=['json'])
		allowed_methods = ['post']
		always_return_data = True
		authorization = PatitAuthorization()
		object_class = res


	def obj_create(self, bundle, request=None, **kwargs):
		name= bundle.data['name']
		text = bundle.data['text']

		print name
		print text

		#se define la respuesta
		bundle.obj=res(
			    create_date = timezone.now(),
				data=f,
				name=name,
				type = "ARCHIVE",
				route=settings.MEDIA_ROOT)
		bundle.obj.save()
		self.route = settings.MEDIA_ROOT + bundle.obj.name
		self.resultreg = "OK"
		
		return bundle

	

	def dehydrate(self, bundle):
		bundle.data['result'] = self.resultreg
		bundle.data['route'] = self.route
		return bundle
