const updateMessageBoard = (connection, message) => {
    document.getElementById(
        'messageBoard',
    ).innerText += `[${connection.peer}]: ${message}\n`;
}

const updatePeerList = (peerList) => {
    _ = peerList
        ? peerList
        : generatePeerList();
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
        sender: peerId,
        message: message,
        type: type
    };

    if (hostConnection) {
        console.log('SSS' + JSON.stringify(data));
        hostConnection.send(data);
    }

    // host send
    if (!clientConnections.isEmpty()) {
        broadcast({
            ...data,
            peers: generatePeerList(),
        });
    }

    document.getElementById('message').innerText = '';
}

const handleData = (data, connection) => {
    if (data.type == "message"){
        updateMessageBoard(connection, data.message);
    } else if (data.type == "room update" && connection.peer == hostConnection.peer ) {
        updateRoom(data)
    }
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
    document.getElementById('signallerBtn').disabled = true;

    document.getElementById(
        'signallerBtn',
    ).innerText = `◌ SEARCHING FOR SIGNALLER...`;
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

        document.getElementById(
            'hostId',
        ).innerText = `CONNECTED TO ${hostConnection.peer}.`;
    });

    hostConnection.on('data', (data) => {
        console.log('Recvied data:\n', data);

        handleData(data, hostConnection)

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
    console.log(
        `${connection.peer} attempting to establish connection.`,
    );
    console.log("peer", connection.peer);
    console.log("connection", connection);
    
    connection.on('open', onOpenConnection(connection, handler));

    connection.on('data', onDataReceived(data, connection));

    connection.on('close', onClose());
}
const onDataReceived = (data, connection) => {
    console.log('Recvied data:\n', data);
    handleData(data, connection);
    broadcast({
        ...data,
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
        sender: 'SYSTEM',
        message: `${connection.peer} joined.`,
        type: 'message'
    };

    updatePeerList();
    handleData(data. connection);

    broadcast({
        ...data,
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
        document.getElementById(
            'signallerBtn',
        ).innerText = `✘ DISCONNECTED FROM SIGNALLER. RECONNECT?`;
        document.getElementById('signallerBtn').disabled = false;
}
const onOpen = (id) => {
    console.log('Connection to signaller establised.');
    console.log(`Assigning id: ${id}`);

    document.getElementById(
        'signallerBtn',
    ).innerText = `✔ CONNECTED TO SIGNALLER`;

    document.getElementById('signallerBtn').disabled = true;

    document.getElementById('selfId').innerText =
        'YOUR ID IS ' + id;

    updatePeerList();
}
const onClose = () => {
    console.log(`Connection to ${connection.peer} is closed.`);
    clientConnections = clientConnections.delete(
        connection.peer.toString(),
    );

    const data = {
        sender: 'SYSTEM',
        message: `${connection.peer} left.`,
        type: 'message'
    };

    updatePeerList();
    handleData(data, connection);

    broadcast({
        ...data,
        peers: generatePeerList(),
    });
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