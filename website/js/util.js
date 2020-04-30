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