// Add text to messageBoard Element
const updateMessageBoard = (connection, message) => {
    document.getElementById(
        'messageBoard',
    ).innerText += `[${connection}]: ${message}\n`;
}
// Update room name
const updateRoom = (data) => {
    document.getElementById("class-name").innerHTML = data.room.name;
}
// Updates the list of peers in the room.
const updatePeerList = () => {
    return clientConnections
        .map((connection) => connection.peer)
        .toList()
        .push(`${peerId} (HOST)`)
        .join(', ');
}
// Broadcast a messsage to all connected peers.
const broadcast = (data) => {
    clientConnections.forEach((connection) =>
        connection.send(data),
    );
}
// Sends a message to either the host or all connected peers.
const send = (message, type) => {
    // Define data to send
    const data = {
        message: message,
        peer: null,
        type: type
    };

    // If connected to host
    if (hostConnection) {
        //
        console.log('SSS' + JSON.stringify(data));
        // Send data
        hostConnection.send(data);
    }

    // host send
    if (!clientConnections.isEmpty()) {
        data.peer = peerId;
        broadcast(data);
        if(data.type != 'room-state-changed')
            updateMessageBoard(data.peer, data.message);
    }

    document.getElementById('message').innerText = '';
}
// Reconnects to the signalling server.
const reconnect = () => {
    console.log(`Reconnecting to signaller.`);
    if(signallerButton){
        signallerButton.disabled = true;
        signallerButton.innerText = `◌ SEARCHING FOR SIGNALLER...`;
    }
    peer.reconnect();
}
// Use the signaling server to connect to a host.
const join = () => {
    console.log("joinning")
    hostConnection = peer.connect(hostId);

    hostConnection.on('open', () => {
        console.log(
            `Connection to ${hostConnection.peer} established.`,
        );
        hostid = document.getElementById('hostId')
        if(hostid)
            hostid.innerText = `CONNECTED TO ${hostConnection.peer}.`;
    });

    hostConnection.on('data', (data) => {
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

// ---- HANDLERS ----
// onConnection sets up the handlers on open, close and data events and passes the nessecary data to the handlers.
const onConnection = (connection, handler) => {
    console.log("peer", connection);
    
    connection.on('open', (handler)=>{onOpenConnection(connection, handler)});

    connection.on('data', (data)=>{onDataReceived(data, connection)});

    connection.on('close', ()=>{onClose(connection)});
}
// onDataReceived handles the data
const onDataReceived = (data, connection) => {
    console.log('Recvied data:\n', data);
    console.log('Recived peer:\n', connection.peer);
    data.peer = connection.peer;
    handleData(data, connection);
    broadcast({
        ...data,
        ...connection.peer,
        peers: updatePeerList(),
    });
}
// onOpenConnection handles when a peer joins
const onOpenConnection = (connection, handler) => {
    console.log(
        `Connection to ${connection.peer} established.`,
    );

    clientConnections = clientConnections.set(
        connection.peer,
        connection,
    );

    const data = {
        type: 'user-joined',
        peer: connection.peer
    };

    updatePeerList();
    handleData(data, connection);
    broadcast({
        ...data,
        ...connection.peer,
        peers: updatePeerList(),
    });
    onRoomStateChanged();
    if (handler) {
        handler();
    }
}
// onCall is called when the host connection is establishing a new live stream.
const onCall = (call) => {
    console.log("call", call)
    call.answer();
    call.on('stream', (remoteStream) => {
        console.log("rstream". remoteStream)
        streamElement.srcObject = remoteStream
    });
}
// onDisconnect handles when the user is disconnected from the signaling server.
const onDisconnect = () => {
        console.log('Disconnected from signaller.');
        if(signallerButton){
            signallerButton.innerText = `✘ DISCONNECTED FROM SIGNALLER. RECONNECT?`;
            signallerButton.disabled = false;
        }
}
// onOpen handles when the user is connecting to the signalling server.
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
// onClose handles when teh user is disconnecting from the host.
const onClose = (connection) => {
    console.log(`Connection to ${connection.peer} is closed.`);
    clientConnections = clientConnections.delete(connection.peer.toString());

    const data = {
        type: 'user-left',
        peer: connection.peer
    };

    updatePeerList();
    handleData(data, connection);

    broadcast({
        ...data,
        peers: updatePeerList(),
    });
}
// onRoomStateChanged
const onRoomStateChanged = () => {
    var room = {
        room: {
            name: document.getElementById("class-name").innerHTML
        },
        type: 'room-state-changed',
        peer: peerId
    }
    broadcast(room)
}

// hostHandler handels when the host is starting a livestream.
const hostHandler = (connection) => {
    if (window.Stream) {
        broadcast_stream(window.Stream, connection.peer);
    }
}

// Handle received data
const handleData = (data) => {
    console.log("data:",data)
    if (!data){
        console.log("No data")
    } else if (data.type  == "message"){
        updateMessageBoard(data.peer, data.message);
    } else if (data.type == "user-joined") {
        updateMessageBoard("SYSTEM", `${data.peer} joined.`);
    } else if (data.type == "user-left") {
        updateMessageBoard("SYSTEM", `${data.peer} left.`);
    } else if (data.type == "room-state-changed" && data.peer == hostConnection.peer ) {
        updateRoom(data)
    }
}

// ---- Helper Functions -----

const hide = (element) => {
    element.classList.add('hidden');
}

const show = (element) => {
    element.classList.remove('hidden');
}

const clear = () => {
    document.getElementById('message').innerText = '';
}

const getParams = (url) => {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};