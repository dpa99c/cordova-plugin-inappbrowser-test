function showPlatformDetails(){
    var webView, platform;
    if (navigator.userAgent.match(/(Android|Chrome)/)) {
        platform = "Android";
        if (navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk";
        } else {
            webView = "System";
        }
        var androidVersionMatch = navigator.userAgent.match(/Android \d\.\d/);
        if(androidVersionMatch){
            platform = androidVersionMatch[0];
        }
    } else if (navigator.userAgent.match(/(Apple)/)) {
        platform = "iOS";
        if (window.webkit && window.webkit.messageHandlers) {
            webView = "WKWebView";
        } else {
            webView = "UIWebView";
        }

    }else{
        webView = platform = "Unknown";
    }
    document.getElementById('platform').innerHTML = platform;
    document.getElementById('webview').innerHTML = webView;
}

function onClickPostMessage(){
    postMessage({
        action: "logout"
    });
}

function postMessage(message){
    if(!webkit.messageHandlers.cordova_iab) throw "Cordova IAB postMessage API not found!";
    webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
}

function setLocalStorage(){
    localStorage.setItem('mykey', document.getElementById('localstorage').value);
}

function getLocalStorage(){
    document.getElementById('localstorage').value = localStorage.getItem('mykey');
}

function hide(){
    postMessage("hide");
}

function onReady(){
    console.log("ready");
    document.getElementById('mycookie').addEventListener('change', setMyCookie);
    document.getElementById('localstorage').addEventListener('change', setLocalStorage);
    showPlatformDetails();
    readMyCookie();
    getLocalStorage();
}


// Bootstrap
(function(){
    document.addEventListener('DOMContentLoaded', onReady);
})();