from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from patit.models import User, Pocket, Comment, Object, UserFeaturedPocket, SponsoredPocket, Vote, Resource
from patit.models import User
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.http import QueryDict
import simplejson 

class PatitAuthentication(Authentication):
	"""
    Authentica al usuario en la aplicación. Para ello es necesario responder con el token que el sistema da al usuario al
	loguear correctamente. Sistema de logueo sencillo. PAra mayor protección utilizar OAuth
    """
	def is_authenticated(self, request, **kwargs):
		user = User.objects.get(id=int(request.META.get("HTTP_USER_ID")))

		if(user.api_key == int(request.META.get("HTTP_API_KEY"))):
			return True

		return False

class PatitAuthorization(Authorization):
	"""
	Clase que autoriza recursos de forma manual en la aplicación.
	"""
	def is_authorized(self, request, object=None):
		
		elem = str(request.path.split('/')[3])

		pocket_p = None
		object_o = None
		featured_f = None
		user_u = None

		if (elem == 'deletepocket');
			num = int(request.path.split('/')[4])
			pocket_p = Pocket.objects.get(id = num)
			if(int(request.META.get("HTTP_USER_ID")) == pocket_p.user.id):
				return True
			else:
				return False

		elif (elem == 'deleteuser'):
			num = int(request.path.split('/')[4])
			user_u = User.objects.get(id = num)
			if(int(request.META.get("HTTP_USER_ID")) == user_u.id):
				return True
			else:
				return False

		elif (elem == 'deleteobject'):
			num = int(request.path.split('/')[4])
			object_o = Object.objects.get(id = num)
			if(int(request.META.get("HTTP_USER_ID")) == object_o.pocket.user.id):
				return True
			else:
				return False

		elif (elem == 'deletefeatured'):
			num = int(request.path.split('/')[4])
			featured_f = UserFeaturedPocket.objects.get(id = num)
			if(int(request.META.get("HTTP_USER_ID")) == featured_f.user.id):
				return True
			else:
				return False

		elif (elem == 'newobject'):
			js = simplejson.loads(request.body)
			pocket_p = Pocket.objects.get(id = int(js.get("id_pocket")))
			if(int(request.META.get("HTTP_USER_ID")) == pocket_p.user.id):
				return True
			else:
				return False

		elif (elem == 'updateobject'):
			js = simplejson.loads(request.body)
			pocket_p = Pocket.objects.get(id = int(js.get("id_pocket")))
			object_o =  Object.objects.get(id = int(js.get("id_object")))
			if(int(request.META.get("HTTP_USER_ID")) == pocket_p.user.id & int(request.META.get("HTTP_USER_ID")) == object_o.pocket.user.id):
				return True
			else:
				return False

		elif (elem == 'updatepocket'):
			print "POCKET UPDATE"
			js = simplejson.loads(request.body)
			pocket_p = Pocket.objects.get(id = int(js.get("id_pocket")))
			if(int(request.META.get("HTTP_USER_ID")) == pocket_p.user.id ):
				return True
			else:
				return False
		return False

