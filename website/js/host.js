const params = getParams(window.location.href);
const vclass = new VirtualClass("host", {
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
addPeer(vclass.peerId, vclass.username, vclass.iconUrl)
const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");

const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");
const roomIDElement = document.getElementById("roomID");

var displayMediaOptions = {
    video: {
        cursor: "always",
        frameRate: 48
    },
    audio: true
};

startElement.addEventListener("click", function() {
    startCapture();
}, false);
stopElement.addEventListener("click", function() {
    stopCapture();
}, false);
roomIDElement.addEventListener("click", function() {
    var text = "vclass.walsted.dev/?roomId=" + vclass.peerId;
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
})
const startCapture = async () => {
    try {
        vclass.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        audio = await (await navigator.mediaDevices.getUserMedia({ audio: true, video: false })).getAudioTracks()[0];
        vclass.stream.addTrack(audio);
        streamElement.srcObject = vclass.stream;
        vclass.broadcast_stream(null);
    } catch(err) {
        console.error("Error: " + err);
    }
}
const stopCapture = () => {
    let tracks = streamElement.srcObject.getTracks();
    vclass.stream = false;
    tracks.forEach(track => track.stop());
    streamElement.srcObject = null;
}