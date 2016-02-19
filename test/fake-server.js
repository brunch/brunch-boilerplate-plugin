var ftpd = require('ftpd');

function createServer(options, callback) {
  var server = new ftpd.FtpServer(options, {
      getInitialCwd: function () { return '/'; },
      getRoot: function () { return process.cwd(); }
  });
  // server.debugging = 9;
  server.listen(options.port, callback);

  return server;
}

exports.create = createServer;
