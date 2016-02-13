describe('It is a brunch plugin', function() {
  var plugin;

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

});

describe('OnCompile', function() {
  var files = ['file1', 'file2'];
  var brunchFiles = files.map(name => ({ path: name }) );

  var server = require('ftp-server');
  const FTP_PORT = 60021;

  var config = {
      plugins: {
          ftpcopy : {
              server: {
                  host: 'localhost',
                  port: FTP_PORT,
                  user: 'ftpcopyuser'
              }
          }
      }
  };

  before(function (done) {
      console.log('***', server);
      server.listen(FTP_PORT, done);

  });

  after(function () {
      server.close();
  });

  beforeEach(function () {
      plugin = new Plugin(config);
  });

  it('should connect to the server', function(done) {
      var callback = function() {
          server.removeListener('connection', callback);
          done();
      }
      server.on('connection', callback);
      plugin.onCompile(brunchFiles);
  });

  it('should authenticate with the user provided', function (done) {
    var oldUSER = server.commands.USER;
    server.commands.USER = function (username) {
        expect(username).to.be.equal(config.plugins.ftpcopy.server.user);
        server.commands.USER = oldUSER;
        done();
    }

  });

});
