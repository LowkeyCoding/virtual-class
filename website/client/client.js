const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");

peer.on('open', (id)=>{onOpen(id)});

peer.on('connection', (connection)=>{onConnection(connection.provider._id, null)});

peer.on('call', (call)=>{onCall(call)});

peer.on('disconnected', ()=>{onDisconnect()});

peer.on('error', (error) => {
    console.log(error);
});