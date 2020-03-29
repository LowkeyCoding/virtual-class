class VirtualClass extends Peer{
    constructor(peerType, signallerParams, userParams) {
        let peerId = userParams.peerId || randomDigits(6);
        super(peerId, signallerParams);
        this.clientConnections = Immutable.Map({});
        this.peerId = peerId;
        this.hostId = userParams.hostId || null;
        this.roomName = userParams.roomName || "stream"
        this.hostConnection;
        this.peerType = peerType;
        this.stream;
    }
    setupPeer () {
        this.on('open', (id)=>{this.onConnectToSignaller(id)});

        this.on('connection', (connection)=>{this.onConnection(connection)});

        this.on('call', (call)=>{this.onCall(call)});

        this.on('disconnected', ()=>{this.onDisconnectFromSignaller()});

        this.on('error', (error) => {
            console.log(error);
            window.Perror = error;
        });
    }
    
    setup() {
        this.setupHandlers();
        this.setupPeer();
    }
    // Setsup all the connection handlers
    setupHandlers () {
        this.onConnectToSignaller = (id) => {
            console.log('Connection to signaller establised.');
            console.log(`Assigning id: ${id}`);
            if (signallerButton) {
                signallerButton.innerText = `✔ CONNECTED TO SIGNALLER`;
                signallerButton.disabled = true;
                document.getElementById('selfId').innerText =
                    'YOUR ID IS ' + id;
            }
            this.updatePeerList();
        }
        // Handels if the host or peer is disconnected from the signaling server.
        this.onDisconnectFromSignaller = () => {
            console.log('Disconnected from signaller.');
            if(signallerButton){
                signallerButton.innerText = `✘ DISCONNECTED FROM SIGNALLER. RECONNECT?`;
                signallerButton.disabled = false;
            }
        }
        // Handels when a peer recives a call from the host.
        this.onCall = (call) => {
            call.answer();
            call.on('stream', (remoteStream) => {
                streamElement.srcObject = remoteStream
            });
        }
        // Handels when the host recives a connection.
        this.onConnection = (connection) => {
            if (this.peerType == 'host'){
                connection.on('open', ()=>{this.onPeerConnected(connection, hostHandler)});
            } else {
                connection.on('open', ()=>{this.onPeerConnected(connection, null)});
            }
    
            connection.on('data', (data)=>{this.onData(data, connection)});
        
            connection.on('close', ()=>{this.onPeerDisconnected(connection)});
        }
            // Handles when a peer connects to the host.
            this.onPeerConnected = (connection) => {
                console.log(
                    `Connection to ${connection.peer} established.`,
                );
            
                this.clientConnections = this.clientConnections.set(
                    connection.peer,
                    connection,
                );
            
                const data = {
                    type: 'user-joined',
                    peer: connection.peer
                };
            
                this.updatePeerList();
                this.handleData(data, connection);
                this.broadcast({
                    ...data,
                    ...connection.peer,
                    peers: this.updatePeerList(),
                });
                this.onRoomStateChanged();
                if (this.peerType == 'host') {
                    if (this.stream) {
                        this.broadcast_stream(this.stream, connection.peer);
                    }
                }
            }
            // Handels when a peer disconnects from the host.
            this.onPeerDisconnected = (connection) => {
                console.log(`Connection to ${connection.peer} is closed.`);
                this.clientConnections = this.clientConnections.delete(connection.peer.toString());
            
                const data = {
                    type: 'user-left',
                    peer: connection.peer
                };
            
                this.updatePeerList();
                this.handleData(data, connection);
            
                this.broadcast({
                    ...data,
                    peers: this.updatePeerList(),
                });
            }
            // Handels when the host receives data.
            this.onData = (data, connection) => {
                data.peer = connection.peer;
                this.handleData(data, connection);
                this.broadcast({
                    ...data,
                    ...connection.peer,
                    peers: this.updatePeerList(),
                });
            }
        // Handels when ever the peer or host gets a error.
        this.onError = (error) => {
            console.log(error);
        }
        // Helper handlers
            // Boardcasts a stream to either 1 or all connected peers depending on wether peerId is set.
            this.broadcast_stream = (peerID) => {
                if(peerID){
                    console.log(peerID);
                    this.call(peerID, this.stream);
                } else {
                    this.clientConnections.forEach((connection) => {
                        console.log(connection.peer);
                        this.call(connection.peer, this.stream)
                    });
                }
            }
            // Boardcasts data to all the connected peers.
            this.broadcast = (data) => {
                this.clientConnections.forEach((connection) =>
                    connection.send(data)
                );
            }
            // Handels the way data is visualized from both the peers and the host.
            this.handleData = (data) => {
                if (!data){
                } else if (data.type  == "message"){
                    updateMessageBoard(data.peer, data.message);
                } else if (data.type == "user-joined") {
                    updateMessageBoard("SYSTEM", `${data.peer} joined.`);
                } else if (data.type == "user-left") {
                    updateMessageBoard("SYSTEM", `${data.peer} left.`);
                } else if (data.type == "room-state-changed" && data.peer == this.hostConnection.peer ) {
                    updateRoom(data)
                }
            }
            this.onRoomStateChanged = () => {
                var room = {
                    room: {
                        name: document.getElementById("class-name").innerHTML
                    },
                    type: 'room-state-changed',
                    peer: this.peerId
                }
                this.broadcast(room)
            }
    }
    // Updates the list of peers in the room.
    updatePeerList () {
        return this.clientConnections
            .map((connection) => connection.peer)
            .toList()
            .push(`${this.peerId} (HOST)`)
            .join(', ');
    }
    // Use the signaling server to connect to a host.
    joinHost () {
        console.log("joinning")
        this.hostConnection = peer.connect(hostId);
    
        this.hostConnection.on('open', () => {
            console.log(
                `Connection to ${this.hostConnection.peer} established.`,
            );
            hostid = document.getElementById('hostId')
            if(hostid)
                hostid.innerText = `CONNECTED TO ${this.hostConnection.peer}.`;
        });
    
        this.hostConnection.on('data', (data) => {
            this.handleData(data, this.hostConnection);
            this.updatePeerList(data.peers);
        });
    
        this.hostConnection.on('close', () => {
            console.log(
                `Connection to ${this.hostConnection.peer} is closed.`,
            );
    
            peer.destroy();
    
            location.reload();
        });
    }
    // Sends a message to either the host or all connected peers.
    sendMessage(message) {
        // Define data to send
        const data = {
            message: message,
            peer: null,
            type: 'message'
        };
        // If connected to host
        if (this.hostConnection) {
            // Send data
            this.hostConnection.send(data);
        }
    
        // host send
        if (!this.clientConnections.isEmpty()) {
            data.peer = this.peerId;
            this.broadcast(data);
            if(data.type != 'room-state-changed')
                updateMessageBoard(data.peer, data.message);
        }
    
        document.getElementById('message').innerText = '';
    }
}

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
// Reconnects to the signalling server.
const reconnect = () => {
    console.log(`Reconnecting to signaller.`);
    if(signallerButton){
        signallerButton.disabled = true;
        signallerButton.innerText = `◌ SEARCHING FOR SIGNALLER...`;
    }
    peer.reconnect();
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