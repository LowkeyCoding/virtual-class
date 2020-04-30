// Variables
var username = "";
var iconURL = "";
var iconColor = "";

// Change Color Variable to random color and update the Icon
function changeColor() {
    iconColor = (Math.random() * 0xFFFFFF << 0).toString(16);
    updateIcon();
}
// Called when Icon Url is changed
function onIconUrlChange() {
    iconURL = document.getElementById("iconurl").value;
    updateIcon();
    validateUsername();
}
//
function onUsernameChange() {
    if (validateUsername()) {
        username = getUsername();
        document.getElementById("name").innerHTML = username;
        updateIcon();
        return;
    }
    document.getElementById("username").value = username;
}
// Changes the icon
function updateIcon() {
    console.log("update", username)
        // If user uses a custom icon
    if (document.getElementById("iconurl").value == "") {
        var letter = "?";
        console.log("ul", username.length)
        if (getFirstname().length > 0) {
            letter = getFirstname()[0].toUpperCase();
            if (getLastname().length > 0)
                letter += getLastname()[0].toUpperCase();
        }
        document.getElementsByName("icon").forEach((element) => {
            element.src = "https://via.placeholder.com/128/" + iconColor + "/ffffff/?text=" + letter;
            iconURL = element.src;
        })
    } else {
        document.getElementsByName("icon").forEach((element) => {
            element.src = iconURL;
        })
    }
}

// validates the username
const validateUsername = () => {
    let _username = getUsername();
    // checks if the username is greater than 2 characters long.
    if (_username.length > 2) {
        // checks if the username is less than 64 characters long.
        if (_username.length < 64) {
            document.getElementById("errorText").innerHTML = "";
            return true;
        }
        // sets error message
        document.getElementById("errorText").innerHTML = "Username must be at less than 32 characters long.";
        return false;
    }
    // sets error message
    document.getElementById("errorText").innerHTML = "Username must be at least 3 characters long.";
    return false;
}

// ToggleContainers the containers needed for the classroom mode.
function ToggleContainer() {
    if (validateUsername()) {
        document.getElementById("setup-user").style.display = "none";
        document.getElementById("setup-room").style.display = "flex";
        document.getElementById("useroverlay").style.display = "flex";
        document.getElementById("roomName").value = username + "'s classroom";
    }
}

// joins a given room
const joinRoom = async() => {
    location.href = '/pages/client.html?peerId=' + await getPeerId() + "&hostId=" + document.getElementById("roomID").value + "&username=" + username + "&iconUrl=" + encodeURIComponent(iconURL);
}

// creates a room with a given name
const createRoom = async() => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://peerjs.walsted.dev/p2p/peerjs/id");
    request.onload = async() => {
        location.href = '/pages/host.html?peerId=' + await getPeerId() + "&roomName=" + document.getElementById("roomName").value + "&username=" + username + "&iconUrl=" + encodeURIComponent(iconURL);
    };
    request.send();
}

// gets a random username for the user.
const getRandomName = async() => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://cors.walsted.dev/http://names.drycodes.com/1?separator=space&format=text");
    let username;
    request.onload = async() => {
        document.getElementById("username").value = await request.response;
    };

    request.send();
    return await username;
}

// imports a steam username and profile picture based on the given steam id.
const importSteamUser = async(steamid) => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://cors.walsted.dev/https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=6FE88E34E12FA3462B9866F27A488AB9&steamids=" + steamid);
    let username;
    request.onload = async() => {
        player = await JSON.parse(request.response).response.players[0];
        username = player.personaname;
        document.getElementById("name").innerHTML = username;
        document.getElementById("username").value = username;
        iconURL = player.avatarfull;
        updateIcon();
    };
    request.send();
}
const getPeerId = async() => {
    res = await fetch('https://peerjs.walsted.dev/p2p/peerjs/id');
    return await res.text();
}

const getUsername = () => {
    return getFirstname() + " " + getLastname();
}
const getFirstname = () => {
    return document.getElementById("Firstname").value;
}
const getLastname = () => {
        return document.getElementById("Lastname").value;
    }
    // Sets the username
    //getRandomName();
    (setup = () => {
        changeColor();
        username = getUsername();
        document.getElementById("name").innerHTML = username;
        // Joins the selected host if the peer has been created
        if (username != "") {
            console.log(username);
            updateIcon();
            return;
        }
        setTimeout(setup, 50);
    })()