window.onload = function() {
  
  var loopRequestId;

  // initialize the badge color
  chrome.browserAction.setBadgeBackgroundColor({color:'#ff00aa'}); 

  // check that there is a Chrome sync value
  chrome.storage.sync.get("bpUserData", function (obj) {
    if (obj.bpUserData === undefined){
      if (localStorage.bpUserData === undefined){
          // if a local storage does not exist, initialize it
          setBpUserData(new BpUserData());
      }
    } else {
      // get the existing user data from Chrome sync
      localStorage.bpUserData = JSON.stringify(obj.bpUserData);
    }
    loopRequestUserData();
  });
  
  // update data every x milliseconds
  function loopRequestUserData(){
    var bpUserData = JSON.parse(localStorage.bpUserData);
    requestUserData(true, function(){
      loopRequestId = window.setTimeout(loopRequestUserData, bpUserData.refreshInterval, true, true);
    });
  }

  // when the update interval is changed, restart loopRequestUserData with the updated interval
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ('bpUserData' in changes && loopRequestId !== undefined) {
      var oldValues = changes.bpUserData.oldValue;
      var newValues = changes.bpUserData.newValue;
      if (newValues.refreshInterval != oldValues.refreshInterval) {
        window.clearTimeout(loopRequestId);
        loopRequestId = loopRequestUserData();
      }
    }
  });

  // disable 'X-Frame-Options' header to allow inlining pages within an iframe
  chrome.webRequest.onHeadersReceived.addListener(
      function(details) {
          var headers = details.responseHeaders;
          for (var i = 0; i < headers.length; ++i) { 
            if (headers[i].name == 'X-Frame-Options') {
                headers.splice(i, 1);
                break;
            }
          }
          return {responseHeaders: headers};
      },
      {
          urls: [ '*://*/*' ]
      },
      ['blocking', 'responseHeaders']
  );
}
