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

  it('should implement an onCompile function', function() {
    expect(plugin.onCompile).to.be.a('function');
  });

  it('should read the configuration from "ftpcopy" plugin section', function () {
    expect(plugin.config).to.be.equal(config.plugins.ftpcopy);
  });

});

describe('It uses ftp-client', function() {
  var plugin;
  var ftpClientStub;

  var config = {
      plugins: {
          ftpcopy : {
              server: { host: 'localhost' }
          }
      }
  };

  before(function () {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      ftpClientStub = sinon.stub();

      mockery.registerMock('ftp-client', ftpClientStub);

      Plugin = require('..');
  });

  after(function() {
      mockery.disable();
  });

  beforeEach(function() {
      plugin = new Plugin(config);
  });

  it('should create a ftp-client instance', function() {
      expect(ftpClientStub.called).to.be.true;
  });

  it('should initialize ftp-client using server configuration', function() {
      expect(ftpClientStub.calledWith(config.plugins.ftpcopy.server)).to.be.true;
  });

  it('should connect when onCompile is called', function () {
      ftpClientStub.connect = sinon.stub();

      plugin.onCompile();

      expect(ftpClientStub.connect.called).to.be.true;
  });

});
