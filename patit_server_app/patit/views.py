# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from patit.models import User, Pocket, Comment, Object, Resource
from django import http
from django.shortcuts import render_to_response
from django.conf import settings
from django.utils import timezone
from django.http import HttpResponseRedirect
from django.shortcuts import render
import json as simplejson
import os
import base64
import cStringIO
from django.utils.encoding import smart_str, smart_unicode
import uuid
import StringIO
from django.core.files import File

URL = "http://192.168.0.195/media/"

# El sistema no tiene vistas, puesto que la web se ha resuelto mediante llamadas ajax al servidor

def index(request):
	return HttpResponse("Hello, world. You're at the poll index.")

def user(request, user_id):
	return HttpResponse("Hello, this is a result for the user %s." % user_id )

# Sistema simple de subida de ficheros al servidor
def upload_file(request):
	if request.method == 'POST':
		try:
			print "file"
			new_file = Resource(name=request.FILES['file'].name,data=request.FILES['file'],type = "ARCHIVE",create_date=timezone.now(), route=settings.MEDIA_ROOT)

			new_file.save()

			filert = new_file.data.name.split("/")
			datasrc = filert[len(filert)-1]
			
			print URL+datasrc

			response_data={"name": new_file.name , "route":URL+datasrc, "data":datasrc,"result":"OK"}
			return HttpResponse(simplejson.dumps(response_data), mimetype='application/json')

		except Exception: 
			js = simplejson.loads(request.body)
			name = str(js.get("name"))
			text = str(js.get("text"))
			unique_filename = uuid.uuid4()
			
			f = open(settings.MEDIA_ROOT + str(unique_filename) +".html","wb+")
			f.write(text)
			myfile = File(f)
			new_file = Resource()
			new_file.name = f.name
			new_file.create_date = timezone.now()
			route = settings.MEDIA_ROOT
			new_file.data.save(f.name, myfile)

			filert = new_file.data.name.split("/")
			datasrc = filert[len(filert)-1]
			
			print URL+datasrc

			response_data={"name": new_file.name , "route":URL+datasrc, "data":datasrc,"result":"OK"}
			return HttpResponse(simplejson.dumps(response_data), mimetype='application/json')

  		pass
	else:
		response_data={"success": "No a post request"}
		return HttpResponse(simplejson.dumps(response_data), mimetype='application/json')

def upload_file_64(request):
	if request.method == 'POST':

		file = cStringIO.StringIO(base64.b64decode(request.POST['data']))
		return HttpResponse(simplejson.dumps(response_data), mimetype='application/json')
	else:
		response_data={"success": "No a post request"}
		return HttpResponse(simplejson.dumps(response_data), mimetype='application/json')
