const params = getParams(window.location.href);
const vclass = new VirtualClass("host", {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
}, params);
document.getElementById("class-name").innerHTML = vclass.roomName;
vclass.setup();

const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");

const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");

var displayMediaOptions = {
    video: {
        cursor: "always",
        frameRate: 144
    },
    audio: true
};

startElement.addEventListener("click", function() {
    startCapture();
}, false);
stopElement.addEventListener("click", function() {
    stopCapture();
}, false);

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

