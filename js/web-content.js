window.onload = function() {

  chrome.storage.sync.get("bpUserData", function (obj) {
    // review & lessons quiz: auto-expand the "item info" panel
    if (obj.bpUserData.expandInfoPanel === true){
      if (document.getElementById('reviews') != null || document.getElementById('lessons') != null) {
        var observer = new WebKitMutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.target.type === 'fieldset') {
              // wait and check that the panel is not already expanded before expanding it
              setTimeout(function(){
                if (document.getElementById('option-item-info').className != 'active'){
                  document.getElementById('option-item-info').click();
                }
              }, 200)
              return;
            }
          });
        });
        observer.observe(
          document.getElementById('answer-form'), 
          {
              attributes: true, 
              subtree: true
          }
        );
      }
    }
  });

  // hide the alert messages (ex: if the user is already logged)
  var isError = document.getElementsByClassName('alert alert-error fade in');
  if (isError.length == 1) {
    isError[0].style.display='none';
  }
}
