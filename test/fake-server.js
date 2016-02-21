"use strict";

var ftpd = require('ftpd');
var fakeFs = require('./fake-fs');
var path = require('path');
var rmdir = require('./rmdir');


function defaultConnection(callback) {
  var self = this;
  self.on('client:connected', function(connection) {
      var username;
      connection.on('command:user', function(user, success, failure) {
          username = user;
          success();
      });
      connection.on('command:pass', function(pass, success, failure) {
          success(username);
      });
      connection.on('file:stor', function (type, uploadInfo) {
        if ((type === 'open') && (uploadInfo.file !== '/.timestamp')) {
            self.filesReceived.push(uploadInfo.file.replace(/^\//, ''));
        }
      });
      /*
      connection._old_emit = connection.emit;
      connection.emit = function () {
          console.log('Connection emitio evento', arguments[0]);
          connection._old_emit.apply(this, arguments);
      }
      */
      connection._real_MKD = connection._command_MKD;
      connection._command_MKD = function (pathRequest) {
        self.dirsReceived.push(pathRequest);
        return this._real_MKD(pathRequest);
      }

      if (callback) {
          callback(connection);
      }
  });
}

function closeAll() {
    this.openConnections.map(socket => socket.end());
    this.close();
}


function createServer(options, callback) {
  var basePath = path.join(process.cwd(), 'test', 'data', 'server');

  rmdir(basePath);

  var server = new ftpd.FtpServer(options.host, {
      getInitialCwd: function () { return '/'; },
      getRoot: function () { return basePath; },
      useWriteFile: true,
      useReadFile: true,
      pasvPortRangeStart: 60000,
      pasvPortRangeEnd: 60100
  });
  // server.debugging = 9;
  server.listen(options.port, () => { callback(); });
  server.defaultConnection = defaultConnection;
/*
  server._old_emit = server.emit;
  server.emit = function () {
      console.log('Server emitio evento', arguments[0]);
      server._old_emit.apply(this, arguments);
  }
  server._old_on = server.on;
  server.on = function () {
      console.log('se programo evento', arguments[0]);
      server._old_on.apply(this, arguments);
  }
  */

  server.filesReceived = [];
  server.dirsReceived = [];
  server.openConnections = [];
  server.on('client:connected', function(conn) {
      this.openConnections.push(conn.socket);
      conn.socket.on('end', () => server.emit('end'));
  });
  server.closeAll = closeAll;

  return server;
}


exports.create = createServer;
