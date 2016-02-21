
var path = require('path');
var fs = require('fs');

function rmDir(directory, removeSelf) {
  var files;
  try {
      files = fs.readdirSync(directory); 
  } catch(e) {
      return;
  }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = path.join(directory, files[i]);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(filePath, true);
      }
    }
  }
  if (removeSelf) {
    fs.rmdirSync(directory);
  }
}

module.exports = function (path) {
    rmDir(path, false);
}
