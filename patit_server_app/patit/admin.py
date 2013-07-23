from patit.models import User,Pocket, Object, Comment, Resource, UserFeaturedPocket, SponsoredPocket, Vote
from django.contrib import admin

class UserAdmin(admin.ModelAdmin):
	list_display = ('nick','email','reg_date','was_create_recently','api_key')
	search_fields = ['nick','email','reg_date','was_create_recently']
	list_filter =['reg_date']

class PocketAdmin(admin.ModelAdmin):
	list_display = ('name','type','was_mod_rec')
	search_fields = ['name','type','last_mod']
	list_filter =['last_mod']

class ObjectAdmin(admin.ModelAdmin):
	list_display = ('name','type','last_mod','was_mod_recently')
	list_filter =['last_mod']
	search_fields = ['name','type','last_mod']

class CommentAdmin(admin.ModelAdmin):
	list_display = ('create_date','text')
	list_filter= ['create_date']

class ResourceAdmin(admin.ModelAdmin):
	list_display = ('name','type','route')
	search_fields = ['name','type','route']
	list_filter =['create_date']

class UserFeaturedPocketAdmin(admin.ModelAdmin):
	list_display = ('user','pocket','create_date')
	search_fields = ['create_date']
	list_filter = ['create_date']

class SponsoredPocketAdmin(admin.ModelAdmin):
	list_display = ('pocket','delete_time','create_date')
	search_fields = ['create_date','delete_time']
	list_filter = ['create_date','delete_time']

class VoteAdmin(admin.ModelAdmin):
	list_display = ('vote','user','pocket')
	search_fields = ['user','pocket']
	list_filter = ['user','pocket','vote']

admin.site.register(User, UserAdmin)
admin.site.register(Pocket, PocketAdmin)
admin.site.register(Object, ObjectAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(UserFeaturedPocket, UserFeaturedPocketAdmin)
admin.site.register(SponsoredPocket, SponsoredPocketAdmin)
admin.site.register(Vote, VoteAdmin)
