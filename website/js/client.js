const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");
// BASE DATA
var clientConnections = Immutable.Map({});

var hostConnection;
const params = getParams(window.location.href);
const peerId = params.peerId;
const hostId = params.hostId;
const peer = new Peer(peerId, {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
});
// Sets up the handlers
peer.on('open', (id)=>{onOpen(id)});

peer.on('connection', (connection)=>{onConnection(connection.provider._id, null)});

peer.on('call', (call)=>{onCall(call)});

peer.on('disconnected', ()=>{onDisconnect()});

peer.on('error', (error) => {
    console.log(error);
});

(setup = () => {
    // Joins the selected host if the peer has been created
    if (peer._open == true) {
        join();
        return;
    }
    setTimeout(setup, 50);
})()

