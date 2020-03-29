const streamElement = document.getElementById("stream");
const message = document.getElementById('message');
const signallerButton = document.getElementById("signallerBtn");
// BASE DATA
const params = getParams(window.location.href);
const vclass = new VirtualClass("client", {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
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

