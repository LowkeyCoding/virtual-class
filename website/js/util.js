((root) => {
    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {
            s = '0' + s;
        }
        return s;
    };

    root.randomDigits = (length) => {
        return Math.floor(100000 + Math.random() * 900000).pad(6);
    };
})(this);
// ---- XSS protection -----
// no more breaking shit M..XD
var sanitizeHTML = (str) => {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

// Get parameters from URL
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