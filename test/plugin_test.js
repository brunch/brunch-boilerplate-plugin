'use strict';

var files = ['test/data/client/file1.txt', 'test/data/client/file2.txt', 'test/data/client/more/file3.txt'];
var brunchFiles = files.map(name => ({ path: name }) );
var plugin;

describe('It is a brunch plugin', function() {

  var config = {
      plugins: {
          ftpcopy : { hello: 'world' }
      }
  };

  beforeEach(function() {
    plugin = new Plugin(config);
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should be a brunch plugin', function() {
    expect(plugin.brunchPlugin).to.be.true;
  });

  it('should declare itself as an usual plugin', function() {
    expect(plugin.defaultEnv).to.be.equal('*');
  });

  it('should implement an onCompile function', function() {
    expect(plugin.onCompile).to.be.a('function');
  });

  it('should read the configuration from ftpcopy\'s plugin section', function () {
    expect(plugin.config).to.be.equal(config.plugins.ftpcopy);
  });

  it('should not fail if not server config is provided', function() {
      expect(function () {
          plugin = new Plugin({});
          plugin.onCompile(brunchFiles, []);
      }).to.not.throw(Error);
  });

});

describe('OnCompile', function() {
  var fakeServer = require('./fake-server');
  var server;

  const FTP_PORT = 60021;
  const FTP_HOST = '127.0.0.1';

  var config = {
      plugins: {
          ftpcopy : {
              host: FTP_HOST,
              port: FTP_PORT,
              user: 'ftpcopyuser',
              password: 'secretpassword',
              basePath: 'test/data/client'
          }
      }
  };

  var server_options = {
      host: FTP_HOST,
      port: FTP_PORT
  };

  beforeEach(function (done) {
      plugin = new Plugin(config);

      server = fakeServer.create(server_options, done);
  });

  afterEach(function (done) {
      server.on('close', done);
      server.closeAll();
  });


  it('should connect to the server', function(done) {
      server.on('client:connected', function () { done(); });
      plugin.onCompile(brunchFiles, []);
  });

  it('should authenticate with the user provided', function (done) {
      server.on('client:connected', function(connection) {
          connection.on('command:user', function(user, success, failure) {
              expect(user).to.be.equals(config.plugins.ftpcopy.user);
              success();
              done();
          });
      });
      plugin.onCompile(brunchFiles, []);
  });

  it('should authenticate with the password provided', function (done) {
      server.on('client:connected', function(connection) {
          connection.on('command:user', function(user, success, failure) {
              success();
          });
          connection.on('command:pass', function(pass, success, failure) {
              expect(pass).to.be.equals(config.plugins.ftpcopy.password);
              success();
              done();
          });
      });
      plugin.onCompile(brunchFiles, []);
  });

  it('should upload files changed', function (done) {
      server.defaultConnection();

      server.on('end', function () {
        expect(server.filesReceived).to.have.length(files.length);
        done();
      });
      plugin.onCompile(brunchFiles, []);
  });

  it('should use the base path provided', function (done) {
      server.defaultConnection();

      server.on('end', function () {
        expect(server.filesReceived).to.have.members(['file1.txt', 'file2.txt', 'more/file3.txt']);
        done();
      });
      plugin.onCompile(brunchFiles, []);
  });

  it('should create directories', function (done) {
      server.defaultConnection();

      server.on('end', function () {
        expect(server.dirsReceived).to.include('more');
        done();
      });
      plugin.onCompile(brunchFiles, []);
  });

  it('should apply the folder rules provided');


});
