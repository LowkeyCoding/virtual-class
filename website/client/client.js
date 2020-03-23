const streamElement = document.getElementById("stream");
const message = document.getElementById('message');

peer.on('open', onOpen(id));

peer.on('connection', onConnection(connection, null));

peer.on('call', onCall(call));

peer.on('disconnected', onDisconnect());

peer.on('error', (error) => {
    console.log(error);
});