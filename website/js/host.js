const params = getParams(window.location.href);
const vclass = new VirtualClass("host", {
    host: config.host,
    port: config.port,
    path: config.path,
    debug: config.debug,
    secure: config.secure,
    config: config.config
}, params);

const streamElement = document.getElementById("stream");
const message = document.getElementById("message");
const hostPeerList = document.getElementById("hostPeerList");
const userCount = document.getElementById("userCount");

const captureButton = document.getElementById("capture");

const signallerButton = document.getElementById("signallerBtn");

/*
const roomId = document.getElementById("roomID");
*/
const roomIdButton = document.getElementById("roomIDCopy");
var displayMediaOptions = {
    video: {
        cursor: "always",
        frameRate: 48
    },
    audio: true
};

captureButton.addEventListener("click", function() {
    toggleCapture();
}, false);

roomIdButton.addEventListener("click", function() {
    if(!roomIdButton.disabled)
        var text = "https://vclass.walsted.dev/?roomId=" + vclass.peerId;
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
});

const toggleCapture = async () => {
    try {
        if (captureButton.capturing) {
            if(streamElement.srcObject){
                let tracks = streamElement.srcObject.getTracks();
                vclass.stream = false;
                tracks.forEach(track => track.stop());
                streamElement.srcObject = null;
            }
            captureButton.innerHTML = "<p>Share Screen</p>";
            captureButton.capturing = false;
        } else if (!captureButton.capturing) {
            vclass.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            audio = await (await navigator.mediaDevices.getUserMedia({ audio: true, video: false })).getAudioTracks()[0];
            vclass.stream.addTrack(audio);
            streamElement.srcObject = vclass.stream;
            vclass.broadcast_stream(null);
            captureButton.innerHTML = "<p>Stop Sharing</p>"
            captureButton.capturing = true;
        }
    } catch(err) {
        if(err === "DOMException: Permission denied"){
            captureButton.innerHTML = "<p>Start Capture</p>";
            captureButton.capturing = false;
        }
        console.error("Error: " + err);
    }
}

(setup = () => {
    // setup the vclass class
    vclass.setup();
    // Set the room name
    document.getElementById("class-name").innerHTML = vclass.roomName;
    addPeer(vclass.peerId, vclass.username, vclass.iconUrl)
    // The button is disabled until the host is connected to the signaling server.
    roomIdButton.disabled = true;
    captureButton.capturing = false;
})()