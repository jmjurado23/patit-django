from django.conf.urls import patterns, include, url
from api.api import *
from tastypie.api import Api
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

#resources for the API
user_resource = UserResource()


v1_api = Api(api_name = 'v1')
v1_api.register(UserResource())
v1_api.register(PocketResource())
v1_api.register(CommentResource())
v1_api.register(ObjectResource())
v1_api.register(RegisterPatit())
v1_api.register(LoginPatit())
v1_api.register(ApiKeyResource())
v1_api.register(PocketNewResource())
v1_api.register(PocketRemoveResource())
v1_api.register(UserRemoveResource())
v1_api.register(CommentNewResource())
v1_api.register(ObjectNewResource())
v1_api.register(ResourceNewResource())
v1_api.register(UserFeaturedPocketResource())
v1_api.register(FeaturedResource())
v1_api.register(FeaturedRemoveResource())
v1_api.register(SponsoredPocketResource())
v1_api.register(VotePocketResource())
v1_api.register(PocketUpdateResource())
v1_api.register(ObjectRemoveResource())
v1_api.register(ObjectUpdateResource())
v1_api.register(ResUpdateResource())
v1_api.register(NoPassEmail())

urlpatterns = patterns('',
	url(r'^api/', include(v1_api.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
    url(r'^api/upload/','patit.views.upload_file'),
    url(r'^api/upload64/','patit.views.upload_file_64'),
    url(r'^web/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.WEB_ROOT}),
)
