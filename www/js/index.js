var URL = "iab_content_page.html";

var webView, iabOpts, osVersion, iab, updateTimerId;

function log(msg){
    console.log(msg);
    $('#log').append("<p>"+msg+"</p>");
}

function openIAB(){
    iab = cordova.InAppBrowser.open(URL, '_blank', iabOpts);

    iab.addEventListener('loadstart', function(e) {
        log("received 'loadstart' event for: "+ e.url);
    });
    iab.addEventListener('loadstop', function(e) {
        log("received 'loadstop' event for: "+ e.url);
        testInjection();
    });
    iab.addEventListener('loaderror', function(e) {
        log("received 'loaderror' event for: "+ e.url);
    });
    iab.addEventListener('exit', function() {
        log("received 'exit' event");
        clearInterval(updateTimerId);
        updateTimerId = null;
    });
}

function testInjection(){
    iab.executeScript({
        code: "(function() { " +
            "var body = document.querySelector('body'); " +
            "var bottom = document.createElement('div'); " +
            "bottom.innerHTML = 'Absolute Bottom'; " +
            "bottom.classList.add('bottom');  " +
            "body.appendChild(bottom); " +
            "var time = document.createElement('div'); " +
            "time.id=\"time\"" +
            "body.appendChild(time); " +
        "})(); " +
        "document.getElementsByTagName('h1')[0].innerHTML = \" Injected Title\";"
    }, function(returnValue){
        returnValue = returnValue[0];
       log("executeScript callback returned : " + returnValue);
    });

    iab.insertCSS({
        code: "body *{color: red !important;},"+
              ".bottom { position: fixed; bottom: 0; z-index: 500; width: 100%; background: black; opacity: 0.5; padding: 10px; font-size: 20px;}"
    }, function(){
        log("insertCSS called back");
    });

    updateTimerId = setInterval(function(){
        iab.executeScript({
            code: "(function() { " +
                "var timeEl = document.getElementById('time');" +
                "if(!timeEl){ " +
                    "var body = document.querySelector('body'); " +
                    "timeEl = document.createElement('div'); " +
                    "timeEl.id=\"time\"; " +
                    "body.appendChild(timeEl); " +
                "}" +
                "var time = (new Date()).toISOString(); " +
                "timeEl.innerHTML = time; " +
                "return time;" +
            "})();"
        }, function(returnValue){
            returnValue = returnValue[0];
            log("executeScript for updateTimer returned : " + returnValue);
        });
    }, 1000);

}


function onDeviceReady(){
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    if( device.platform === "iOS" ) {
        iabOpts = 'location=no,toolbar=yes';
        if(window.webkit && window.webkit.messageHandlers ) {
            webView = "WKWebView" ;
        }else{
            webView = "UIWebView" ;
        }
    }else{
        iabOpts = 'location=yes';
        if(navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk" ;
        } else {
            webView = "System" ;
        }
    }

    $('#platform').html(device.platform + " " + device.version);
    $('#webview').html(webView);
}

$(document).on('deviceready', onDeviceReady);
