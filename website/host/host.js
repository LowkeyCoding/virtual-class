// Stream section
const streamElement = document.getElementById("stream");
const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");
var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: true
};

startElement.addEventListener("click", function() {
    startCapture();
}, false);
stopElement.addEventListener("click", function() {
    stopCapture();
}, false);

const boardcast_stream = (stream, peerID) => {
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

const startCapture = () => {
    try {
      navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream => {
        streamElement.srcObject = stream;
        window.Stream = stream;
        console.log("stream", stream)
        boardcast_stream(stream, null)
      })
    } catch(err) {
      console.error("Error: " + err);
    }
}
const stopCapture = () => {
    let tracks = streamElement.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    streamElement.srcObject = null;
}


peer.on('open', (id)=>{onOpen(id)});

peer.on('connection', (connection)=>{onConnection(connection, hostHandler())});

peer.on('disconnected', ()=>{onDisconnect()});

peer.on('error', (error) => {
    console.log(error);
});
