from django.db import models
import datetime
from django.utils import timezone
from django.conf import settings

class User(models.Model):
	"""
		Modelo que representa al usuario de la aplicación
	"""
	nick = models.CharField(max_length = 255)
	email = models.CharField(max_length = 511)
	password = models.CharField(max_length = 512)
	reg_date = models.DateTimeField('register date')
	od_user = models.CharField(max_length = 1024)
	api_key = models.IntegerField()
	def was_create_recently(self):
		return self.reg_date >= timezone.now() - datetime.timedelta(days = 1)
	was_create_recently.admin_order_field = 'reg_date'
	was_create_recently.boolean = True
	was_create_recently.short_description = 'Register recently?'


	def __unicode__(self):
		aux = self.nick + " " + self.email
		return aux

class Pocket(models.Model):
	"""
		Modelo que representa un bolsillo en la aplicación. Un bolsillo tiene parámetros para
		definir sus valores.
	"""
	name = models.CharField(max_length = 511)
	description = models.CharField(max_length = 1023)
	type = models.CharField(max_length = 255)
	create_date = models.DateTimeField('creation date')
	last_mod = models.DateTimeField('last modification')
	user = models.ForeignKey(User, related_name='pockets')
	pos_votes = models.IntegerField()
	neg_votes = models.IntegerField()
	def was_mod_rec(self):
		return True
	was_mod_rec.admin_order_field = 'last_mod'
	was_mod_rec.boolean = True
	was_mod_rec.short_description = 'Changed recently?'

	def __unicode__(self):
		aux = self.name + " t: " + self.type 
		return aux

class Object(models.Model):
	"""
		Representa los objetos que cada bolsillo contiene
	"""
	name = models.CharField(max_length = 511)
	type = models.CharField(max_length = 255)
	last_mod = models.DateTimeField('last modification')
	create_date = models.DateTimeField('creation date')
	n_mod = models.IntegerField()
	description = models.CharField(max_length = 255)
	od_object = models.CharField(max_length = 1023)
	pocket = models.ForeignKey(Pocket, related_name='objs')
	url = models.CharField(max_length=1023)
	def was_mod_recently(self):
		return self.last_mod >= timezone.now() - datetime.timedelta(days = 1)
	was_mod_recently.admin_order_field = 'last_mod'
	was_mod_recently.boolean = True
	was_mod_recently.short_description = 'Changed recently?'

	def correct_time(self):
		return self.last_mod > timezone.now()
	
	def __unicode__(self):
		aux = self.name + " t: " + self.type 
		return aux

class Comment(models.Model):
	"""
		Comentario perteneciente a un bolsillo
	"""
	create_date = models.DateTimeField('create date')
	text = models.CharField (max_length = 255)
	pocket = models.ForeignKey(Pocket, related_name='comments')
	user_nick = models.CharField( max_length = 255)
	def __unicode__(self):
		return self.text[0:20]

class UserFeaturedPocket(models.Model):
	"""
		Crea una instancia para indicar que un usuario ha destacado un bolsillo
	"""
	create_date = models.DateTimeField('followed from')
	user = models.ForeignKey(User, related_name='featuredpocketuser')
	pocket = models.ForeignKey(Pocket, related_name='featuredpocket')

class SponsoredPocket(models.Model):
	"""
		Modelo para hacer sponsorizado un bolsillo
	"""
	create_date = models.DateTimeField('Begin date')
	pocket = models.ForeignKey(Pocket, related_name='sponsoredpocket')
	delete_time = models.DateTimeField('Finish date')

class Vote(models.Model):
	"""
		Representa un voto en el sistema
	"""
	vote = models.IntegerField()
	user = models.ForeignKey(User, related_name='voteuser')
	pocket = models.ForeignKey(Pocket, related_name='votepocket')

from django.conf import settings

class Resource(models.Model):
	"""
		Representa un fichero en el sistema de subida de ficheros
	"""
	name = models.CharField(max_length = 511)
	type = models.CharField(max_length = 255)
	create_date = models.DateTimeField('register date')
	route = models.CharField(max_length = 511)
	data = models.FileField(upload_to=settings.MEDIA_ROOT)

	def __unicode__(self):
		aux = self.name + " " + self.type
		return aux
		


	
	
