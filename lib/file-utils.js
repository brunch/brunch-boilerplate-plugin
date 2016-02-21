'use strict';

var path = require('path');

// It receives a full path folder and return the list of folders in the path
var getFolders = exports.getFolders = function (folder) {
    let list = [];
    let folders = folder.split(path.sep);
    let current = '';

    for(let part of folders) {
        current = path.join(current, part);
        list.push(current);
    }
    return list;
}

// Receives an array of files and it prepends the list
// of folders in those files
exports.addFolders = function addFolders(files) {
    var folders = []

    for(let f of files) {
        let folder = path.dirname(f);
        if (folder !== '.') {
            folders = folders.concat(getFolders(folder));
        }
    }

    return folders.concat(files);
}

