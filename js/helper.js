// initialize the local object for user data
function BpUserData(){
  this.userPublicKey = "";
  this.refreshInterval = 900000;
  this.notifLifetime = 10000;
  this.inAppNavigation = false;
  this.expandInfoPanel = true;
  this.hide0Badge = false;
  this.notifSound = true;

  this.username = "Mysterious Unknown";
  this.gravatar = "";
  this.level = "42";
  this.title = "Legend";
  this.nbReviews = 0;
// this.srsNbApprentice = 0;
// this.srsNbGuru = 0;
// this.srsNbMaster = 0;
// this.srsNbEnlighten = 0;
// this.srsNbBurned = 0;
}

// save the local user data
function setBpUserData(bpUserData, callback){
  // save the data into the local storage
  localStorage.bpUserData = JSON.stringify(bpUserData);
  // ... and sync it with the current Chrome account
  chrome.storage.sync.set({'bpUserData': bpUserData});

  if (callback) callback();
}

// get the local user data as an object
function getBpUserData(){
  return JSON.parse(localStorage.bpUserData);
}

// get the user data via the Bunpro API
function getApiData(publicKey, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://bunpro.jp/api/user/" + publicKey + "/" + type, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(JSON.parse(xhr.responseText));
    }
  }
  xhr.send();
}

// get a human readable value of the remaning time before the [reviewDate]
function parseRemainingTime(reviewDate) {
  if (reviewDate){
    var now = moment();
    var review = moment(new Date(reviewDate*1000));
    return review.from(now);
  }
  // [reviewDate] is null when the user hasn't done any lesson yet
  return null;
}

// update the local user data from the JSON data returned from the Bunpro API
function updateBpUserData(jsonUserData, type, callback){

  var bpUserData = JSON.parse(localStorage.bpUserData);

  bpUserData.username = jsonUserData.user_information.username;
  bpUserData.gravatar = jsonUserData.user_information.gravatar;
  bpUserData.level = jsonUserData.user_information.level;
  bpUserData.title = jsonUserData.user_information.title;

  if (type == "study_queue") {
    bpUserData.nbReviews = jsonUserData.requested_information.reviews_available;
    bpUserData.nextReview = parseRemainingTime(jsonUserData.requested_information.next_review_date);

  }
  //   else if (type == "srs_distribution") {
  //   bpUserData.srsNbApprentice = jsonUserData.requested_information.apprentice.total;
  //   bpUserData.srsNbGuru = jsonUserData.requested_information.guru.total;
  //   bpUserData.srsNbMaster = jsonUserData.requested_information.master.total;
  //   bpUserData.srsNbEnlighten = jsonUserData.requested_information.enlighten.total;
  //   bpUserData.srsNbBurned = jsonUserData.requested_information.burned.total;
  // }

  setBpUserData(bpUserData);

  if (callback) callback();
}

// request the data to Bunpro API, display notifications and save local data
function requestUserData(notify, callback) {

  var currentData = getBpUserData();

  // update data and display notifications
  if (currentData.userPublicKey != "") {

    // get reviews data
    getApiData(currentData.userPublicKey, "study_queue", function(userData){

      var nbReviews = userData.requested_information.reviews_available;

      // display desktop notifications
      if (notify === true && currentData.refreshInterval != 0) {
          var notified = false;
          var reviewTxt = (nbReviews > 1) ? "reviews" : "review";
          if (nbReviews > 0 && nbReviews != currentData.nbReviews) {
            if (nbReviews === 1) {
            // special case of a single review
              createNotification("You have " + nbReviews + " " + reviewTxt + " available.", "https://bunpro.jp/study", "reviews");
              notified = true;
            } else {
              createNotification("You have " + nbReviews + " "+ reviewTxt + " available.", "https://bunpro.jp/study", "reviews");
              notified = true;
            }
          }
          // play notification sound
          if (notified === true && currentData.notifSound === true){
            var sound = new Audio('/snd/notification.mp3');
            sound.play();
          }
      }

      // update badge text and title
      var total = nbReviews;
      if (total == 0 && currentData.hide0Badge) {
        chrome.browserAction.setBadgeText({text:""});
      } else {
        chrome.browserAction.setBadgeText({text:total.toString()});
      }
      chrome.browserAction.setTitle({title: "Bunpro Companion" + "\n" + "Review(s): " + nbReviews});
      // save study data
      updateBpUserData(userData, "study_queue", function(){
        // // get the srs distribution data
        // getApiData(currentData.userPublicKey, "srs_distribution" ,function(userData){
        //   // save srs distribution data
        //   updateBpUserData(userData, "srs_distribution", function(){ if (callback) callback(); });
        // });
      });

    });
  }
}

// create a HTML notification
function createNotification(body, url, tag){

  var notification = new Notification('Bunpro Companion', {
    icon: '/img/bunpro/icon.png',
    body: body,
    tag: tag
  });

  notification.onclick = function() {
    window.open(url);
  }

  // vanish the notifications after [notifLifetime] ms
  // if [notifLifetime] == -1, the notification stay until the user close it
  if (getBpUserData().notifLifetime != -1) {
    notification.onshow = function() {
      window.setTimeout(function() { notification.close() }, getBpUserData().notifLifetime);
    }
  }
}
