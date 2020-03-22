const streamElement = document.getElementById("stream");

var clientConnections = Immutable.Map({});

var hostConnection;

const peerId = randomDigits(6);
const peer = new Peer(peerId, {
    host: 'kfwong-server.herokuapp.com',
    port: 443,
    path: '/myapp',
    secure: true,
});

peer.on('open', (id) => {
    console.log('Connection to signaller establised.');
    console.log(`Assigning id: ${id}`);
    updatePeerList();
});

peer.on('connection', (connection) => {
    console.log(
        `${connection.peer} attempting to establish connection.`,
    );
    console.log("peer", connection.peer);
    console.log("connection", connection);
    
    connection.on('open', () => {
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
        };

        peer.call()

        updatePeerList();
        updateMessageBoard(data.sender, data.message);

        broadcast({
            ...data,
            peers: generatePeerList(),
        });
    });

    connection.on('data', (data) => {
        console.log('Recvied data:\n', data);

        updateMessageBoard(data.sender, data.message);

        broadcast({
            ...data,
            peers: generatePeerList(),
        });
    });

    connection.on('close', () => {
        console.log(`Connection to ${connection.peer} is closed.`);
        clientConnections = clientConnections.delete(
            connection.peer.toString(),
        );

        const data = {
            sender: 'SYSTEM',
            message: `${connection.peer} left.`,
        };

        updatePeerList();
        updateMessageBoard(data.sender, data.message);

        broadcast({
            ...data,
            peers: generatePeerList(),
        });
    });
});

peer.on('call', (call) => {
    console.log("call", call)
    call.answer();
    call.on('stream', (remoteStream) => {
        console.log("rstream". remoteStream)
        streamElement.srcObject = remoteStream
    });
  });

peer.on('disconnected', () => {
    console.log('Disconnected from signaller.');
});

peer.on('error', (error) => {
    console.log(error);
});

function reconnect() {
    console.log(`Reconnecting to signaller.`);
    peer.reconnect();
}

function join() {
    hostConnection = peer.connect(
        document.getElementById('hostIdVal').value,
    );

    hostConnection.on('open', () => {
        console.log(
            `Connection to ${hostConnection.peer} established.`,
        );
    });

    hostConnection.on('data', (data) => {
        console.log('Recvied data:\n', data);

        updateMessageBoard(data.sender, data.message);

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

function updateMessageBoard(id, message) {
    document.getElementById(
        'messageBoard',
    ).innerText += `[${id}]: ${message}\n`;
}

function updatePeerList(peerList) {
    _ = peerList
        ? peerList
        : generatePeerList();
}

function generatePeerList() {
    return clientConnections
        .map((connection) => connection.peer)
        .toList()
        .push(`${peerId} (HOST)`)
        .join(', ');
}

function broadcast(data) {
    clientConnections.forEach((connection) =>
        connection.send(data),
    );
}

function send() {
    const data = {
        sender: peerId,
        message: document.getElementById('message').value,
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

        updateMessageBoard(data.sender, data.message);
    }

    document.getElementById('message').innerText = '';
}

function clear() {
    document.getElementById('message').innerText = '';
}

function hide(element) {
    element.classList.add('hidden');
}

function show(element) {
    element.classList.remove('hidden');
}