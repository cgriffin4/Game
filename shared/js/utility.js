onerror = function (msg) {
    log(msg);
}

function log(msg) {
    document.getElementById('log').appendChild(document.createTextNode(new Date() + ' ' + msg + '\n'));
}

function status(msg) {
    log(msg);
    document.getElementById('status').textContent = msg;
}