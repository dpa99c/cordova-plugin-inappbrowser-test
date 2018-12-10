//var IAB_PAGE_URL = "iab_content/iab.html";
var IAB_PAGE_URL = "https://dpa99c.github.io/cordova-plugin-inappbrowser-test/iab_content/iab.html";

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
    if($('#hideonopen input')[0].checked){
        $('body').addClass("hidden");
        iabOpts += ",hidden=yes";
    }

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
        onIABLoaded();
    });
    iab.addEventListener('loaderror', function(e) {
        log("received 'loaderror' event");
        error("loaderror: " + e.message);
        console.error("received 'loaderror' event for: " + e.url);
    });
    iab.addEventListener('exit', function () {
        log("received 'exit' event");
        readMyCookie();
    });
    iab.addEventListener('message', function (e) {
        log("received 'message' event");
        console.dir(e);
        if(e.data.action === 'hide'){
            hideIAB();
        }
    });
    iab.addEventListener('beforeload', function (e, cb) {
        log("received 'beforeload' event");
        console.log("received 'beforeload' event for: " + e.url);
        if($('#abort-on-beforeload')[0].checked){
            log("aborted on beforeload");
            console.warn("aborted on beforeload: "+e.url);
            iab.close();
        }else{
            cb(e.url);
        }
    });
}

function onIABLoaded() {

}


function hideIAB(){
    $('body').addClass("hidden");
    iab.hide();
    readMyCookie();
}

function showIAB(){
    $('body').removeClass("hidden");
    iab.show();
    iab.executeScript({
        code: "readMyCookie();"
    });
}

function onChangeBeforeLoad(){
    $('#abort-on-beforeload').attr('disabled', !$('#beforeload').val());
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
    if($('#beforeload').val()){
        iabOpts += ',beforeload='+$('#beforeload').val();
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

    setMyCookie();
    document.getElementById('mycookie').addEventListener('change', setMyCookie);
    document.getElementById('beforeload').addEventListener('change', onChangeBeforeLoad);
    onChangeBeforeLoad();
}


$(document).on('deviceready', onDeviceReady);
