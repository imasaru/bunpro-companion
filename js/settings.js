window.onload = function() {

  var bpUserData = getBpUserData();

  // display current settings
  document.getElementById('apiKey').value = bpUserData.userPublicKey;
  document.getElementById('refreshInterval').value = bpUserData.refreshInterval;
  document.getElementById('notifLifetime').value = bpUserData.notifLifetime;
  document.getElementById('notifSound').checked = bpUserData.notifSound == true ? true : false;
  document.getElementById('inAppNav').checked = bpUserData.inAppNavigation == true ? true : false;
  document.getElementById('expandInfoPanel').checked = bpUserData.expandInfoPanel == true ? true : false;
  document.getElementById('hide0Badge').checked = bpUserData.hide0Badge == true ? true : false;

  // action when LINK to Bunpro is clicked
  document.getElementById('link').onclick = function() {
    window.open('https://bunpro.jp/users/edit.' + bpUserData.username)
  }

  // action when settings are saved
  document.getElementById('save').onclick = function() {

    document.querySelector(".error").style.display = 'none';
    document.querySelector(".info").style.display = 'inline';

    var key = document.getElementById('apiKey').value;

    // the key is empty or didn't change: do not save
    if (key == "" || key == bpUserData.userPublicKey) {

      bpUserData.refreshInterval = document.getElementById('refreshInterval').value;
      bpUserData.notifLifetime = document.getElementById('notifLifetime').value;
      bpUserData.notifSound = (document.getElementById('notifSound').checked) ? true : false;
      bpUserData.inAppNavigation = (document.getElementById('inAppNav').checked) ? true : false;
      bpUserData.expandInfoPanel = (document.getElementById('expandInfoPanel').checked) ? true : false;
      bpUserData.hide0Badge = (document.getElementById('hide0Badge').checked) ? true : false;

      setBpUserData(bpUserData, function() {
        window.location.replace("/html/home.html");
      });

    // a new key has been entered: save
    } else if (key != bpUserData.userPublicKey){

      getApiData(key, "user_information", function(obj){

        // the key is not valid
        if (obj.user_information === undefined){
          document.querySelector(".error").style.display = 'inline';
          document.querySelector(".info").style.display = 'none';

        // the key is valid
        } else {
          bpUserData.userPublicKey = document.getElementById('apiKey').value;
          bpUserData.refreshInterval = document.getElementById('refreshInterval').value;
          bpUserData.notifLifetime = document.getElementById('notifLifetime').value;
          bpUserData.notifSound = (document.getElementById('notifSound').checked) ? true : false;
          bpUserData.inAppNavigation = (document.getElementById('inAppNav').checked) ? true : false;
          bpUserData.expandInfoPanel = (document.getElementById('expandInfoPanel').checked) ? true : false;
          bpUserData.hide0Badge = (document.getElementById('hide0Badge').checked) ? true : false;

          setBpUserData(bpUserData, function() {
            requestUserData(false, function(){
              window.location.replace("/html/home.html");
            });
          });
        }
      });
    }
  }
}
