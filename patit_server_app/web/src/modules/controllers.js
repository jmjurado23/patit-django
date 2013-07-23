


var yourpockets = new YourPocketView();
var randompockets = new RandomPocketView();
var featuredpockets = new FeaturedPocketView();
var sponsored = new SponsoredPocketView();
var searchpockets = new SearchPocketView();
var one_user = new OneUserView();
var one_pocket = new OnePocketView();
var one_object = new OneObjectView();

var AppRouter = Backbone.Router.extend({

		routes: {
			"help":                 "help",    // #help
			"" : "main",
			"#" : "main",
			"your":"yourpockets",
			"random" : "randompockets",
			"featured" : "featuredpockets",
			"sponsored" : "sponsoredpockets",
			"pocket/:poc" : "pocket",
			"object/:obj" : "object",
			"user/:user" : "user",
			"search/:query": "search"
		  },
		  testCookie: function(){
		  	var state = $.cookie("state")
		  	if(state == 'LOGIN')
		  		return true
		  	return false
		  },

		  help: function() {
			alert("help")
		  },

		  search: function(query) {
			console.log("SEARCH_VIEW");
    	  	searchpockets.refresh({ query : query});
    	  	searchpockets.render();
		  },
		  user: function(user){
		  	console.log("USER_VIEW");
		  	one_user.charge({ nick_user : user});
		  },
		  pocket: function(poc) {

		  	console.log("POCKET_VIEW");
		  	one_pocket.charge({ n_pocket : poc});
		  },
		  object: function(obj) {

		  	console.log("OBJECT_VIEW");
		  	one_object.charge({ n_object : obj});
		  },
		  main : function () {

		   console.log("MAIN_VIEW");
		   main_view.render();
    	  },
    	  yourpockets : function () {

    	  	console.log("YOUR_VIEW");
    	  	yourpockets.refresh();
    	  	yourpockets.render();
    	  },
    	  randompockets : function () {

    	  	console.log("RANDOM_VIEW");
    	  	randompockets.refresh();
    	  	randompockets.render();
    	  },
    	  featuredpockets : function () {

    	  	console.log("FEATURED_VIEW");
    	  	featuredpockets.refresh();
    	  	featuredpockets.render();
    	  },
    	  sponsoredpockets : function () {
    	  	console.log("SPONSORED_VIEW");
    	  	sponsored.refresh();
    	  	sponsored.render();
    	  }

});


var login_view = new LoginTaskView({});

var new_pocket_form =  new NewPocketForm();
var edit_pocket_form =  new EditPocketForm();
var edit_object_form =  new EditObjectForm();
var navigate_view = new NavigateView();
var main_view =  new MainView();
var new_comment = new NewCommentView();
var r_pocket = new RemovePocketForm(); 
var r_object = new RemoveObjectForm(); 
var r_user = new RemoveUserForm();



var upload_img = new UploadingView({});
var image_object = new NewImageObjectTypeView({});

var upload_music = new UploadingView({});
var music_object = new NewMusicObjectTypeView({});

var upload_text = new UploadingView({});
var text_object = new NewTextObjectTypeView({});

var upload_url = new UploadingView({});
var url_object = new NewUrlObjectTypeView({});

var n_obj_type =  new NewObjectTypeView({ el : $("#alert_container")});

//se inicializan los datos
var poc_your = new YourCollection([],{ query : "" });
var poc_featured = new FeaturedCollection([],{ query : "" });
var poc_random = new RandomCollection([],{ query : "" });
var poc_sponsored = new SponsoredCollection([],{ query : "" });
var poc_search_user = new SearchUserCollection([],{ query : "" });
var poc_search_pockets = new SearchPocketsCollection([],{ query : "" });
var featured = new FeaturedRefresh();


// Instantiate the router
var app_router = new AppRouter();
// Start Backbone history a neccesary step for bookmarkable URL's
Backbone.history.start();
