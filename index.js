'use strict';

var ftpClient = require('ftp-client');

// Documentation for Brunch plugins:
// https://github.com/brunch/brunch/blob/master/docs/plugins.md

// Remove everything your plugin doesn't need.
class BrunchPlugin {
  constructor(config) {
    // Replace 'plugin' with your plugin's name;
    this.config = config && config.plugins && config.plugins.ftpcopy;
    this.ftpClient = new ftpClient(this.config.server);
  }

  // file: File => Promise[Boolean]
  // Called before every compilation. Stops it when the error is returned.
  // Examples: ESLint, JSHint, CSSCheck.
  // lint(file) { return Promise.resolve(true); }

  // file: File => Promise[File]
  // Transforms a file data to different data. Could change the source map etc.
  // Examples: JSX, CoffeeScript, Handlebars, SASS.
  // compile(file) { return Promise.resolve(file); }

  // file: File => Promise[Array: Path]
  // Allows Brunch to calculate dependants of the file and re-compile them too.
  // Examples: SASS '@import's, Jade 'include'-s.
  // getDependencies(file) { return Promise.resolve(['dep.js']); }

  // file: File => Promise[File]
  // Usually called to minify or optimize the end-result.
  // Examples: UglifyJS, CSSMin.
  // optimize(file) { return Promise.resolve({data: minify(file.data)}); }

  // files: [File] => null
  // Executed when each compilation is finished.
  // Examples: Hot-reload (send a websocket push).
  onCompile(files) {
      ftpClient.connect();

  }

  // Allows to stop web-servers & other long-running entities.
  // Executed before Brunch process is closed.
  // teardown() {}
}

// Required for all Brunch plugins.
BrunchPlugin.prototype.brunchPlugin = true;

// Required for compilers, linters & optimizers.
// 'javascript', 'stylesheet' or 'template'
// BrunchPlugin.prototype.type = 'javascript';

// Required for compilers & linters.
// It would filter-out the list of files to operate on.
// BrunchPlugin.prototype.extension = 'js';
// BrunchPlugin.prototype.pattern = /\.js$/;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// BrunchPlugin.prototype.defaultEnv = 'production';

module.exports = BrunchPlugin;
