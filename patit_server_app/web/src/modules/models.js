var urlBASE = "http://192.168.0.195/api/v1/"
var urlBASEUpload = "http://192.168.0.195/api/upload/?format=json"
//var urlBASE = "http://localhost/api/v1/"

var User = Backbone.Model.extend({
	defaults: {
		nick: 'Fetus',
		email: 'example@email',
		reg_date: '14/11/2010',
		id: 'id_default',

	},
	urlRoot : "/api/v1/user/",
	initialize: function(attrs, opts){
    }
});

var Comment = Backbone.Model.extend({
	defaults: {
		text: 'text_comment_default',
		user: 'nick_user_default',
		date: '14/11/2010',
		id: 'id_default'
	},
	urlRoot : urlBASE+"/api/v1/comment/",
	initialize: function(attrs, opts){
    }
});

var ObjectP = Backbone.Model.extend({
	defaults: {
		id: 'id_default',
		type: 'type_obect_default',
		name: 'name',
		description: 'default_descript',
		create_date: '14/11/2010',
		last_mod: '14/11/2010',
		url: 'www.jmj.es',
		id_pocket: 'id_pocket',
	},
	urlRoot : "/api/v1/object/",
	initialize: function(attrs, opts){
    }
});

var Pocket = Backbone.Model.extend({
	defaults: {
		name: 'pocket_name',
		create_date: '14/11/2010',
		description: 'default_descript',
		type: 'type',
		id_user: 'id_user',
		pos_votes: -1,
		neg_votes: -1,
		id_pocket: 'def',
		comments: [],
		objects: []
	},
	

	initialize: function(attrs, opts){
		console.log("new Pocket");
    },

	addObject: function( ObjectP ){
		var objects_array = this.get("objects");
		object_array.push( ObjectP );
		this.set({ objects: object_array });
	},
	addComment: function( Comment ){
		var comment_array = this.get("comments");
		comment_array.push( Comment );
		this.set({ comments: comment_array });
	},
});

var PocketsCollection = Backbone.Collection.extend({
    model: Pocket,
    url : "/api/v1/pocket/?callback=?"
});





var LoginModel = Backbone.Model.extend({
	url: urlBASE+"login/",
	defaults: {
		nick: '',
		password: ''
	}
	
});

var DataAppWeb = Backbone.Model.extend({

	defaults: {
		nick: '',
		password: '',
		state: 'STARTED',
		pocket: '',
		featured: [],
		id_featured: []
	}
});

var NickModel = Backbone.Model.extend({
	
	defaults: {
		nick: ''
	},
	initialize : function(models, options) {
    	this.nick = options.nick;
  	},
	url : function() {
	 	console.log(urlBASE+"user/"+this.nick);
    	return urlBASE+"user/"+this.nick;

    }
});

var RegisterModel = Backbone.Model.extend({

	defaults: {
		nick : '',
		email : '',
		password : '',
		id : ''
	},
	sync: function(method, model, options) {
        return Backbone.sync("create", model, options);
    },
	url :  urlBASE+"register/"
});


var PocketAbstract =  Backbone.Model.extend({
	 defaults : {
       // default attributes
    }
});



var YourCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"user/"+this.query;
  },
  parse : function(data) {

    console.log(data);
    return data.pockets;
  }
});

var FeaturedCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"user/"+this.query;
  },
  parse : function(data) {

    console.log(data);
    return data.featured;
  }
});

var RandomCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"pocket/?format=json&ordering='?'&limit=20";	
  },
  parse : function(data) {

    console.log(data);
    return data.objects;
  }
});

var SponsoredCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"sponsored/?format=json";	
  },
  parse : function(data) {

    console.log(data);
    return data.objects;
  }
});


var SearchUserCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"user/?nick="+this.query;
  },
  parse : function(data) {
  	
    try {
		if(data.objects[0].pockets != null){
    		console.log(data.objects[0].pockets);
    		return data.objects[0].pockets;
    	}
		} catch(err){
			return false;
        }
  }
});
var SearchPocketsCollection = Backbone.Collection.extend({
  model : PocketAbstract,
  initialize : function(models, options) {
    this.query = options.query;
  },
  url : function() {
    return urlBASE+"pocket/?name="+this.query;
  },
  parse : function(data) {
  	 try {
		if(data.objects[0] != null){
			console.log("DATA OBJECT");
    		console.log(data.objects[0]);
    		return data.objects[0];
    	}
		} catch(err){
			return false;
        }
  
  }
});


var NewPocketModel = Backbone.Model.extend({

	defaults: {
		nick : '',
		name : '',
		password : '',
		type : '',
		description : ''
	},
	url :  urlBASE+"newpocket/?format=json"
});
var NewCommentModel = Backbone.Model.extend({

	defaults: {
		nick : '',
		text : '',
		id : ''
	},
	
	sync: function(method, model, options) {
        return Backbone.sync("create", model, options);
    },
	url :  urlBASE+"newcomment/?format=json"
});


var NoKeyModel = Backbone.Model.extend({

	defaults: {
		nick : '',
		email:''
	},
	
	sync: function(method, model, options) {
        return Backbone.sync("create", model, options);
    },
	url :  urlBASE+"no_key/?format=json"
});


var VoteModel = Backbone.Model.extend({

	defaults: {
		id_user : '',
		id_pocket : '',
		voted : '',
	},
	url :  urlBASE+"vote/?format=json"
});

var FeatureModel = Backbone.Model.extend({

	defaults: {
		nick : '',
		id_pocket : ''
	},
	url :  urlBASE+"newfeatured/?format=json"
});

var UpdatePocketModel = Backbone.Model.extend({

	defaults: {
		name : '',
		id_user : '',
		id_pocket : '',
		type : '',
		description:'',

	},
	url :  urlBASE+"updatepocket/"+self.id_pocket+"?format=json",
	sync: function(method, model, options) {
        return Backbone.sync("update", model, options);
    },
});

var UpdateObjectModel = Backbone.Model.extend({

	defaults: {
		name : '',
		id_user : '',
		id_pocket : '',
		id_object : '',
		description:'',

	},
	url :  urlBASE+"updateobject/"+self.id_object+"?format=json",
	sync: function(method, model, options) {
        return Backbone.sync("update", model, options);
    },
});

var ResourceUploadModel = Backbone.Model.extend({

	defaults: {
		name:'',
		text:''
	},
	url :  urlBASEUpload
});

var DeleteFeatureModel = Backbone.Model.extend({

	defaults: {
		id : ''
	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "deletefeatured/"+this.query+"/?format=json";
	},
	destroy: function() {
	    console.log(this);
	    console.log("model remove: "+this.get('id'));
	    return Backbone.Model.prototype.destroy.call(this);
    },
});
var DeletePocketModel = Backbone.Model.extend({

	defaults: {
		id : '',
		user_id :'',
		api_key : ''
	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "deletepocket/"+this.query+"/?format=json";
	},
	destroy: function() {
		 console.log("model remove: "+this.get('id'));
	     return Backbone.Model.prototype.destroy.call(this);
     }
     // save: function(attributes, options) {
     //    attributes || (attributes = {});
     //    attributes['headers'] = {'user_id': self.user_id};
     //    attributes['headers'] = {'api_key': self.api_key};
     //    return Backbone.Model.prototype.save.call(this, attributes, options);
     // }
});

var DeleteUserModel = Backbone.Model.extend({

	defaults: {
		id : ''
	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "deleteuser/"+this.query+"/?format=json";
	},
	destroy: function() {
	    return Backbone.Model.prototype.destroy.call(this);
    },
});
var DeleteObjectModel = Backbone.Model.extend({

	defaults: {
		id : ''
	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "deleteobject/"+this.query+"/?format=json";
	},
	destroy: function() {
	    return Backbone.Model.prototype.destroy.call(this);
    },
});

var OnePocket = Backbone.Collection.extend({

	defaults: {

	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "pocket/?id="+this.query
	},
	parse : function(data) {

    console.log(data.objects[0]);
    return data.objects[0];
  }
});

var OneUser = Backbone.Model.extend({

	 
	  defaults: {

	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "user/"+this.query
	},
	parse : function(data) {

    console.log(data);
    return data;
  }
});
var OneObject = Backbone.Collection.extend({

	defaults: {

	},
	initialize : function(models, options) {
    	this.query = options.query;
  	},
  	url : function() {
		return urlBASE + "object/?id="+this.query
	},
	parse : function(data) {

    console.log(data.objects[0]);
    return data.objects[0];
  }
});


var ResourceModel = Backbone.Model.extend({

	defaults: {
		name:'',
        type: '',
        description: '',
        id_pocket: '',
        nick: '',
        url: ''
	},
	url :  urlBASE+"newobject/?format=json"
});


var FileToDjango = Backbone.Model.extend({
	defaults: {
	},
	url: urlBASEUpload,
  readFile: function(file) {

  		console.log(file)
  		self = this;
  		var reader = new FileReader();
  		for (var i = 0, f; f = file[i]; i++) {
	       
	        // closure to capture the file information.
	        reader.onload = (function(theFile, theId) {
			    return function(e) {
			    	console.log("theFile")
			    	console.log(theFile);
	                //set model
	                self.set({file: theFile.name, data: e.target.result});

	            };
	        })(f);
	      }
        // Read in the image file as a data URL.
        reader.readAsDataURL(file[0],this);
    }  

});




//Datos de la aplicación Web
var dataWeb = new DataAppWeb();