/**
View.js 
Autor: Juan Manuel Jurado Ruiz
Descripción: Este archivo contiene las vistas de la aplicación Web Patit. 
Proyecto find e carrera de Ingerniería Informática. En el se tienen todas las 
vistas de la aplicación. 
*/





//Vista PRINCIPAL
var MainView = Backbone.View.extend({
    
    el : $("#sub_main_container"),
    template : _.template( $("#MainTemplate").html()),
    initialize : function () {
        this.render();
    },
    render : function () {
        $(this.el).html(this.template());
        console.log("SHOW_MAIN");
        return this;
    },
    remove : function(){
    }

});

var NavigateView = Backbone.View.extend({
    el : $("#container_nav_tab"),

    initialize : function(){

    },
    events: {
            "click #tab_your_pocket": "navigateYour",
            "click #tab_random_pocket": "navigateRandom",
            "click #tab_featured_pocket": "navigateFeatured",
            "click #tab_sponsored_pocket": "navigateSponsored"
    },
    navigateYour : function(){
         app_router.navigate("your",{trigger: true});
    },
    navigateRandom : function(){
         app_router.navigate("random",{trigger: true});
    },
    navigateFeatured : function(){
         app_router.navigate("featured",{trigger: true});
    },
    navigateSponsored : function(){
         app_router.navigate("sponsored",{trigger: true});
    }
});



//refrescar los destacados
var FeaturedRefresh = Backbone.View.extend({
    initialize : function(){
        if(dataWeb.get("state") == "LOGIN"){
               
            poc_featured.query = dataWeb.get("nick");

            poc_featured.fetch({
                async: false,
                success: function (collection, response) {

                     dataWeb.featured = null;
                     var i=0;
                     for(;i< dataWeb.get("featured").length;i++){
                        dataWeb.get("featured").pop();
                        dataWeb.get("id_featured").pop();
                     }
                     _.forEach(response.featured, function (item){
                        dataWeb.get("featured").push(item.pocket.id);
                        dataWeb.get("id_featured").push(item.id);
                    }, this);

               } 
            });
        }
    }
});



//Vista de LOGIN
var LoginTaskView = Backbone.View.extend({

    el : $("#login_container"),
    template : _.template( $("#LoginTemplate").html()),

    initialize : function () {

        console.log("STATE ")
        console.log($.cookie("state"))

        if( ($.cookie("state")) != "LOGIN"){
            console.log("no loged")
            this.render();
        }
        else{
            console.log("loged")
            var login_success = new LoginSuccess();
        }

    },
    events: {
            "click #button_login": "loginUser",
            "click #button_reg": "registerUser"
    },
    loginUser : function (event) {

        //si se han introducido los valores de login, se intenta hacer el login
        if(($("#input_user").val())!="" && ($("#input_pass").val())!="" )
        {
        

             var login3 = new LoginModel({

                nick: $("#input_user").val(),
                password: $("#input_pass").val()

             });



             login3.save({  nick: $("#input_user").val(),
                password: $("#input_pass").val()}, {

                async: false,
                //si no hay algún problema con el servidor
                error: function(model, response){
                    var error_server = new ErrorServer();
                    console.log('FAIL');
                    console.log(response);
                    

                 },
                //si hay conexión 
                success : function(model, response){

                     //si ha habido éxito con el login
                     if( response.result == "OK" ){
                        //se almacenan los datos del programa
                        dataWeb = new  DataAppWeb({
                            nick: response.nick,
                            id: response.id,
                            api_key : response.api_key,
                            password: $("#input_pass").val(),
                            state: "LOGIN",
                            featured: [],
                            id_featured:[]
                        });

                        $.cookie("nick",response.nick, { path: '/' })
                        $.cookie("id",response.id, { path: '/' })
                        $.cookie("api_key",response.api_key, {path: '/'})
                        $.cookie("password",$("#input_pass").val(), { path: '/' })
                        $.cookie("state","LOGIN", { path: '/' })

                        console.log( $.cookie("nick"))
                        console.log( $.cookie("api_key"))
                        console.log( dataWeb.get("api_key"))

                        //se cambia la vista de login
                        var login_success = new LoginSuccess();
                        nav_tab.render();
                        featured.initialize();
                        app_router.navigate("your",true);
                        
                     }
                     else{ //si los datos son incorrectos
                        console.log("INCORRECTO");
                        var login_error_message = new LoginErrorMessage();
                     }

                  }
                  
            });
        }
        else{
            alert("Debes introducir los campos antes de poder loguear");

        }
    },
    registerUser : function(){
        var register = new RegisterForm();
    },
    render : function () {
        $(this.el).html(this.template());
        
        return this;
    } 

});

//Vista de Error del Servidor
var ErrorServer = Backbone.View.extend({

     el : $("#sub_main_container"),
    template : _.template( $("#ErrorServerTemplate").html()),
    initialize : function () {
       this.render();
    },
    render : function () {
        $(this.el).html(this.template());
        
        return this;
    }

});





//Vista Check Nick OK
var CheckNickOK = Backbone.View.extend({

    
    template : _.template($("#CheckTemplateOK").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Nick KO
var CheckNickKO = Backbone.View.extend({

    template : _.template($("#CheckTemplateKO").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista de enviar contraseña
var NewPassSend = Backbone.View.extend({

    template : _.template($("#NewPassSendTemplate").html()),
    initialize : function(){
        $("#alert_container_msj").html(_.template($("#NewPassSendTemplate").html()));
        $("#alert_container_msj").modal("show");
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Eliminar bolsillo sin éxito
var RemovePocketKO = Backbone.View.extend({

    template : _.template($("#KORemovePocketTemplate").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Eliminar bolsillo Éxito
var RemovePocketOK = Backbone.View.extend({

    template : _.template($("#OKRemovePocketTemplate").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Eliminar objeto sin éxito
var RemoveObjectKO = Backbone.View.extend({

    template : _.template($("#KORemovePocketTemplate").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Eliminar bolsillo Éxito
var RemovePocketOK = Backbone.View.extend({

    template : _.template($("#OKRemovePocketTemplate").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Pass
var CheckPass= Backbone.View.extend({

    template : _.template($("#CheckTemplatePass").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Pass
var CheckPassLen= Backbone.View.extend({

    template : _.template($("#CheckTemplatePassLen").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Pass
var CheckEmptyForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateEmptyForm").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Name Pocket
var CheckNamePocketForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateNamePocketForm").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Name Image Object
var NoNameImageForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateNameImage").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        console.log(this.el)
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Image Object
var NoImageForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateImage").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});

//Vista Check Name Music object
var NoNameMusicForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateNameMusic").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        console.log(this.el)
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Object
var NoMusicForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateMusic").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Name Text object
var NoNameTextForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateNameText").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        console.log(this.el)
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Object
var NoTextForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateText").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Name Url object
var NoNameTextForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateNameUrl").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        console.log(this.el)
        $(this.el).html(this.template());
        return this;
    }

});
//Vista Check Object
var NoUrlForm= Backbone.View.extend({

    template : _.template($("#CheckTemplateUrl").html()),
    initialize : function(){
        this.render();
    },
    render : function(){
        $(this.el).html(this.template());
        return this;
    }

});




//Vista de Nav Tab Superior
var NavTabPocket = Backbone.View.extend({
    el : $("#container_nav_tab"),
    template : _.template($("#TemplateNavTab").html()),
    initialize : function(){
        
    },
    render : function(){

        $(this.el).fadeIn(300);
        $(this.el).html(this.template());
        return this;
    },
    remove : function(){
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);

    }
});





//Vista de Registro
var RegisterForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#RegisterTemplate").html()),
    initialize : function(){
        this.render();
    },
    events : {
        "click #ok_button_register" : "Register",
        "click #ko_button_register" : "CancelRegister",
        "click #check_nick_button" : "CheckNick",
        "keyup input#inputNick": "CheckNick"
    },
    render : function() {
        $("#alert_container").html(_.template($("#RegisterTemplate").html()));
        $("#alert_container").modal("show");

        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    Register : function(){
         
         var reg = new RegisterModel({

                nick: $("#inputNick").val(),
                password: $("#inputPassword").val(),
                email : $("#inputEmail").val()

             });

             if( $("#inputNick").val().length == 0  || $("#inputEmail").val().length == 0 )
             {
                var empty_form = new CheckEmptyForm({el:$("#check_pass_result_div")});
             }
             else
             { 
                if($("#inputPassword").val().length <6){
                var pass_len = new CheckPassLen({el:$("#check_pass_result_div")});
                }

                 else{
                    if( ($("#inputPassword").val() == $("#reinputPassword").val()))
                    {

                    reg.save( {nick: $("#inputNick").val(),
                password: $("#inputPassword").val(),
                email : $("#inputEmail").val()},{

                    async: false,
                    //si no hay algún problema con el servidor
                    error: function(model, response){
                        var error_server = new ErrorServer();
                        console.log(model.toJSON());
                        console.log('FAIL');
                        

                     },
                    //si hay conexión 
                    success : function(model, response){

                         //si ha habido éxito con el login
                         if( response.result == "OK" ){
                             //se almacenan los datos del programa
                            dataWeb = new  DataAppWeb({
                                nick: response.nick,
                                id: response.id,
                                password: $("#input_pass").val(),
                                state: "LOGIN",
                                featured: [],
                                id_featured:[]
                            });

                            $.cookie("nick",response.nick, { path: '/' })
                            $.cookie("id",response.id, { path: '/' })
                            $.cookie("password",$("#input_pass").val(), { path: '/' })
                            $.cookie("state","LOGIN", { path: '/' })

                            $("#alert_container").modal("hide");

                            //se cambia la vista de login
                            var login_success = new LoginSuccess();
                            nav_tab.render();
                            featured.initialize();
                            app_router.navigate("your",true);
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                             var check = new CheckNickKO({el:$("#check_result_div")});
                         }

                      }
                          
                    });
                 }
                 else{
                      var pass_equal = new CheckPass({el:$("#check_pass_result_div")});
                    }
                }
            }

    },
    CancelRegister : function() {
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    },
    CheckNick : function(e) {
        console.log($("#inputNick").val())
        if($("#inputNick").val() != ''){

         var checkNick = new NickModel({

                nick: $("#inputNick").val()

             },
             {nick: $("#inputNick").val()});



            checkNick.fetch({

                async: false,
                //si no hay algún problema con el servidor
                error: function(model, response){
                    var check = new CheckNickOK({el:$("#check_result_div")});
                    console.log('FAIL');
                    

                 },
                //si hay conexión 
                success : function(model, response){
                     var check = new CheckNickKO({el:$("#check_result_div")});
                  }
                  
            });
    }else{
        var check = new CheckNickKO({el:$("#check_result_div")});
    }
}

});


//Vista vacía de mensajes
var EmptyMessageView = Backbone.View.extend({
    
    el : $("#alert_container"),
    template : _.template($("#EmptyMessageTemplate").html()),
    initialize : function(){
        this.render();
    },
    render : function() {
        $(this.el).fadeIn(300);
        $(this.el).html(this.template());
        return this;
    }
});





//Vista Crear bolsillo
var NewPocketForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewPocketTemplate").html()),
    initialize : function(){
        
    },
    events : {
        "click #ok_button_new_pocket" : "NewPocket",
        "click #ko_button_new_pocket" : "CancelNewPocket",
    },
    render : function() {
        $("#alert_container").html(_.template($("#NewPocketTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    NewPocket : function(){
         
           $("#alert_container").modal("hide");
          var new_pocket = new NewPocketModel({

                 nick: dataWeb.get("nick"),
                 name: $("#inputNamePocket").val(),
                 type : $("#inputTypePocket").val(),
                 description : $("#inputDescriptionPocket").val()});

                //se comprueba que el nombre no esté vacío
                if($("#inputNamePocket").val().length == 0){

                    var no_name = new CheckNamePocketForm({el:$("#check_name_div")});
                }
                else{ //si se ha escrito un nombre para el bolsillo


                    new_pocket.save( {},{

                        async: false,
                    //si no hay algún problema con el servidor
                     error: function(model, response){
                         var error_server = new ErrorServer();
                         console.log(model.toJSON());
                         console.log('FAIL');
                        

                      },
                    //si hay conexión 
                    success : function(model, response){

                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            yourpockets.refresh();
                            yourpockets.render();
                            app_router.navigate("your",true);
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                             //var check = new CheckNickKO({el:$("#check_result_div")});
                         }

                      }
                          
                    });
                }

    },
    CancelNewPocket : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista Editar bolsillo
var EditPocketForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#EditPocketTemplate").html()),
    initialize : function(){

    },
    events : {
        "click #ok_button_edit_pocket" : "EditPocket",
        "click #ko_button_edit_pocket" : "CancelEditPocket",
    },
    render : function() {
        $("#alert_container").html(_.template($("#EditPocketTemplate").html()));
        $("#alert_container").modal("show");

        console.log(this.model.toJSON().name)
        console.log(this.model.toJSON().description)

        $(this.el).fadeIn(150);
        $(this.el).html(this.template());

        $("#inputNamePocketEdit").val(this.model.toJSON().name)
        $("#inputDescriptionPocketEdit").val(this.model.toJSON().description)
        $("#inputTypePocketEdit option[value="+this.model.toJSON().type+"]").attr("selected", "selected")
        return this;
    },
    EditPocket : function(){
         
         if($("#inputNamePocketEdit").val()!=''){
          console.log("EDIT POCKET")
          var update_pocket = new UpdatePocketModel({
            id_pocket: this.model.toJSON().id,
            id_user: dataWeb.get("id"),
            name: $("#inputNamePocketEdit").val(),
            description: $("#inputDescriptionPocketEdit").val(),
            type: $("#inputTypePocketEdit").val()
          })
          $("#alert_container").modal("hide");
          update_pocket.save({},{
                    
                    async: false,
                    //si no hay algún problema con el servidor
                     error: function(model, response){

                         var error_server = new ErrorServer();
                         console.log(response)
                         console.log(model)
                         console.log('FAIL EDIT');

                      },
                    //si hay conexión 
                    success : function(model, response){
                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                            setTimeout(function(){$("#alert_container")},400);
                         }

                      }
          });

         app_router.navigate("your",true);
         yourpockets.refresh();
         app_router.navigate("pocket/"+this.model.toJSON().id,true);

      }
      else{
        console.log("DEBES INTRO UN NOMBRE")
      }
    },
    CancelEditPocket : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});


//Vista Editar objeto
var EditObjectForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#EditObjectTemplate").html()),
    initialize : function(){

    },
    events : {
        "click #ok_button_edit_object" : "EditObject",
        "click #ko_button_edit_object" : "CancelEditObject",
    },
    render : function() {
        
        $("#alert_container").html(_.template($("#EditObjectTemplate").html()));
        $("#alert_container").modal("show");

        console.log(this.model.toJSON().name)
        console.log(this.model.toJSON().description)

        $(this.el).fadeIn(150);
        $(this.el).html(this.template());

        
        poc_your.query = dataWeb.get("nick");

            //se cargan los bolsillos desde el JSON
            poc_your.fetch({
                async: false,
                success: function (collection, response) {
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

        console.log(poc_your)
        _.forEach(poc_your.models, function (item) {
                   $('#list_pocket_edit_object').append($("<option></option>").attr("value",item.toJSON().id).text(item.toJSON().name)); 
                }, this);
        $("#inputNameObjectEdit").val(this.model.toJSON().name)
        $("#inputDescriptionObjectEdit").val(this.model.toJSON().description)
        return this;
    },
    EditObject : function(){
         
         if($("#inputNameObjectEdit").val()!=''){
          console.log("EDIT OBJECT")
          var update_object = new UpdateObjectModel({
            id_pocket: $("#list_pocket_edit_object").val(),
            id_user: dataWeb.get("id"),
            name: $("#inputNameObjectEdit").val(),
            description: $("#inputDescriptionObjectEdit").val(),
            id_object: this.model.toJSON().id
          })
          $("#alert_container").modal("hide");
          update_object.save({},{
                    
                    async: false,
                    //si no hay algún problema con el servidor
                     error: function(model, response){

                         var error_server = new ErrorServer();
                         console.log(response)
                         console.log(model)
                         console.log('FAIL EDIT');

                      },
                    //si hay conexión 
                    success : function(model, response){
                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                            setTimeout(function(){$("#alert_container")},400);
                         }

                      }
          });

         app_router.navigate("your",true);
        yourpockets.refresh();
         app_router.navigate("object/"+this.model.toJSON().id,true);
          

      }
      else{
        console.log("DEBES INTRO UN NOMBRE")
      }
    },
    CancelEditObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});


//Vista Eliminar bolsillo
var RemovePocketForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#RemovePocketTemplate").html()),
    initialize : function(){
        
    },
    events : {
        "click #ok_button_remove_pocket" : "RemovePocket",
        "click #ko_button_remove_pocket" : "CancelRemovePocket",
    },
    render : function() {
         $("#alert_container").html(_.template($("#RemovePocketTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    RemovePocket : function(){
         

        var removePocket = new DeletePocketModel({id:this.model.toJSON().id},{ query:this.model.toJSON().id});
        
        
        user_id = dataWeb.get("id")
        keyy = dataWeb.get("api_key")

        console.log(user_id + " " + keyy)

        

        removePocket.destroy({
                        headers: {
                            'user_id':user_id,
                            'api_key':keyy
                        }, 
                        async:false,
                        error: function(model, response){
                            console.log("KO_REMOVE_POCKET");
                            console.log(response);
                            var rem_pock_ko = new RemovePocketKO();
                        },
                         success : function(model, response){
                            console.log("OK_REMOVE_POCKET");
                            console.log(response);
                            var rem_pock_ok = new RemovePocketOK();
                         }
                    }
        );

        $("#alert_container").modal("hide");
        this.CancelRemovePocket();
        //yourpockets.refresh();
        //app_router.navigate("your",true);
    },
    CancelRemovePocket : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});


//Vista Eliminar cuenta
var RemoveUserForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#RemoveUserTemplate").html()),
    initialize : function(){
        
    },
    events : {
        "click #ok_button_remove_user" : "RemoveUser",
        "click #ko_button_remove_user" : "CancelRemoveUser",
    },
    render : function() {
         $("#alert_container").html(_.template($("#RemoveUserTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    RemoveUser : function(){
         

        var removeUser = new DeleteUserModel({id:dataWeb.get("id")},{ query:dataWeb.get("id")});
        removeUser.destroy(
                    {},{
                        error: function(model, response){
                            console.log("KO_REMOVE_USER");
                            console.log(response);
                        },
                         success : function(model, response){
                            console.log("OK_REMOVE_USER");
                            console.log(response);
                         }
                    }
                    );

        $("#alert_container").modal("hide");
          this.CancelRemoveUser();
       
        dataWeb.state = 'CLOSED';
        dataWeb.nick = '';
        dataWeb.password = '';
        $.cookie("nick",'', { path: '/' })
        $.cookie("id",'', { path: '/' })
        $.cookie("password",'', { path: '/' })
        $.cookie("state","", { path: '/' })

        nav_tab.remove();
        setTimeout(function(){$("#list-your-pockets")},400);
        login_view.initialize();
        main_view = new MainView();
        app_router.navigate("",true);
    },
    CancelRemoveUser : function() {

         $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});



//Vista Eliminar objeto
var RemoveObjectForm = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#RemoveObjectTemplate").html()),
    initialize : function(){
        
    },
    events : {
        "click #ok_button_remove_object" : "RemoveObject",
        "click #ko_button_remove_object" : "CancelRemoveObject",
    },
    render : function() {
        $("#alert_container").html(_.template($("#RemoveObjectTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    RemoveObject : function(){
         
         var removeObject = new DeleteObjectModel({id:this.model.toJSON().id},{ query:this.model.toJSON().id});
        removeObject.destroy(
                    {},{
                        error: function(model, response){
                            console.log("KO_REMOVE_OBJECT");
                            console.log(response);
                            var rem_pock_ko = new RemoveObjectKO();
                        },
                         success : function(model, response){
                            console.log("OK_REMOVE_OBJECT");
                            console.log(response);
                            var rem_pock_ok = new RemoveObjectOK();
                         }
                    }
                    );
        $("#alert_container").modal("hide");
        this.CancelRemoveObject();
        yourpockets.refresh();
        window.history.back()
    },
    CancelRemoveObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});


//Vista tipo bolsillo
var NewObjectTypeView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewTypeObjectTemplate").html()),
    model: Pocket,

    initialize : function(){
    },
    events : {
        "click #ko_button_new_object" : "CancelNewObject",
        "click #image_type" : "ImageNewObject",
        "click #music_type" : "MusicNewObject",
        "click #text_type" : "TextNewObject",
        "click #url_type" : "URLNewObject",

    },
    ImageNewObject : function(){
        image_object.model = this.model
        image_object.render() 
    },
    MusicNewObject : function(){
        music_object.model = this.model
        music_object.render() 
    },
    TextNewObject : function(){
        text_object.model = this.model
        text_object.render() 
    },
    URLNewObject : function(){
        url_object.model = this.model
        url_object.render() 
    },
    render : function() {
        $("#alert_container").html(_.template($("#NewTypeObjectTemplate").html()));
        $("#alert_container").modal("show");

        console.log("NEW OBJECT RENDER")
        console.log(this.model)
        $(this.el).fadeIn(150);
        $(this.el).html(this.template()).show();
        return this;
    },
    CancelNewObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista subiendo 
var UploadingView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#UploadingTemplate").html()),
    model : Pocket,
    initialize : function(){
        _.bindAll(this, 'render');
    },
    Upload : function(options){
        this.render();
        var new_object = new ResourceModel({
            name: options.nam,
            type: options.types,
            description: options.desc,
            id_pocket: this.model.id,
            nick: dataWeb.get("nick"),
            url: options.url
        });
        console.log(new_object)
        new_object.save( {},{
                    async: false,
                    //si no hay algún principaloblema con el servidor
                     error: function(model, response){

                         var error_server = new ErrorServer();
                         console.log(response)
                         console.log('FAIL');

                      },
                    //si hay conexión 
                    success : function(model, response){
                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                            setTimeout(function(){$("#alert_container")},400);
                         }

                      }
                          
                    });
        app_router.navigate("your",true);
        app_router.navigate("pocket/"+this.model.toJSON().id,true);
    },
    render : function(){
        $("#alert_container").html(_.template($("#UploadingTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    Cancel : function(){
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista tipo bolsillo Imagen
var NewImageObjectTypeView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewImageTypeObjectTemplate").html()),
    model: Pocket,

    initialize : function(){
        console.log("NEW")
        console.log(this.model)
        _.bindAll(this, 'render');
    },
    events : {
        "click #ko_button_image_type" : "CancelNewObject",
        "click #ok_button_image_type" : "upload",

    },
    upload : function(){

        upload_img.model = this.model
        name = $("#inputNameImageObject").val()
        description = $("#inputDescriptionImageObject").val()

         if(name !=""  )
        {   
            if(($("#fileImage").val())!=""){
                
                

                $('#fileImage').upload('http://192.168.0.195/api/upload/?format=json', function(res) {
                        console.log(res.route)
                        upload_img.Upload({ url : res.route , nam : name, desc : description, types : 'IMAGE'});
                    }, 'json');
            }
            else{
                 var no_image = new NoImageForm({el:$("#check_image_div")});
            }

        }
        else{
            var no_name_image = new NoNameImageForm({el:$("#check_image_div")});
        }
        $("#alert_container").modal("hide");
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    CancelNewObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista tipo bolsillo Music
var NewMusicObjectTypeView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewMusicTypeObjectTemplate").html()),
    model: Pocket,

    initialize : function(){
        console.log("NEW")
        console.log(this.model)
        _.bindAll(this, 'render');
    },
    events : {
        "click #ko_button_music_type" : "CancelNewObject",
        "click #ok_button_music_type" : "upload",

    },
    upload : function(){

        upload_music.model = this.model
        name = $("#inputNameMusicObject").val()
        description = $("#inputDescriptionMusicObject").val()

         if(name !=""  )
        {   
            if(($("#fileMusic").val())!=""){
                
                

                $('#fileMusic').upload('http://192.168.0.195/api/upload/?format=json', function(res) {
                        console.log(res.route)
                        upload_music.Upload({ url : res.route , nam : name, desc : description, types : 'MUSIC'});
                    }, 'json');
            }
            else{
                 var no_music = new NoMusicForm({el:$("#check_music_div")});
            }

        }
        else{
            var no_name_music = new NoNameMusicForm({el:$("#check_music_div")});
        }
        $("#alert_container").modal("hide");
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    CancelNewObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista tipo bolsillo Texto
var NewTextObjectTypeView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewTextTypeObjectTemplate").html()),
    model: Pocket,

    initialize : function(){
        console.log("NEW")
        console.log(this.model)
        _.bindAll(this, 'render');
    },
    events : {
        "click #ko_button_text_type" : "CancelNewObject",
        "click #ok_button_text_type" : "upload",

    },
    upload : function(){

        upload_text.model = this.model
        name = $("#inputNameTextObject").val()
        description = $("#inputDescriptionTextObject").val()

         if(name !=""  )
        {   
            if(($("#fileText").val())!=""){
                
                console.log("GENERANDO HTML")


                var upload_text_res = new ResourceUploadModel({
                    name: "text.html",
                    text: $("#fileText").val()
                })

                upload_text_res.save({},{
                        async: false,
                     //si no hay algún problema con el servidor
                     error: function(model, response){

                         var error_server = new ErrorServer();
                         console.log(response)
                         console.log('FAIL');

                      },
                    //si hay conexión 
                    success : function(model, response){
                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            console.log("OK")
                           console.log(response)
                           upload_text.Upload({ url : response.route , nam : name, desc : description, types : 'TXT'});
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                            setTimeout(function(){$("#alert_container")},400);
                         }

                      }
                });
            }
            else{
                 var no_text = new NoTextForm({el:$("#check_text_div")});
            }

        }
        else{
            var no_name_text = new NoNameTextForm({el:$("#check_text_div")});
        }
        $("#alert_container").modal("hide");
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    CancelNewObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista tipo Url
var NewUrlObjectTypeView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewUrlTypeObjectTemplate").html()),
    model: Pocket,

    initialize : function(){
        console.log("NEW")
        console.log(this.model)
        _.bindAll(this, 'render');
    },
    events : {
        "click #ko_button_url_type" : "CancelNewObject",
        "click #ok_button_url_type" : "upload",

    },
    upload : function(){

        upload_url.model = this.model
        name = $("#inputNameUrlObject").val()
        description = $("#inputDescriptionUrlObject").val()

         if(name !=""  )
        {   
            if(($("#inputURLUrlObject").val())!=""){
                
                upload_url.Upload({ url : $("#inputURLUrlObject").val() , nam : name, desc : description, types : 'URL'});
                  
            }
            else{
                 var no_url = new NoUrlForm({el:$("#check_url_div")});
            }

        }
        else{
            var no_name_url = new NoNameUrlForm({el:$("#check_url_div")});
        }
        $("#alert_container").modal("hide");
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    CancelNewObject : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});





//Vista Login Success
var LoginSuccess = Backbone.View.extend({

    el: $("#login_container"),
    template : _.template( $("#LoginTemplateSuccess").html()),
     initialize : function () {

     this.render();
    },
    events : {
        "click #xpand_icon":"openDropdown",
        "click #close_session":"closeSesion",
        "click #info_user":"infoUser",
        "click #user_nick_button":"infoUser",
        "click #button_search" : "searchView"
    },
    render : function () {
        console.log("Login Succes Coocki")
        dataWeb = new  DataAppWeb({
                    nick : $.cookie("nick"),
                    id: $.cookie("id"),
                    password: $.cookie("password"),
                    api_key: $.cookie("api_key"),
                    state: "LOGIN"
                });
        $.ajaxSetup({
            headers: {
                'user_id':dataWeb.get("id"),
                'api_key':dataWeb.get("api_key")
            }
        });
        nav_tab.render();
        $(this.el).html(this.template(dataWeb.toJSON()));
        return this;
    },
    searchView : function(){
        console.log($("#search_text_input").val())
        if(dataWeb.get("state")=='LOGIN' && $("#search_text_input").val()){
           app_router.navigate("your/",true)
           app_router.navigate("search/"+$("#search_text_input").val(),true);
       }
    },
    infoUser : function(){
        if(dataWeb.get("state")=='LOGIN'){
           app_router.navigate("user/"+dataWeb.get("nick"),true);
     }
    },
    openDropdown: function(){
        $('.dropdown-toggle').dropdown();
    },
    closeSesion : function(){
        dataWeb.state = 'CLOSED';
        dataWeb.nick = '';
        dataWeb.password = '';
        $.cookie("nick",'', { path: '/' })
        $.cookie("id",'', { path: '/' })
        $.cookie("password",'', { path: '/' })
        $.cookie("state","", { path: '/' })

        nav_tab.remove();
        $("#list-your-pockets").fadeOut(300);
        setTimeout(function(){$("#list-your-pockets")},400);
        login_view.initialize();
        main_view = new MainView();
        app_router.navigate("",true);
        
        
    }

});



var NoKeyView = Backbone.View.extend({
     el : $("#alert_container"),
    template : _.template($("#NoKeyTemplate").html()),
    initialize : function() {
        this.render();
    },
    events :{
        "click #ok_button_no_key": "retreiveKey",
        "click #ko_button_no_key":"cancel"
    },
    retreiveKey: function() {
        if(($("#inputNoKeyNick").val()) != '' && 
            ($("#inputNoKeyEmail").val()) != ''){
            
            var no_key = new NoKeyModel({nick: $("#inputNoKeyNick").val(),
                email: $("#inputNoKeyEmail").val()})
            
            no_key.save({},{
                async: false,
                //si no hay algún problema con el servidor
            error: function(model, response){
                console.log('FAIL_NO');
                console.log(response);
                var pass_send = new NewPassSend()

             },
            //si hay conexión 
            success : function(model, response){
                console.log('OK_NO');
                console.log(response);
            }
        });
        this.cancel()
    }
},
    render : function () {
        $("#alert_container").html(_.template($("#LoginErrorTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    cancel : function(){
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

//Vista de Mensajes de Alerta
var LoginErrorMessage = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#LoginErrorTemplate").html()),
    initialize : function() {
        this.render();
    },
    events :{
        "click #ok_button_login": "removeMessage",
        "click #new_pass":"noKey",
        "click #register_pass": "register"
    },
    noKey: function() {
        var no_key = new NoKeyView();
    },
    register: function(){
        var register = new RegisterForm();
    },
    render : function () {
        $("#alert_container").html(_.template($("#LoginErrorTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    removeMessage : function(){
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }

});

//Vista de Mensajes de No hay bolsillos
var NoYourPocketsMessage = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NoYourPocketsTemplate").html()),
    initialize : function() {
        this.render();
    },
    events :{
        "click #ok_button_no_your": "removeMessage"
    },
    render : function () {
        $("#alert_container").html(_.template($("#NoYourPocketsTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    removeMessage : function(){
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }

});

//Vista de Mensajes de No hay bolsillos
var NoFeaturedPocketsMessage = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NoFeaturedPocketsTemplate").html()),
    initialize : function() {
        this.render();
    },
    events :{
        "click #ok_button_no_featured": "removeMessage"
    },
    render : function () {
        $("#alert_container").html(_.template($("#NoFeaturedPocketsTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    removeMessage : function(){
        $("#alert_container").modal("hide");
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }

});

//Buscar bolsillos
var SearchPocketView = Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template($("#SearchPocketTemplate").html()),
    events : {
    },
    initialize : function () {    
        

    },
    refresh : function(option){
        $("#alert_container").modal("hide");
        $("#tab_your_pocket").removeClass('active');
        $("#tab_random_pocket").removeClass('active');
        $("#tab_featured_pocket").removeClass('active');
        $("#tab_sponsored_pocket").removeClass('active');


        if(dataWeb.get("state") == "LOGIN"){
             $(this.el).fadeIn(150);

             console.log(option.query)

            //se obtiene el nombre de la barra de búsqueda
            
            var poc_search = $("#search_text_input").val().replace(' ','%20')
        
            console.log(poc_search)
            if(poc_search != ''){
                //se define el nombre del usuario
                poc_search_user.query = poc_search
                //se cargan los bolsillos desde el JSON
                poc_search_user.fetch({

                    async: false,

                    success: function (collection, response) {
                         featured.initialize();

                         console.log("SUCCESS SEARCH USER")
                    },

                    error : function(model, response){
                       
                        console.log("ERROR SEARCH USER");
                    }
                });

                //se define el nombre del bolsillo
                poc_search_pockets.query = poc_search
                //se cargan los bolsillos desde el JSON
                poc_search_pockets.fetch({

                    async: false,

                    success: function (collection, response) {
                         featured.initialize();
                        console.log("SUCCESS SEARCH POCKET")
                    },

                    error : function(model, response){
                        console.log("ERROR SEARCH POCKET");
                    }
                });
            }
            //this.render();
        }
        else{
            //aqu´i se ha de indicar el menu principal
            //app_router.navigate("",true);
        }
    },
    render : function () {

        $(this.el).html(this.template());


        $(this.el).find("ul").empty();

        //se comprueba existan bolsillos
        if(poc_search_user.models.pockets == 0){
            
        }
        else{
            console.log("ITEM")
            _.forEach(poc_search_user.models, function (item) {
                console.log(item)
                $(this.el).find("ul").append((new PocketView({model:item})).render().el)
            }, this)
         }
          //se comprueba existan bolsillos
        if(poc_search_pockets.models.length == 0){
            
        }
        else{
             console.log("ITEM POCKET")
            _.forEach(poc_search_pockets.models, function (item) {
                 console.log(item)
                 $(this.el).find("ul").append((new PocketView({model:item})).render().el)
            }, this)
         }

        
        return this;
    }
});


var YourPocketView = Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template($("#yourPocketTemplate").html()),
    events : {
        "click #new_pocket_button" : "NewPocket"
    },
    NewPocket : function(){
        new_pocket_form.render().el;
    },
    initialize : function () {    
        

    },
    refresh : function(){
        $("#alert_container").modal("hide");
        $("#tab_your_pocket").addClass('active');
        $("#tab_random_pocket").removeClass('active');
        $("#tab_featured_pocket").removeClass('active');
        $("#tab_sponsored_pocket").removeClass('active');

        var empty_alert = new EmptyMessageView();

        if(dataWeb.get("state") == "LOGIN"){
             $(this.el).fadeIn(150);

            //se define el nombre del usuario
            poc_your.query = dataWeb.get("nick");
            //se cargan los bolsillos desde el JSON
            poc_your.fetch({
                async: false,
                success: function (collection, response) {
                     featured.initialize();
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

            //this.render();
        }
        else{
            //aqu´i se ha de indicar el menu principal
            //app_router.navigate("",true);
        }
    },
    render : function () {

        $(this.el).html(this.template());


        $(this.el).find("ul").empty();

        //se comprueba existan bolsillos
        if(poc_your.models.length == 0){
            var no_your_pockets = new NoYourPocketsMessage();
        }
        else{
            _.forEach(poc_your.models, function (item) {
                $(this.el).find("ul").append((new PocketView({model:item})).render().el)
            }, this)
         }
        return this;
    }
});


var RandomPocketView = Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template($("#randomPocketTemplate").html()),
    events : {
        "click #new_pocket_button" : "NewPocket"
    },
    NewPocket : function(){
        new_pocket_form.render();
    },

    initialize : function () {  
    },
    refresh : function(){

        $("#alert_container").modal("hide");
        $("#tab_random_pocket").addClass('active');
        $("#tab_your_pocket").removeClass('active');  
        $("#tab_featured_pocket").removeClass('active');
        $("#tab_sponsored_pocket").removeClass('active');
         var empty_alert = new EmptyMessageView();

        if(dataWeb.get("state") == "LOGIN"){
             $(this.el).fadeIn(150);
            //se define el nombre del usuario
            poc_random.query = dataWeb.get("nick");
            //se cargan los bolsillos desde el JSON
            poc_random.fetch({
                async: false,
                success: function (collection, response) {
                     featured.initialize();
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

            this.render();
        }
        else{
            //aqu´i se ha de indicar el menu principal
            console.log("KO_RANDOM");
            app_router.navigate("",true);
        }

    },
    render : function () {

        $(this.el).html(this.template());


        $(this.el).find("ul").empty();

        //se comprueba existan bolsillos
        if(poc_random.models.length == 0){

        }
        else{
            _.forEach(poc_random.models, function (item) {
                $(this.el).find("ul").append((new PocketRandomView({model:item})).render().el)
            }, this)
         }
        return this;
    }
});

var FeaturedPocketView = Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template($("#featuredPocketTemplate").html()),
    events : {
        "click #new_pocket_button" : "NewPocket"
    },
    NewPocket : function(){
        new_pocket_form.render();
    },
    initialize : function () {  },

    refresh : function(){

        $("#alert_container").modal("hide");
        $("#tab_featured_pocket").addClass('active');
        $("#tab_your_pocket").removeClass('active');  
        $("#tab_random_pocket").removeClass('active');
        $("#tab_sponsored_pocket").removeClass('active');  
        
        var empty_alert = new EmptyMessageView();

        if(dataWeb.get("state") == "LOGIN"){

             $(this.el).fadeIn(150);
            //se define el nombre del usuario
            poc_featured.query = dataWeb.get("nick");
            //se cargan los bolsillos desde el JSON
            poc_featured.fetch({
                async: false,
                success: function (collection, response) {

                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

            this.render();
        }
        else{
            //aqu´i se ha de indicar el menu principal
            console.log("KO_FEATURED");
            app_router.navigate("",true);
        }

    },
    render : function () {

        $(this.el).html(this.template());


        $(this.el).find("ul").empty();

        //se comprueba existan bolsillos
        if(poc_featured.models.length == 0){
            var no_featured_pockets = new NoFeaturedPocketsMessage();
        }
        else{
            _.forEach(poc_featured.models, function (item) {
                $(this.el).find("ul").append((new PocketFeaturedView({model:item})).render().el)
            }, this)
         }
        return this;
    }
});


var SponsoredPocketView = Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template($("#sponsoredPocketTemplate").html()),
    events : {
        "click #new_pocket_button" : "NewPocket"
    },
    NewPocket : function(){
        new_pocket_form.render();
    },
    initialize : function () { },
    refresh : function(){ 
        $("#alert_container").modal("hide");
        $("#tab_sponsored_pocket").addClass('active');
        $("#tab_your_pocket").removeClass('active');  
        $("#tab_featured_pocket").removeClass('active');
        $("#tab_random_pocket").removeClass('active'); 

        var empty_alert = new EmptyMessageView();
 
        if(dataWeb.get("state") == "LOGIN"){

             $(this.el).fadeIn(150);
            //se define el nombre del usuario
            poc_sponsored.query = dataWeb.get("nick");
            //se cargan los bolsillos desde el JSON
            poc_sponsored.fetch({
                async: false,
                success: function (collection, response) {
                     featured.initialize();
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

            this.render();
        }
        else{
            //aqu´i se ha de indicar el menu principal
            console.log("KO_SPONSORED");
            app_router.navigate("",true);
        }

    },
    render : function () {

        $(this.el).html(this.template());


        $(this.el).find("ul").empty();

        //se comprueba existan bolsillos
        if(poc_sponsored.models.length == 0){

        }
        else{
            _.forEach(poc_sponsored.models, function (item) {
                $(this.el).find("ul").append((new PocketSponsoredView({model:item})).render().el)
            }, this)
         }
        return this;
    }
});


var PocketView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#pocket_template_view").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas bolsillos ");
        console.log(this.model.toJSON())
    },

    events: {
            "click div": "view_pocket",
        },

    render: function(){

            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

    view_pocket : function () {
        app_router.navigate("pocket/"+this.model.toJSON().id,true);
    },

});

var PocketRandomView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#pocket_random_template_view").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas bolsillos ");
        this.model.bind('change', this.render, this),
        $(this.el).attr("name", "pocket-" + this.model.get("name"))
    },

    events: {
            "click div": "view_pocket",
        },

    render: function(){

            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
    view_pocket : function () {
        app_router.navigate("pocket/"+this.model.toJSON().id,true);
    },

});

var PocketFeaturedView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#pocket_featured_template_view").html()),


    initialize: function(){

        console.log("creando vistas bolsillos ");
        this.model.bind('change', this.render, this)
    },

    events: {
            "click div": "view_pocket",
        },

    render: function(){

            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
    view_pocket : function () {
        app_router.navigate("pocket/"+this.model.toJSON().pocket.id,true);
    },

});


var PocketSponsoredView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#pocket_sponsored_template_view").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas bolsillos ");
        this.model.bind('change', this.render, this),
        $(this.el).attr("name", "pocket-" + this.model.get("name"))
    },

    events: {
            "click div": "view_pocket",
        },

    render: function(){

            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
    view_pocket : function () {

        app_router.navigate("pocket/"+this.model.toJSON().pocket.id,true);
    },

});


//Vista de menu para los bolsillos (voto, featured)
var MenuOtherPocketView = Backbone.View.extend({
    tagName: "li",
    template : _.template($("#MenuOtherPocketTemplate").html()),
    model : Pocket,
    initialize : function(){
        this.render();
    },
    events : {
        "click #menu_good_button":"voteGood",
        "click #menu_bad_button":"voteBad",
        "click #menu_featured_button" : "doFeatured",
    },
    render : function(){

        
        $(this.el).html(this.template());
        return this;
    },
    remove : function(){
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);

    },

    voteGood : function(){
        var vote_good = new VoteModel({

            id_user: dataWeb.get("id"),
            id_pocket: this.model.toJSON().id,
            vote: 1

        });

        vote_good.save({ }, {

            async: false,
            //si no hay algún problema con el servidor
            error: function(model, response){
                var error_server = new ErrorServer();
                console.log('FAIL_VOTE');
                console.log(response);
                

             },
            //si hay conexión 
            success : function(model, response){

                 //si ha habido éxito con el login
                 if( response.result == "OK" ){
                     console.log("OK_VOTE");
                     var mes_vote_ok = new NewVoteView();
                     
                 }
                 else if(response.result == "KO_VOTE_PREVIOUSLY"){ //si los datos son incorrectos
                    console.log("KO_VOTE_PREVIOUSLY");
                    var mes_vote_repeat = new RepeatVoteView();
                 }
                 else if(response.result == "OK_CHANGED_VOTED"){ //si los datos son incorrectos
                    console.log("OK_CHANGED_VOTED");
                    var mes_vote_change = new ChangeVoteView();
                   
                 }

              }
              
        });
    app_router.navigate("your",true);
    app_router.navigate("pocket/"+this.model.id,true);

    },
    voteBad : function(){
         var vote_bad = new VoteModel({

            id_user: dataWeb.get("id"),
            id_pocket: this.model.toJSON().id,
            vote: -1

        });

        vote_bad.save({ }, {

            async: false,
            //si no hay algún problema con el servidor
            error: function(model, response){
                var error_server = new ErrorServer();
                console.log('FAIL_VOTE');
                console.log(response);
                

             },
            //si hay conexión 
            success : function(model, response){

                 //si ha habido éxito con el login
                 if( response.result == "OK" ){
                     console.log("OK_VOTE");
                     var mes_vote_ok = new NewVoteView();
                     
                 }
                 else if(response.result == "KO_VOTE_PREVIOUSLY"){ //si los datos son incorrectos
                    console.log("KO_VOTE_PREVIOUSLY");
                    var mes_vote_repeat = new RepeatVoteView();
                 }
                 else if(response.result == "OK_CHANGED_VOTED"){ //si los datos son incorrectos
                    console.log("OK_CHANGED_VOTED");
                    var mes_vote_change = new ChangeVoteView();
                   
                 }

              }
             
              
        });
        app_router.navigate("your",true);
        app_router.navigate("pocket/"+this.model.id,true);

    },
    doFeatured : function(){

        //se comprueba si el bolsillo está destacado
        var exit = -1;
        var is_Featured = 0;
        var count=-1;

        _.forEach(dataWeb.get("featured"), function (item){

           count =count+1;

           if(item == this.model.id && exit==-1){
                     
                    console.log("IS FEATURED "+ this.model.id);

                    $(this.el).find("#is_featured_ul").append((new FeaturedIconView().render().el));
                    exit = 1;
                    is_Featured = 1;
             }

        }, this);

        console.log("count "+count);
        if(is_Featured == 0){ //se pasa a destacar el bolsillo
            console.log("DEST");
            var do_featured = new FeatureModel({
                nick : dataWeb.get("nick"),
                id_pocket : this.model.toJSON().id
            });
            do_featured.save({},{

                async: false,
                 //si no hay algún problema con el servidor
            error: function(model, response){
                var error_server = new ErrorServer();
                console.log('FAIL_FEATURED');
                console.log(response);
                

             },
            //si hay conexión 
            success : function(model, response){

                 //si ha habido éxito con el login
                 if( response.result == "OK" ){
                     console.log("OK_FEATURED");
                     
                 }
                 else if(response.result == "KO"){ 

                    console.log("KO_FEATURED");
                }
            }
            });
        }
        else{ //se elimina destacado
            console.log("NO DEST");
            console.log(dataWeb.get("id_featured")[count]);
            var id_fea = dataWeb.get("id_featured")[count]
            var do_feat = new DeleteFeatureModel({id:id_fea},{ query:id_fea });
            do_feat.destroy(
                {},{
                    error: function(model, response){
                        console.log("KO_REMOVE");
                        console.log(response);
                    },
                     success : function(model, response){
                        console.log("OK_REMOVE");
                        console.log(response);
                     }
                }
                );
        }
        
        if($("#tab_featured_pocket").attr("class") != "navi active"){
            app_router.navigate("your",true);
            app_router.navigate("pocket/"+this.model.id,true);
        }
        else{
            app_router.navigate("your",true);
            app_router.navigate("featured",true);
        }
    }

});

//Vista de menu user
var MenuUserView = Backbone.View.extend({
    tagName: "li",
    template : _.template($("#MenuUserTemplate").html()),
    model : Pocket,
    initialize : function(){
        this.render();
    },
    events : {

        "click #menu_remove_user" : "removeUser"
    },
    render : function(){
        console.log("RENDER MENUUU USER")
        $(this.el).html(this.template());
        return this;
    },
    remove : function(){
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);

    },
    removeUser: function(){
        r_user.render()
    } 
});

//Vista de menu
var MenuPocketView = Backbone.View.extend({
    tagName: "li",
    template : _.template($("#MenuPocketTemplate").html()),
    model : Pocket,
    initialize : function(){
        this.render();
    },
    events : {

        "click #button_new_object" : "newObject",
        "click #menu_remove_pocket" : "removePocket",
        "click #menu_edit_pocket" : "editPocket",
    },
    render : function(){
        console.log("RENDER MENUUU")
        $(this.el).html(this.template());
        return this;
    },
    remove : function(){
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);

    },
    removePocket: function(){
        console.log(this.model)
        r_pocket.model = this.model
        r_pocket.render()
    } ,
    editPocket: function(){
        console.log(this.model)
        edit_pocket_form.model = this.model
        edit_pocket_form.render()
    } ,
    newObject: function(){
        console.log("MODEL")
        console.log(this.model)
        n_obj_type.model = this.model
        n_obj_type.render()
    }
});


//plantilla de vista de usuario
var OneUserView =  Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template( $("#oneUserTemplate").html()),
    model : User,


    initialize: function(){
        console.log("Creando vista usuario ");
        this.model.bind('change', this.render, this);
    },
    events : {
        
    },
    charge :  function(options){

        console.log("N_POCKET "+options.nick_user);
        var one_u = new OneUser([],{ query: options.nick_user });
        one_u.query = options.nick_user
        console.log(one_u.nick)
        one_u.fetch({
                async: false,
                success: function (collection, response) {
                     console.log("USER")
                     console.log(response)
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

       
        this.model = one_u.toJSON();

        this.render();
       
    },
    render: function(){

           

            var sport = 0
            var misc = 0
            var music = 0
            var book = 0
            var cooking = 0
            var photo = 0
            var cinema = 0

            _.forEach(this.model.pockets, function (item) {

                if(item.type == "book")
                    book = book + 1
                else if(item.type == "sport")
                    sport = sport + 1
                else if(item.type == "misc")
                    misc = misc + 1
                else if(item.type == "music")
                    music = music + 1
                else if(item.type == "cooking")
                    cooking = cooking + 1
                else if(item.type == "photo")
                    photo = photo + 1
                else if(item.type == "cinema")
                    cinema = cinema + 1
                
             }, this);
            
            this.model.book = book
            this.model.sport = sport
            this.model.misc = misc
            this.model.music = music
            this.model.cooking = cooking
            this.model.photo = photo
            this.model.cinema = cinema

            $(this.el).html(this.template(this.model));

            //crear el menu para editar la cuenta
           console.log(dataWeb.get("nick")  + " "+this.model.nick)
           if(dataWeb.get("nick") == this.model.nick)
             $(this.el).find("#user_menu").append((new MenuUserView()).render().el)


            return this;
        },
    

});

var OnePocketView =  Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template( $("#onePocketTemplate").html()),
    model : Pocket,


    initialize: function(){
        console.log("Creando bolsillo único ");
        this.model.bind('change', this.render, this);
    },
    events : {
        "click #button_new_comment" : "newComment"
    },
    newComment : function(){
        console.log("nuevo comentario");
        new_comment.model = this.model;
        new_comment.render();
    },
    charge :  function(options){

        console.log("N_POCKET "+options.n_pocket);
        var one_p = new OnePocket([],{ query: options.n_pocket });
        one_p.query = options.n_pocket;
        one_p.fetch({
                async: false,
                success: function (collection, response) {
                     
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

        //importante pasar de Collection a objeto único [] to Object
        this.model = one_p.models[0];

       
        
        this.render();

       
    },
    render: function(){

            $(this.el).html(this.template(this.model.toJSON()));
            $(this.el).find("ul").empty();

            //se pone la estrella de destacado
            var exit = 0;
            _.forEach(dataWeb.get("featured"), function (item){

               
               if(item == this.model.id && exit==0){
                         
                        console.log("IS FEATURED "+ this.model.id);
                        $(this.el).find("#is_featured_ul").append((new FeaturedIconView().render().el));
                        exit = 1;
                 }

            }, this);

            console.log(this.model.toJSON().objects);
            
            //se comprueba existan bolsillos
            if(this.model.toJSON().objects.length ==0){

            }
            else{
                _.forEach(this.model.toJSON().objects, function (item) {

                    if(item.type == "IMAGE")
                        $(this.el).find("#list_objects_views").append((new ObjectViewImage({model:item})).render().el)
                    else if (item.type == "MUSIC")
                        $(this.el).find("#list_objects_views").append((new ObjectViewMusic({model:item})).render().el)
                     else if (item.type == "TXT")
                        $(this.el).find("#list_objects_views").append((new ObjectViewText({model:item})).render().el)
                     else if (item.type == "URL")
                        $(this.el).find("#list_objects_views").append((new ObjectViewURL({model:item})).render().el)

                
                }, this);
            }
            //se comprueba existan bolsillos
            if(this.model.toJSON().comments.length == 0){
                 $(this.el).find("#list_com_views").append((new NoCommentView()).render().el)
            }
            else{
                _.forEach(this.model.toJSON().comments, function (item) {

                   $(this.el).find("#list_com_views").append((new CommentView({model:item})).render().el)
                }, this);
             }

               var menu = new MenuPocketView({model: this.model})
                if(dataWeb.get("state") == 'LOGIN'){

                    poc_your.query = dataWeb.get("nick");

                    //se cargan los bolsillos desde el JSON
                    poc_your.fetch({
                        async: false,
                        success: function (collection, response) {
                        },
                        error : function(model, response){
                            console.log(response);
                            console.log("error");
                        }
                    });

                    //botones de votar positivo, negativo y destacar
                    $(this.el).find("#data_other_pocket_menu").append((new MenuOtherPocketView({model:this.model})).render().el)

                    console.log(poc_your)
                    _.forEach(poc_your.models, function (item) {
                        console.log(item.toJSON().id + " "+ this.model.id)
                              if(item.toJSON().id == this.model.id){

                                 $(this.el).find("#data_pocket_menu").append((new MenuPocketView({model:this.model})).render().el)
                                 $(this.el).find("#new_object_button").append((new NewObjectButtonView({model:this.model})).render().el)
                              }
                            }, this);


                }

              $('#twitter').sharrre({
                    share: {
                      twitter: true
                    },
                    enableHover: false,
                    enableTracking: true,
                    buttons: { twitter: {via: 'patit_project'}},
                    click: function(api, options){
                      api.simulateClick();
                      api.openPopup('twitter');
                    }
                  });
                  $('#facebook').sharrre({
                    share: {
                      facebook: true
                    },
                    enableHover: false,
                    enableTracking: true,
                    click: function(api, options){
                      api.simulateClick();
                      api.openPopup('facebook');
                    }
                });

                 window.___gcfg = {
                    lang: 'es-ES'
                };

                  (function() {
                    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = false;
                    po.src = 'https://apis.google.com/js/plusone.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                  })();

            return this;
        },
    

});

//Vista de menu de objetos
var MenuObjectView = Backbone.View.extend({
    tagName: "li",
    template : _.template($("#MenuObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
        this.render();
    },
    events : {
        "click #menu_download_button" : "downloadObject",
        "click #menu_edit_object" : "editObject",
        "click #menu_remove_object":"RemoveObject"
    },
    render : function(){

        
        $(this.el).html(this.template());
        return this;
    },
    remove : function(){
        $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);

    },

    editObject : function(){
         edit_object_form.model = this.model
        edit_object_form.render()
    },
    RemoveObject : function(){
         r_object.model = this.model
        r_object.render()
    },
    downloadObject: function(){
        console.log("DOW")

        window.location.href = this.model.toJSON().url;
    },
});

var OneObjectView =  Backbone.View.extend({
    el : $("#sub_main_container"),
    template : _.template( $("#oneObjectTemplate").html()),
    model : Pocket,

    initialize: function(){
        console.log("Creando vista objeto único ");
        //this.model.bind('change', this.render, this);

    },
    events : {
       
    },
    charge :  function(options){

        console.log("N_OBJECT "+options.n_object);
        var one_o = new OneObject([],{ query: options.n_object});
        one_o.query = options.n_object;
        one_o.fetch({
                async: false,
                success: function (collection, response) {
                     
                },
                error : function(model, response){
                    console.log(response);
                    console.log("error");
                }
            });

        //importante pasar de Collection a objeto único [] to Object
        this.model = one_o.models[0];
        this.render();
    },
    render: function(){
            $(this.el).html(this.template(this.model.toJSON()));
             if(this.model.toJSON().type == 'IMAGE')
                 $(this.el).find("#object_view_ul").append((new ImageObjectView({model:this.model})).render().el);
            else if(this.model.toJSON().type == 'MUSIC')
                 $(this.el).find("#object_view_ul").append((new MusicObjectView({model:this.model})).render().el);
             else if(this.model.toJSON().type == 'TXT')
                 $(this.el).find("#object_view_ul").append((new TextObjectView({model:this.model})).render().el);
             else if(this.model.toJSON().type == 'URL')
                 $(this.el).find("#object_view_ul").append((new UrlObjectView({model:this.model})).render().el);

              $('#twitter').sharrre({
                share: {
                  twitter: true
                },
                enableHover: false,
                enableTracking: true,
                buttons: { twitter: {via: 'patit_project'}},
                click: function(api, options){
                  api.simulateClick();
                  api.openPopup('twitter');
                }
              });
              $('#facebook').sharrre({
                share: {
                  facebook: true
                },
                enableHover: false,
                enableTracking: true,
                click: function(api, options){
                  api.simulateClick();
                  api.openPopup('facebook');
                }
              });
              window.___gcfg = {
                lang: 'es-ES'
              };

              (function() {
                var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                po.src = 'https://apis.google.com/js/plusone.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
              })();


        var menu2 = new MenuObjectView({model: this.model})
                if(dataWeb.get("state") == 'LOGIN'){

                    poc_your.query = dataWeb.get("nick");

                    //se cargan los bolsillos desde el JSON
                    poc_your.fetch({
                        async: false,
                        success: function (collection, response) {
                        },
                        error : function(model, response){
                            console.log(response);
                            console.log("error");
                        }
                    });

                    //esta parte es necesaria porque la api da la dirección del bolsillo
                    //y no da el objeto . Ej : /api/v1/pocket/135
                    var n_pocket_id = this.model.toJSON().pocket.split("/")
                    n_pocket_id= n_pocket_id[4] 

                    console.log(n_pocket_id)
                    _.forEach(poc_your.models, function (item) {
                              if(item.toJSON().id == n_pocket_id){

                                 $(this.el).find("#data_object_menu").append((new MenuObjectView({model:this.model})).render().el)
                                
                              }
                            }, this);

                }

        return this;
    }

});

//Vista de New:OBJECT
var NewObjectButtonView = Backbone.View.extend({
    tagName : "li",
    template : _.template($("#NewButtonObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
        console.log(this.model);
    },
    events : {
        "click #button_new_object" : "newObject"
    },
    newObject: function(){
        console.log("MODEL")
        console.log(this.model)
        n_obj_type.model = this.model
        n_obj_type.render()
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

//Vista de OBJECTO_IMAGEN
var ImageObjectView = Backbone.View.extend({
    tagName : "li",
    template : _.template($("#ImageObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
        console.log(this.model);
    },
    events : {
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
//Vista de OBJECTO_MUSIC
var MusicObjectView = Backbone.View.extend({
    tagName : "li",
    template : _.template($("#MusicObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
    },
    events : {
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
//Vista de OBJECTO_TEXT
var TextObjectView = Backbone.View.extend({
    tagName : "li",
    template : _.template($("#TextObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
    },
    events : {
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
//Vista de OBJECTO_URL
var UrlObjectView = Backbone.View.extend({
    tagName : "li",
    template : _.template($("#URLObjectTemplate").html()),
    model : Pocket,
    initialize : function(){
    },
    events : {
    },
    render : function() {
        $(this.el).fadeIn(150);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

//Vista Crear Comentario
var NewCommentView = Backbone.View.extend({
    el : $("#alert_container"),
    template : _.template($("#NewCommentTemplate").html()),
    model : Pocket,
    initialize : function(){
         this.model.bind('create', this.render, this)
    },
    events : {
        "click #ok_button_new_comment" : "NewComment",
        "click #ko_button_new_comment" : "CancelNewComment",
    },
    render : function() {
         $("#alert_container").html(_.template($("#NewCommentTemplate").html()));
        $("#alert_container").modal("show");
        $(this.el).fadeIn(150);
        $(this.el).html(this.template());
        return this;
    },
    NewComment : function(){
          var new_comment_m = new NewCommentModel({

                 nick: dataWeb.get("nick"),
                 text: $("#inputTextComment").val(),
                 id : this.model.id
                });

                //se comprueba que el text no esté vacío
                if($("#inputTextComment").val().length == 0){


                    //var no_name = new CheckNamePocketForm({el:$("#check_name_div")});
                }
                else{ //si se ha escrito un nombre para el bolsillo


                   new_comment_m.save( {},{
                    async: false,

                    //si no hay algún problema con el servidor
                     error: function(model, response){
                         var error_server = new ErrorServer();
                         console.log(model.toJSON());
                         console.log('FAIL');
                        CancelNewComment();

                      },
                    //si hay conexión 
                    success : function(model, response){

                         //si ha habido éxito con la creación del bolsillo
                         if( response.result == "OK" ){
                            
                            
                           $("#alert_container").fadeOut(300);
                            setTimeout(function(){$("#alert_container")},400);
                            
                            
                         }
                         else{ //si los datos son incorrectos
                            console.log("INCORRECTO");
                            CancelNewComment();
                         }

                      }
                          
                    });

                }
         $("#alert_container").modal("hide");

                this.RefreshPage();
    },
    RefreshPage : function(){
        console.log("REFRESHHH");
        app_router.navigate("your",true);
        app_router.navigate("pocket/"+this.model.id,true);
    },
    CancelNewComment : function() {
        $("#alert_container").modal("hide");
         $(this.el).fadeOut(300);
        setTimeout(function(){$(this.el)},400);
    }
});

var ObjectViewImage = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#object_template_view_image").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas objetos ");
   
    },

    events: {
        "click div" : "viewObject"
        },
    viewObject: function(){
        app_router.navigate("object/"+this.model.id,true);
    },
    render: function(){

            $(this.el).html(this.template(this.model));
            console.log(this.model);

            return this;
        }

});


var ObjectViewMusic = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#object_template_view_music").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas objetos ");
   
    },

    events: {
        "click div" : "viewObject"
        },
    viewObject: function(){
        app_router.navigate("object/"+this.model.id,true);
    },

    render: function(){

            $(this.el).html(this.template(this.model));
            return this;
        }
});


var ObjectViewText = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#object_template_view_text").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas objetos ");
   
    },

    events: {
        "click div" : "viewObject"
        },
    viewObject: function(){
        app_router.navigate("object/"+this.model.id,true);
    },

    render: function(){

            $(this.el).html(this.template(this.model));
            return this;
        }
});


var ObjectViewURL = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#object_template_view_url").html()),
    model : Pocket,

    initialize: function(){
        console.log("creando vistas objetos ");
   
    },

    events: {
        "click div" : "viewObject"
        },
    viewObject: function(){
        app_router.navigate("object/"+this.model.id,true);
    },

    render: function(){

            $(this.el).html(this.template(this.model));
            return this;
        }
});

var CommentView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#com_template_view").html()),
   

    initialize: function(){
        console.log("creando vistas comentario ");
        
   
    },

    render: function(){

             console.log("comentario");
            $(this.el).html(this.template(this.model));
            return this;
        }

});

var NoCommentView = Backbone.View.extend({
   
    tagName : "li",
    template : _.template( $("#no_com_template_view").html()),

    initialize: function(){
        console.log("no hay comentarios ");
    },
    render: function(){
            $(this.el).html(this.template(this.model));
            return this;
    }
});

var FeaturedIconView = Backbone.View.extend({
    tagName : "li",
     template : _.template( $("#is_featured_template_view").html()),
     initialize: function(){
    },
    render: function(){
            console.log("dibujando");
            $(this.el).html(this.template(this.model));
            return this;
    }
});


var NewVoteView = Backbone.View.extend({
    el : $("#alert_container_msj"),
    template : _.template($("#NewVoteTemplate").html()),
    initialize : function(){
        this.render();
        //setTimeout(this.cancel(),3000);
    },
    render : function(){
        $('html,body').animate({
            scrollTop: $("#header_title").offset().top
        }, 500);

        $(this.el).fadeIn(700);
        $(this.el).html(this.template());
        
        return this;
    },
    cancel : function(){
        
        $(this.el).fadeOut(1500);
        setTimeout(function(){$(this.el)},1500);
    }

});

var ChangeVoteView = Backbone.View.extend({
    el : $("#alert_container_msj"),
    template : _.template($("#ChangeVoteTemplate").html()),
    initialize : function(){
        this.render();
        //setTimeout(this.cancel(),3000);
    },
    render : function(){
        $('html,body').animate({
            scrollTop: $("#header_title").offset().top
        }, 500);

         
     

        $(this.el).fadeIn(700)
        $(this.el).html(this.template());
        return this;
    },
    cancel : function(){
        $(this.el).fadeOut(1500);
        setTimeout(function(){$(this.el)},1500);
    }

});

var RepeatVoteView = Backbone.View.extend({
    el : $("#alert_container_msj"),
    template : _.template($("#RepeatVoteTemplate").html()),
    initialize : function(){
        this.render();
        //setTimeout(this.cancel(),3000);
    },
    render : function(){
        $('html,body').animate({
            scrollTop: $("#header_title").offset().top
        }, 500);

        $(this.el).fadeIn(700);
        $(this.el).html(this.template());
       
        return this;
    },
    cancel : function(){
        $("#alert_container_msj").modal("hide");
        $(this.el).fadeOut(1500);
    }

});




var nav_tab  = new NavTabPocket();