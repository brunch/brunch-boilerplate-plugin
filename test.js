const expect = require('chai').expect;
const Plugin = require('./');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin({});
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });
});