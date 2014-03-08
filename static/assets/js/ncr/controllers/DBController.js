<<<<<<< HEAD
// variables for search status
var request, finished;

function DBController($scope, $resource) {
    alert("THIS IS BEING CALLED");
    //define a new model resource that will simplify interaction between the web server and the client

    //This is for getting all models
    var DB = $resource('/get_db');
}

// search on submit event
$("#searchModelsForm").submit(function(event) {
        finished = false;
        // get the form data
        //var formData = new FormData($(this)[0]);
        
        //HACK
 var formData = new FormData($(this)[0]);
  formData.append("contains", "test");
   
		//should do some form checking sometime
		
        // initiate request
        request = $.ajax({
                // route to call
                url: "/search_models",
                // type of request
                type: "POST",

                // data to send
                data: formData,

                // disable caching and uneeded functions
                cache: false,
                contentType: false,
                processData: false
        });
		
        // function callback on successful search
        request.done(function(response, textStatus, jqXHR) {
                console.log("search complete");
                alert(response["izh"]);//WHAT DID KATIES FUNCTION GIVE BACK??
        });

        // function callback on failed search
        request.fail(function(jqXHR, textStatus, error) {
                console.error("Error in search!");
                alert("Error :( ");
        });

        // function callback to be called reguardless of success or failure
        request.always(function() {
        });

        // prevent the default action for this event
        event.preventDefault();
});

// search on submit event
$("#searchModelsForm").submit(function(event) {
                              finished = false;
                              // get the form data
                              //var formData = new FormData($(this)[0]);
                              
                              //HACK
                              var formData = new FormData($(this)[0]);
                              formData.append("contains", "test");
                              
                              
                              
                              //should do some form checking sometime
                              
                              // initiate request
                              request = $.ajax({
                                               // route to call
                                               url: "/search_models",
                                               // type of request
                                               type: "POST",
                                               
                                               // data to send
                                               data: formData,
                                               
                                               // disable caching and uneeded functions
                                               cache: false,
                                               contentType: false,
                                               processData: false
                                               });
                              
                              // function callback on successful search
                              /*request.done(function(response, textStatus, jqXHR) {
                                           console.log("search complete");
                                           alert(response["izh"]);//WHAT DID KATIES FUNCTION GIVE BACK??
                                           });
                              
                              // function callback on failed search
                              request.fail(function(jqXHR, textStatus, error) {
                                           console.error("Error in search!");
                                           alert("Error :( ");
                                           });
                              
                              // function callback to be called reguardless of success or failure
                              request.always(function() {
                                             });
                              */
                              // prevent the default action for this event
                              event.preventDefault();
                              });

/* From http://www.benknowscode.com/2013/12/bootstrap-dropdown-button-select-box-control.html */
$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
                      
                      var $target = $( event.currentTarget );
                      
                      $target.closest( '.btn-group' )
                      .find( '[data-bind="securityLabel"]' ).text( $target.text() )
                      .end()
                      .children( '.dropdown-toggle' ).dropdown( 'toggle' );
                      
                      return false;
                      
                      });

/*
// update file information on change event
$("#uploadModelFile").change(function() {
        var file = this.files[0];
        fileName = file.name;
        fileSize = file.size;
        fileType = file.type;

        // check for invalid file extensions
        if(fileName.indexOf(".json") === -1 && fileName.indexOf(".py") === -1) {
                // show error if incorrect file type
                $("#possibleError").show();
                // disable Ok button
                $("#importOkButton").prop("disabled", true);
        }

        // else correct file type
        else {
                // hide possible error message
                $("#possibleError").hide();
                // enable Ok button
                $("#importOkButton").prop("disabled", false);
        }
});
*/
=======
function DBController($scope, $resource) {
    //define a model resource
    var DBModel = $resource('/dbmodels/:dbmodelname', { modelname: '@dbmodelname' },
        { save: { method: 'PUT', url: '/dbmodels/:dbmodelname' } }
        );

    //This is for getting all models
    var DBModels = $resource('/dbmodels');

    //loads all models from the server and updates the scopes
    function updateDBModels() {
        DBModels.query({}, function (result) {
            $scope.dbmodels = result;
        });
    }

    //delete a model and update the display
    $scope.deleteDBModel = function (dbmodelname) {
        DBModel.remove({ dbmodelname: dbmodelname });
        updateDBModels();
    }

    //create a new model and save as a new record if it doesn't exist, or update if it does
    //this is probably done by NCB, but can still tweak to have it work to promote or alter existing models.
    $scope.addUpdateDBModel = function () {
        var dbmodel = new DBModel({
            dbmodelname: $scope.dbmodelname,
        });
        dbmodel.$save();
        updateDBModels();
    };

    //update the models outright
    updateDBModels();
}
>>>>>>> searchLeftExpand
