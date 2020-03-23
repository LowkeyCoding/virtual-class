const updateMessageBoard = (connection, message) => {
    document.getElementById(
        'messageBoard',
    ).innerText += `[${connection}]: ${message}\n`;
}

const updatePeerList = (peerList) => {
    _ = peerList
        ? peerList
        : generatePeerList();
}

const updateRoom = (data) => {
    document.getElementById("class-name").innerHTML = data.message.room.name;
}

const generatePeerList = () => {
    return clientConnections
        .map((connection) => connection.peer)
        .toList()
        .push(`${peerId} (HOST)`)
        .join(', ');
}

const broadcast = (data) => {
    clientConnections.forEach((connection) =>
        connection.send(data),
    );
}

const send = (message, type) => {
    const data = {
        message: message,
        peer: null,
        type: type
    };

    if (hostConnection) {
        console.log('SSS' + JSON.stringify(data));
        hostConnection.send(data);
    }

    // host send
    if (!clientConnections.isEmpty()) {
        data.peer = peerId;
        broadcast(data);
        updateMessageBoard(data.peer, data.message);
    }

    document.getElementById('message').innerText = '';
}


const clear = () => {
    document.getElementById('message').innerText = '';
}

const hide = (element) => {
    element.classList.add('hidden');
}

const show = (element) => {
    element.classList.remove('hidden');
}

const reconnect = () => {
    console.log(`Reconnecting to signaller.`);
    if(signallerButton){
        signallerButton.disabled = true;
        signallerButton.innerText = `◌ SEARCHING FOR SIGNALLER...`;
    }
    peer.reconnect();
}

const join = () => {
    hostConnection = peer.connect(
        document.getElementById('hostIdVal').value,
    );

    hostConnection.on('open', () => {
        console.log(
            `Connection to ${hostConnection.peer} established.`,
        );
        hostid = document.getElementById('hostId')
        if(hostid)
            hostid.innerText = `CONNECTED TO ${hostConnection.peer}.`;
        hide(document.getElementById("join"))
    });

    hostConnection.on('data', (data) => {
        console.log('Recvied data:\n', data);
        console.log('Received connection:\n', hostConnection);
        handleData(data, hostConnection);

        updatePeerList(data.peers);
    });

    hostConnection.on('close', () => {
        console.log(
            `Connection to ${hostConnection.peer} is closed.`,
        );

        peer.destroy();

        location.reload();
    });
}
// HANDLERS

const onConnection = (connection, handler) => {
    console.log("peer", connection);
    
    connection.on('open', (handler)=>{onOpenConnection(connection, handler)});

    connection.on('data', (data)=>{onDataReceived(data, connection)});

    connection.on('close', ()=>{onClose(connection)});
}
const onDataReceived = (data, connection) => {
    console.log('Recvied data:\n', data);
    console.log('Recived peer:\n', connection.peer);
    data.peer = connection.peer;
    handleData(data, connection);
    broadcast({
        ...data,
        ...connection.peer,
        peers: generatePeerList(),
    });
}
const onOpenConnection = (connection, handler) => {
    console.log(
        `Connection to ${connection.peer} established.`,
    );

    clientConnections = clientConnections.set(
        connection.peer,
        connection,
    );

    const data = {
        type: 'system-join',
        peer: connection.peer
    };

    updatePeerList();
    handleData(data, connection);

    broadcast({
        ...data,
        ...connection.peer,
        peers: generatePeerList(),
    });
    if (handler) {
        handler();
    }
}
const hostHandler = () => {
    peer.call()
    if (window.Stream) {
        boardcast_stream(window.Stream, connection.peer);
    }
}
const onCall = (call) => {
    console.log("call", call)
    call.answer();
    call.on('stream', (remoteStream) => {
        console.log("rstream". remoteStream)
        streamElement.srcObject = remoteStream
    });
}
const onDisconnect = () => {
        console.log('Disconnected from signaller.');
        if(signallerButton){
            signallerButton.innerText = `✘ DISCONNECTED FROM SIGNALLER. RECONNECT?`;
            signallerButton.disabled = false;
        }
}
const onOpen = (id) => {
    console.log('Connection to signaller establised.');
    console.log(`Assigning id: ${id}`);
    if (signallerButton) {
        signallerButton.innerText = `✔ CONNECTED TO SIGNALLER`;
        signallerButton.disabled = true;
        document.getElementById('selfId').innerText =
            'YOUR ID IS ' + id;
    }
    updatePeerList();
}
const onClose = (connection) => {
    console.log(`Connection to ${connection.peer} is closed.`);
    clientConnections = clientConnections.delete(
        connection.peer.toString(),
    );

    const data = {
        type: 'system-left',
        peer: connection.peer
    };

    updatePeerList();
    handleData(data, connection);

    broadcast({
        ...data,
        peers: generatePeerList(),
    });
}
const onRoomStateChanged = () => {
    var data = {
        room: {
                name: document.getElementById("class-name").innerHTML
            }
        }
    send(data, "room-state-changed")
    console.log("room-state-changed")
}

const handleData = (data) => {
    console.log("data:",data)
    if (!data){
        console.log("No data")
    } else if (data.type  == "message"){
        updateMessageBoard(data.peer, data.message);
    } else if (data.type == "system-join") {
        updateMessageBoard("SYSTEM", `${data.peer} joined.`);
    } else if (data.type == "system-left") {
        updateMessageBoard("SYSTEM", `${data.peer} left.`);
    }else if (data.type == "room-state-changed" && data.peer == hostConnection.peer ) {
        updateRoom(data)
    }
}

// BASE DATA
var clientConnections = Immutable.Map({});

var hostConnection;

const peerId = randomDigits(6);

const peer = new Peer(peerId, {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
});