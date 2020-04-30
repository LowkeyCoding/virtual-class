var config = {};
config.host = "peerjs.walsted.dev";
config.path = "/p2p";
config.port = 443;
config.secure = true;
config.debug = 0;
config.config =  {
    'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
    ] 
}