// variables for search status
var request, finished;

// search on submit event
$("#searchModelsForm").submit(function(event) {
        finished = false;
        // get the form data
        var formData = new FormData($(this)[0]);

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
                alert(response);//WHAT DID KATIES FUNCTION GIVE BACK??
        });

        // function callback on failed search
        request.fail(function(jqXHR, textStatus, error) {
                console.error("Error in search!");
                alert("Unable to search!");
        });

        // function callback to be called reguardless of success or failure
        request.always(function() {
        });

        // prevent the default action for this event
        event.preventDefault();
});

/* From http://www.benknowscode.com/2013/12/bootstrap-dropdown-button-select-box-control.html */
$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
                      
                      var $target = $( event.currentTarget );
                      
                      $target.closest( '.btn-group' )
                      .find( '[data-bind="label"]' ).text( $target.text() )
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