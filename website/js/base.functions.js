// ---- Const -----
const messageBox = document.getElementById("messageBox");
const messageBoard = document.getElementById("messageBoard");
const roomName = document.getElementById("class-name");
const peerList = document.getElementById("peerList");
// ---- P2P system -----
class VirtualClass extends Peer {
    constructor(peerType, signallerParams, userParams) {
        let peerId = userParams.peerId || randomDigits(6);
        super(peerId, signallerParams);
        this.clientConnections = Immutable.Map({});
        this.peerId = peerId;
        this.username = sanitizeHTML(userParams.username) || "Anonymous User";
        this.iconUrl = sanitizeHTML(userParams.iconUrl) || "http://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        this.hostId = userParams.hostId || null;
        this.roomName = userParams.roomName || "Classroom"
        this.hostConnection;
        this.peerType = peerType;
        this.stream;
    }
    // Sets up the peer
    setupPeer() {
        this.on('open', (id) => { this.onConnectToSignaller(id) });

        this.on('connection', (connection) => { this.onConnection(connection) });

        this.on('call', (call) => { this.onCall(call) });

        this.on('disconnected', () => { this.onDisconnectFromSignaller() });

        this.on('error', (error) => {
            console.log(error);
            window.Perror = error;
            updateMessageBoard(this.hostId, "SYSTEM", error);
        });
    }
    // Sets up the peer and handlers
    setup() {
        this.setupHandlers();
        this.setupPeer();
    }
    // Setsup all the connection handlers
    setupHandlers() {
        this.onConnectToSignaller = (id) => {
            console.log('Connection to signaller establised.');
            console.log(`Assigning id: ${id}`);
            if (typeof roomIdButton !== 'undefined') {
                roomIdButton.disabled = false;
            }
            //document.getElementById('selfId').innerText = 'ID: "' + id + '"';
        }
        // Handels if the host or peer is disconnected from the signaling server.
        this.onDisconnectFromSignaller = () => {
            console.log('Disconnected from signaller.');
            if (signallerButton) {
                signallerButton.innerText = `✘ DISCONNECTED FROM SIGNALLER. RECONNECT?`;
                signallerButton.disabled = false;
                roomIdButton.disabled = true;
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
            connection.on('open', () => { this.onPeerConnected(connection) });

            connection.on('data', (data) => { this.onData(data, connection) });

            connection.on('disconnected', () => { this.onPeerDisconnected(connection); });

            connection.on('close', () => { this.onPeerDisconnected(connection) });
        }
        // Handles when a peer connects to the host.
        this.onPeerConnected = (connection) => {
            //console.log(`Connection to ${connection.peer} established.`);

            this.clientConnections = this.clientConnections.set(
                connection.peer,
                connection,
            );

            const data = {
                type: 'user-joined',
                username: connection.label,
                icon: connection.metadata,
                peer: this.peerId,
                id: connection.peer
            };
            // send host icon and username
            const hostData = {
                type: 'connected-user',
                username: this.username,
                icon: this.iconUrl,
                peer: this.peerId
            }
            connection.send(hostData);
            // Send connected users icons and usernames to peerlist
            this.clientConnections.forEach(connectedPeer => {
                let _data = {
                    type: 'connected-user',
                    username: connectedPeer.label,
                    icon: connectedPeer.metadata,
                    peer: this.peerId,
                    id: connectedPeer.id
                }
                if (connection.peer != connectedPeer.peer)
                    connection.send(_data);
            });

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
                id: connection.peer,
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
            updateMessageBoard(this.hostId, "SYSTEM", error);
        }
        // Helper handlers
        // Boardcasts a stream to either 1 or all connected peers depending on wether peerId is set.
        this.broadcast_stream = (peerID) => {
            console.log("peerid", peerID);
            if (peerID) {
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
            if (!data) { } else if (data.type == "message") {
                updateMessageBoard(data.peer, data.username, data.message);
            } else if (data.type == "user-joined") {
                updateMessageBoard(data.peer, "SYSTEM", `${data.username} joined.`);
                addPeer(data.id, data.username, data.icon)
            } else if (data.type == "user-left") {
                updateMessageBoard(data.peer, "SYSTEM", `${data.username} left.`);
                removePeer(data.id)
            } else if (data.type == "room-state-changed" && data.peer == this.hostConnection.peer) {
                roomName.innerHTML = data.room.name;
            } else if (data.type == "connected-user" && data.peer == this.hostConnection.peer) {
                addPeer(data.id, data.username, data.icon)
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
    updatePeerList() {
        return this.clientConnections
            .map((connection) => connection.peer)
            .toList()
            .push(`${this.peerId} (HOST)`)
            .join(', ');
    }
    // Use the signaling server to connect to a host.
    joinHost() {
        this.hostConnection = this.connect(this.hostId, { label: this.username, metadata: encodeURI(this.iconUrl) });

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
        if (this.peerType === "host") {
            data.peer = this.peerId;
            data.username = this.username;
            this.broadcast(data);
            if (data.type != 'room-state-changed')
                updateMessageBoard(data.peer, data.username, data.message);
        }

        messageBox.innerText = '';
    }
}

// ---- UI Updating Functions -----
// Add text to messageBoard Element.
const updateMessageBoard = (peerid, username, message) => {
    messageBoard.appendChild(messasgeTemplate(peerid, username, message));
    // Force scroll to bottom
    messageBoard.scrollBy(0, messageBoard.scrollHeight);
}
// Adds a peer to the peer list.
const addPeer = (peerId, username, iconUrl) => {
    peerList.appendChild(peerTemplate(peerId, username, iconUrl));
    if (typeof hostPeerList !== 'undefined' && config.enableHostPeerList) {
        hostPeerList.appendChild(hostPeerTemplate(peerId, username, iconUrl));
        hostPeerList.scrollBy(0, hostPeerList.scrollHeight);
    }
    if (typeof userCount !== 'undefined' && config.enableUserCount)
        userCount.innerText = parseInt(userCount.innerText) + 1;
}
// Removes a peer from the peer list.
const removePeer = (peerId) => {
    peerList.removeChild(document.getElementById(peerId));
    console.log("pid", document.getElementById(peerId));
    if (typeof hostPeerList !== 'undefined' && config.enableHostPeerList)
        hostPeerList.removeChild(hostPeerList.children[peerId]);
    if (typeof userCount !== 'undefined' && config.enableUserCount)
        userCount.innerText = parseInt(userCount.innerText) - 1;
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
    if (peerId == vclass.hostId) {
        usernameElement.style.color = "#DC143C"
    } else if (vclass.peerId == peerId ? vclass.peerType == "host" : false) {
        usernameElement.style.color = "#DC143C"
    }
    if (username == "SYSTEM") {
        if (peerId == vclass.hostId) {
            usernameElement.style.color = "#d4af37"
        } else if (!vclass.hostId) {
            usernameElement.style.color = "#d4af37"
        }
    }
    usernameElement.innerHTML = "[" + username + "]:";
    // Message Element
    messageElement = document.createElement("code")
    messageElement.className = "message"
    messageElement.innerHTML = "&nbsp;" + sanitizeHTML(message);
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
    iconElement = document.createElement("img");
    iconElement.className = "icon";
    iconElement.src = encodeURI(iconURL);
    // Container Element
    containerElement = document.createElement("div");
    containerElement.id = peerId;
    containerElement.title = username;
    containerElement.appendChild(iconElement);
    return containerElement;
}
// Template
const hostPeerTemplate = (peerId, username, iconURL) => {
    // icon Element
    iconElement = document.createElement("img");
    iconElement.className = "icon";
    iconElement.src = encodeURI(iconURL);
    // Username
    usernameElement = document.createElement("p")
    usernameElement.className = "username"
    usernameElement.innerHTML = username;
    // Container Element
    containerElement = document.createElement("div");
    containerElement.className = "hostPeerListItem"
    containerElement.id = peerId;
    containerElement.title = username;
    // Append elements to container
    containerElement.appendChild(iconElement);
    containerElement.appendChild(usernameElement);
    return containerElement;
}