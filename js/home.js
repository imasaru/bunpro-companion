window.onload = function() {

  var bpUserData = JSON.parse(localStorage.bpUserData);
  fullfillUserData();

  // display info message if the user is coming for the first time
  if (bpUserData.userPublicKey === undefined || bpUserData.userPublicKey == ""){
    document.querySelector(".info").style.display = 'inline';
  } else {
     // reload user data
    requestUserData(false, function() {
      bpUserData = JSON.parse(localStorage.bpUserData);
      fullfillUserData();
    });
  }

    // action when username is clicked
    document.getElementById('h.username').onclick = function() {
        window.open('https://bunpro.jp/users/' + bpUserData.username)
    }

    // display Gravatar image (if exist)
  var xhr = new XMLHttpRequest();
  xhr.open("GET", 'http://www.gravatar.com/avatar/' + bpUserData.gravatar + '?d=404', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        document.getElementById('gravatar').src = 'http://www.gravatar.com/avatar/' + bpUserData.gravatar;
      }
    }
  }
  xhr.send();

    // action when level is clicked
    document.getElementById('h.level').onclick = function() {
        window.open('https://bunpro.jp/user/profile/stats')
    }

  // when the user click on a link, it redirect the url to the web-container page or a new Chrome tab (depends on user settings)
  var inApp = bpUserData.inAppNavigation;
  document.getElementById('toLessons').onclick = function() {
    var url = "https://bunpro.jp/learn"
    if (inApp){
      localStorage.toLink = url;
    } else {
      chrome.tabs.create({ url: url });
    }
  }
  document.getElementById('toReviews').onclick = function() {
    var url = "https://bunpro.jp/study";
    if (inApp){
     localStorage.toLink = url;
    } else {
     chrome.tabs.create({ url: url });
    }
  }
  document.getElementById('toDashboard').onclick = function() {
     var url = "https://bunpro.jp/login";
     if (inApp){
       localStorage.toLink = url;
     } else {
       chrome.tabs.create({ url: url });
     }
  }

  // fullfill user data
  function fullfillUserData(){

     document.getElementById('username').innerHTML = bpUserData.username;
     document.getElementById('level').innerHTML = bpUserData.level;
     document.getElementById('title').innerHTML = bpUserData.title;
     document.getElementById('nbReviews').innerHTML = bpUserData.nbReviews;
     document.getElementById('reviewTime').innerHTML = bpUserData.nextReview;
     document.getElementById('srsNbApprentice').innerHTML = bpUserData.srsNbApprentice;
     document.getElementById('srsNbGuru').innerHTML = bpUserData.srsNbGuru;
     document.getElementById('srsNbMaster').innerHTML = bpUserData.srsNbMaster;
     document.getElementById('srsNbEnlighten').innerHTML = bpUserData.srsNbEnlighten;
     document.getElementById('srsNbBurned').innerHTML = bpUserData.srsNbBurned;

     if (bpUserData.nbReviews > 0 || !bpUserData.nextReview){
         // the user has reviews, or does not have next reviews
         document.querySelector("#reviews").style.display = 'block';
         document.querySelector("#nextReviews").style.display = 'none';
     } else {
         // the user does not have available reviews, display when will be the next one
         document.querySelector("#reviews").style.display = 'none';
         document.querySelector("#nextReviews").style.display = 'block';
     }
  }
}
