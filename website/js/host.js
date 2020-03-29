// BASE DATA
var clientConnections = Immutable.Map({});

var hostConnection;
const params = getParams(window.location.href);
const peerId = params.peerId || randomDigits(6);
document.getElementById("class-name").innerHTML = params.roomName || "stream";

const peer = new Peer(peerId, {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
});

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

const broadcast_stream = (stream, peerID) => {
    if(peerID){
        console.log("single stream")
        peer.call(peerID, stream)
    } else {
        console.log("mass stream")
        clientConnections.forEach((connection) =>
        peer.call(connection.peer, stream)
    );
    }
}

const startCapture = async () => {
    try {
        window.Stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        audio = await (await navigator.mediaDevices.getUserMedia({ audio: true, video: false })).getAudioTracks()[0];
        window.Stream.addTrack(audio);
        streamElement.srcObject = window.Stream;
        broadcast_stream(window.Stream, null);
    } catch(err) {
        console.error("Error: " + err);
    }
}
const stopCapture = () => {
    let tracks = streamElement.srcObject.getTracks();
    window.Stream = false;
    tracks.forEach(track => track.stop());
    streamElement.srcObject = null;
}


peer.on('open', (id)=>{onOpen(id)});

peer.on('connection', (connection)=>{onConnection(connection, hostHandler(connection))});

peer.on('disconnected', ()=>{onDisconnect()});

peer.on('error', (error) => {
    console.log(error);
});
