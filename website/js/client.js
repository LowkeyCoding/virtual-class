const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");
// BASE DATA
const params = getParams(window.location.href);
const vclass = new VirtualClass("client", {
    host: 'peerjs.walsted.dev',
    port: 443,
    path: '/p2p',
    secure: true,
    debug:3,
    config: {
        'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            }
        ] 
    }
}, params);
document.getElementById("class-name").innerHTML = vclass.roomName;
vclass.setup();

(setup = () => {
    // Joins the selected host if the peer has been created
    if (vclass._open == true) {
        vclass.joinHost();
        return;
    }
    setTimeout(setup, 50);
})()

