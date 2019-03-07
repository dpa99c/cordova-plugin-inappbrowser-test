var IAB_PAGE_URL = "iab_content/iab.html";
// var IAB_PAGE_URL = "https://dpa99c.github.io/cordova-plugin-inappbrowser-test/iab_content/iab.html";

var webView, osVersion, iab, targetWebview;

function log(msg, className){
    className = className || '';
    console.log(msg);
    $('#log').append('<p class="'+className+'">'+msg+'</p>');
}

function error(msg){
    log(msg, "error");
}

function openIAB(){
    var iabOpts = getIabOpts();

    var logmsg = "Opening IAB";
    if(device.platform === "iOS"){
        if(targetWebview === "wkwebview"){
            logmsg += " using WKWebView";
        }else{
            logmsg += " using UIWebView";
        }
    }
    logmsg += " with opts: "+iabOpts;
    log(logmsg);

    iab = cordova.InAppBrowser.open(IAB_PAGE_URL, '_blank', iabOpts);

    iab.addEventListener('loadstart', function(e) {
        log("received 'loadstart' event");
        console.log("received 'loadstart' event for: " + e.url);
    });
    iab.addEventListener('loadstop', function(e) {
        log("received 'loadstop' event");
        console.log("received 'loadstop' event for: " + e.url);
    });
    iab.addEventListener('loaderror', function(e) {
        log("received 'loaderror' event");
        error("loaderror: " + e.message);
        console.error("received 'loaderror' event for: " + e.url);
    });
    iab.addEventListener('exit', function () {
        log("received 'exit' event");
    });
    iab.addEventListener('message', function (e) {
        log("received 'message' event");
        console.dir(e);
        if(e.data.action === 'camera'){
            openCamera();
        }
    });
}

function openCamera() {
    navigator.camera.getPicture(function(){
        log("successfully opened camera");
    }, function(cameraError){
        error("error opening camera: "+cameraError);
    });
}


function getIabOpts(){
    var iabOpts;
    if (device.platform === "iOS") {
        iabOpts = 'location=no,toolbar=yes';
        targetWebview = $('input[name=webview]:checked').val();
        if(targetWebview === "wkwebview"){
            iabOpts += ',usewkwebview=yes';
        }

    } else {
        iabOpts = 'location=yes';
    }
    return iabOpts;
}

function onDeviceReady(){
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    if( device.platform === "iOS" ) {
        if(window.webkit && window.webkit.messageHandlers ) {
            webView = "WKWebView" ;
        }else{
            webView = "UIWebView" ;
        }
    }else{
        if(navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk" ;
        } else {
            webView = "System" ;
        }
    }

    $('#platform').html(device.platform + " " + device.version);
    $('#webview').html(webView);
    $('body').addClass(device.platform.toLowerCase());
}

$(document).on('deviceready', onDeviceReady);
