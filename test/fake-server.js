"use strict";

var ftpd = require('ftpd');

class FakeFs {

}

function defaultConnection() {
  this.on('client:connected', function(connection) {
      var username;
      connection.on('command:user', function(user, success, failure) {
          username = user;
          success();
      });
      connection.on('command:pass', function(pass, success, failure) {
          success(username);
      });
  });
}

function createServer(options, callback) {
  var server = new ftpd.FtpServer(options, {
      getInitialCwd: function () { return '/'; },
      getRoot: function () { return process.cwd(); }
  });
  // server.debugging = 9;
  server.listen(options.port, callback);
  server.defaultConnection = defaultConnection;

  return server;
}


exports.create = createServer;
