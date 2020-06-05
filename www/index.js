var IAB_PAGE_URL = "https://dpa99c.github.io/cordova-plugin-inappbrowser-test/iab_content/iab.html";

var toc = "WMR";
var tocSettings = {
    SR: {
        "brandcolour": "#0e3271",
        "statusbarcolour": "#001E4F"
    },
    WMR: {
        "brandcolour": "#3C1053",
        "statusbarcolour": "#ffffff"
    }
};
var settings = tocSettings[toc];

var popupBridgeOptions = "location=no,toolbar=no,disallowoverscroll=yes,zoom=no,transitionstyle=crossdissolve,shouldPauseOnSuspend=yes";

var iabOptions = {};
function createIabOptions(isIos){
    iabOptions.stationMenu = {
        statusbar: {
            color: settings.statusbarcolour
        },
        toolbar: {
            height: 73,
            color: settings.brandcolour,
            paddingX: isIos ? 10 : 20
        },
        title: {
            color: '#ffffff',
            showPageTitle: true,
            fontSize: 24
        },
        closeButton: {
            wwwImage: 'icon/cross.png',
            wwwImageDensity: 12,
            imagePressed: 'close_pressed',
            align: 'right',
            event: 'closePressed'
        },
        fullscreen: isIos,
        backButtonCanClose: true
    };
    iabOptions.generic = {
        statusbar: {
            color: settings.statusbarcolour
        },
        toolbar: {
            height: 73,
            color: settings.brandcolour
        },
        title: {
            color: '#ffffff',
            showPageTitle: true
        },
        closeButton: {
                wwwImage: 'icon/cross.png',
            wwwImageDensity: 8,
            imagePressed: 'close_pressed',
            align: 'left',
            event: 'closePressed'
        },
        menu: {
            wwwImage: 'icon/vertical-ellipsis-with-padding.png',
            wwwImageDensity: 6,
            title: 'Options',
            cancel: 'Cancel',
            align: 'right',
            items: [
                {
                    event: 'btnOpenBrowserPressed',
                    label: 'Open in Browser'
                }
            ]
        },
        fullscreen: isIos,
        backButtonCanClose: true
    };
}


var webView, osVersion, iabRef;

function log(msg, className){
    className = className || '';
    console.log(msg);
    $('#log').append('<p class="'+className+'">'+msg+'</p>');
}

function error(msg){
    log(msg, "error");
}

function openIAB(iab, opts){
    if(!opts){
        var optsName = $('#options').val();
        opts = iabOptions[optsName];
    }
    var logmsg = "Opening IAB";
    logmsg += " with"+(optsName ? " "+optsName : '')+" opts: "+(typeof opts === 'object' ? JSON.stringify(opts): opts);
    log(logmsg);

    iabRef = iab.open(IAB_PAGE_URL, '_blank', opts);

    iabRef.addEventListener('loadstart', function(e) {
        log("received 'loadstart' event");
        console.log("received 'loadstart' event for: " + e.url);
    });
    iabRef.addEventListener('loadstop', function(e) {
        log("received 'loadstop' event");
        console.log("received 'loadstop' event for: " + e.url);
    });
    iabRef.addEventListener('loaderror', function(e) {
        log("received 'loaderror' event");
        error("loaderror: " + e.message);
        console.error("received 'loaderror' event for: " + e.url);
    });
    iabRef.addEventListener('exit', function () {
        log("received 'exit' event");
    });
    iabRef.addEventListener('message', function (e) {
        log("received 'message' event");
        console.dir(e);
    });
    iabRef.addEventListener('btnOpenBrowserPressed', function(event) {
        OpenInSystemBrowser(event.url.replace("borderless=true", ""));
    });
}

function openPopupBridge(){
    log("open PopupBridge IAB");
    openIAB(cordova.InAppBrowser, popupBridgeOptions);
}

function openThemable(){
    log("open Themeable IAB");
    openIAB(cordova.ThemeableBrowser);
}


function onDeviceReady(){
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    var isIos = device.platform === "iOS";
    createIabOptions(isIos);

    $('body').addClass(device.platform.toLowerCase());

}

function OpenInSystemBrowser(url) {
    window.open(url, '_system');
}

$(document).on('deviceready', onDeviceReady);
