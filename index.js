exports.Handler = require('./lib/handler');
exports.createHandler = function(rootPath) {
    return new exports.Handler(rootPath);
};