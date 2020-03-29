// Variables
var username    = "";
var iconURL     = "";
var iconColor   = "";

// Change Color Variable to random color and update the Icon
function changeColor (){
    iconColor = (Math.random()*0xFFFFFF<<0).toString(16);
    updateIcon();
}
// Called when Icon Url is changed
function onIconUrlChange (){
    iconURL =  document.getElementById("iconurl").value;
    updateIcon();
    validateUsername();
}
//
function onUsernameChange(){
    if (validateUsername()){
        username = document.getElementById("username").value;
        document.getElementById("name").innerHTML = username;
        updateIcon();
        return;
    }
    document.getElementById("username").value = username;
}
// Changes the icon
function updateIcon(){
    // If user uses a custom icon
    if(iconURL.length == 0){
        var letter = "?";
        if(username.length > 0){letter = username[0].toUpperCase();}
        document.getElementsByName("icon").forEach((element)=>{
            element.src = "https://via.placeholder.com/128/" + iconColor +"/ffffff/?text=" + letter;
        })
    }else{
        document.getElementsByName("icon").forEach((element)=>{
            element.src = iconURL;
        })
    }
}

const validateUsername = () => {
    let _username = document.getElementById("username").value;
    if(_username.length > 3){
        if (_username.length < 32){
            document.getElementById("errorText").innerHTML = "";
            return true;
        }
        document.getElementById("errorText").innerHTML = "Username must be at less than 32 characters long.";
        return false;
    }
    document.getElementById("errorText").innerHTML = "Username must be at least 3 characters long.";
    return false;
}

function ToggleContainer(){
    if(validateUsername()) {
        document.getElementById("setup-user").style.display = "none";
        document.getElementById("setup-room").style.display = "flex";
    }
}

function joinRoom() {
    location.href = '/client/client.html?peerId=' + username + "&hostId=" + document.getElementById("roomID").value; 
}

function createRoom() {
    location.href = '/host/host.html?peerId=' + username; 
}
const getRandomName = async () => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://cors.walsted.dev/http://names.drycodes.com/1?separator=space&format=text");
    let username;
    request.onload = async () => {
        document.getElementById("username").value = await request.response;
    };

    request.send();
    return await username;
}
const importSteamUser = async (steamid) => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://cors.walsted.dev/https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=6FE88E34E12FA3462B9866F27A488AB9&steamids=" + steamid);
    let username;
    request.onload = async () => {
        player = await JSON.parse(request.response).response.players[0];
        username = player.personaname;
        document.getElementById("name").innerHTML = username;
        document.getElementById("username").value = username;
        iconURL = player.avatarfull;
        updateIcon();
    };
    request.send();
}

// Sets the username
getRandomName();
changeColor();
(setup = () => {
    username = document.getElementById("username").value;
    document.getElementById("name").innerHTML = username;
    // Joins the selected host if the peer has been created
    if (username != "") {
        updateIcon();
        return;
    }
    setTimeout(setup, 50);
})()
