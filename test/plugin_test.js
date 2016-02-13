describe('Plugin', function() {
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

  it('should read the configuration from "ftpcopy" plugin section', function () {
    expect(plugin.config).to.be.equal(config.plugins.ftpcopy);
  });
});
