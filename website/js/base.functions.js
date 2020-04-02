// ---- Const -----
const messageBox = document.getElementById("messageBox");
const messageBoard = document.getElementById("messageBoard");
const roomName = document.getElementById("class-name");
const peerList = document.getElementById("peerList");
// ---- P2P system -----
class VirtualClass extends Peer{
    constructor(peerType, signallerParams, userParams) {
        let peerId = userParams.peerId || randomDigits(6);
        super(peerId, signallerParams);
        this.clientConnections = Immutable.Map({});
        this.peerId = peerId;
        this.username = userParams.username || "Anonymous User";
        this.iconUrl = userParams.iconUrl || "http://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        this.hostId = userParams.hostId || null;
        this.roomName = userParams.roomName || "Classroom"
        this.hostConnection;
        this.peerType = peerType;
        this.stream;
    }
    // Sets up the peer
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
    // Sets up the peer and handlers
    setup() {
        this.setupHandlers();
        this.setupPeer();
    }
    // Setsup all the connection handlers
    setupHandlers () {
        this.onConnectToSignaller = (id) => {
            console.log('Connection to signaller establised.');
            console.log(`Assigning id: ${id}`);
            document.getElementById('selfId').innerText = 'ID: "' + id + '"';
            //this.updatePeerList();
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

            connection.on('open', ()=>{this.onPeerConnected(connection)});
    
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
                    username: connection.label,
                    icon: connection.metadata,
                    peer: this.peerId
                };
                // Send connected users icons and usernames to peerlist
                this.clientConnections.forEach(peer => {
                    const data = {
                        type: 'connected-user',
                        username: peer.label,
                        icon: peer.metadata,
                        peer: peer.peer
                    }
                    connection.send(data)
                })
                // send host icon and username
                const hostData = {
                    type: 'connected-user',
                    username: this.username,
                    icon: this.iconUrl,
                    peer: this.peerId
                }
                connection.send(hostData)
                
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
                        this.broadcast_stream(connection.peer);
                    }
                }
            }
            // Handels when a peer disconnects from the host.
            this.onPeerDisconnected = (connection) => {
                console.log(`Connection to ${connection.peer} is closed.`);
                this.clientConnections = this.clientConnections.delete(connection.peer.toString());
            
                const data = {
                    type: 'user-left',
                    peer: this.peerId,
                    username: connection.label
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
                data.username = connection.label;
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
                console.log("peerid", peerID);
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
                    updateMessageBoard(data.peer, data.username, data.message);
                } else if (data.type == "user-joined") {
                    updateMessageBoard(data.peer, "SYSTEM", `${data.username} joined.`);
                    addPeer(data.peer, data.username, data.icon)
                } else if (data.type == "user-left") {
                    updateMessageBoard(data.peer, "SYSTEM", `${data.username} left.`);
                    removePeer(data.peer)
                } else if (data.type == "room-state-changed" && data.peer == this.hostConnection.peer ) {
                    updateRoom(data)
                } else if (data.type == "connected-user" && data.peer == this.hostConnection.peer ) {
                    addPeer(data.peer, data.username, data.icon)
                }
            }
            this.onRoomStateChanged = () => {
                var room = {
                    room: {
                        name: roomName.innerHTML
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
        this.hostConnection = this.connect(this.hostId, {label: this.username, metadata: encodeURI(this.iconUrl)});
    
        this.hostConnection.on('open', () => {
            console.log(
                `Connection to ${this.hostConnection.peer} established.`,
            );
        });
    
        this.hostConnection.on('data', (data) => {
            this.handleData(data, this.hostConnection);
            this.updatePeerList(data.peers);
        });
    
        this.hostConnection.on('close', () => {
            console.log(
                `Connection to ${this.hostConnection.peer} is closed.`,
            );
    
            this.destroy();
    
            location.reload();
        });
    }
    // Sends a message to either the host or all connected peers.
    sendMessage(message) {
        // Define data to send
        const data = {
            message: message,
            peer: null,
            username: null,
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
            data.username = this.username;
            this.broadcast(data);
            if(data.type != 'room-state-changed')
                updateMessageBoard(data.peer, data.username, data.message);
        }
    
        messageBox.innerText = '';
    }
}

// Add text to messageBoard Element.
const updateMessageBoard = (peerid, username, message) => {
    messageBoard.appendChild(messasgeTemplate(peerid, username, message));
}
// Adds a peer to the peer list.
const addPeer = (peerId, username, iconUrl) => {
    peerList.appendChild(peerTemplate(peerId, username, iconUrl))
}
// Removes a peer from the peer list.
const removePeer = (peerId) => {
    peerList.removeChild(document.getElementById(peerId));
}

// Update room name.
const updateRoom = (data) => {
    roomName.innerHTML = data.room.name;
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

const getPeerId = async () => {
    res = await fetch('https://peerjs.walsted.dev/p2p/peerjs/id');
    return await res.text();
}
const getRandomName = async () => {
    res = await fetch("https://cors.walsted.dev/http://names.drycodes.com/1?separator=space&format=text");
    return await res.text();
}
// ---- Event Listeners -----

messageBox.addEventListener("keyup", (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // DO STUFF
        vclass.sendMessage(document.getElementById("messageBox").value);
        document.getElementById("messageBox").value = "";
    }
  });

// ---- Templates -----
// Template for generating messages.
const messasgeTemplate = (peerId, username, message) => {
    // Username Element
    usernameElement = document.createElement("p")
    usernameElement.className = "username"
    if (username == "SYSTEM") {
        if (peerId == vclass.hostId) {
            usernameElement.style.color = "#d4af37"
        } else if (!vclass.hostId) {
            usernameElement.style.color = "#d4af37"
        }
    }
    usernameElement.innerHTML = "[" +username+"]:";
    // Message Element
    messageElement = document.createElement("p")
    messageElement.className = "message"
    messageElement.innerHTML = message;
    // Container Element
    containerElement = document.createElement("div")
    containerElement.className = "messageContainer";
    containerElement.appendChild(usernameElement);
    containerElement.appendChild(messageElement);
    return containerElement;
}
// Template for generating new peers in the peers list.
const peerTemplate = (peerId, username, iconURL) => {
    // icon Element
    iconElement = document.createElement("img")
    iconElement.className = "icon"
    iconElement.src = encodeURI(iconURL);
    // Container Element
    containerElement = document.createElement("div")
    containerElement.id = peerId;
    containerElement.title = username;
    containerElement.appendChild(iconElement);
    return containerElement;
}