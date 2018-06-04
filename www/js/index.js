var URL = "iab_content_page.html";

var webView, iabOpts, osVersion, iab,
    $useWKWebView, $useWKWebViewCheckbox;

function log(msg){
    console.log(msg);
    $('#log').append("<p>"+msg+"</p>");
}

function openIAB(){
    var opts = iabOpts;
    var logmsg = "Opening IAB";
    if(device.platform === "iOS"){
        if($useWKWebViewCheckbox.is(':checked')){
            opts += ",usewkwebview=yes";
            logmsg += " using WKWebView";
        }else{
            logmsg += " using UIWebView";
        }
    }

    iab = cordova.InAppBrowser.open(URL, '_blank', opts);

    iab.addEventListener('loadstart', function(e) {
        log("received 'loadstart' for URL: "+ e.url);
    });
    iab.addEventListener('loadstop', function(e) {
        log("received 'loadstop' for URL: "+ e.url);
    });
    iab.addEventListener('loaderror', function(e) {
        log("received 'loaderror' for URL: "+ e.url);
    });
}

function onDeviceReady(){
    console.log("deviceready");

    osVersion = parseFloat(device.version);
    $useWKWebView = $('.usewkwebview');
    $useWKWebViewCheckbox = $('.usewkwebview input');

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
        $useWKWebView.addClass('disabled');
        $useWKWebViewCheckbox.attr('disabled', true);
    }

    $('#platform').html(device.platform + " " + device.version);
    $('#webview').html(webView);
}

$(document).on('deviceready', onDeviceReady);
