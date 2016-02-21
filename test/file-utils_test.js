'use strict';
var fileUtils = require('../lib/file-utils');

describe('getFolders', function () {
    var getFolders = fileUtils.getFolders;

    it('should return an array with the folder if there is just one folder', function () {
        expect(getFolders('test')).to.have.members(['test']);
    });

    it('should return an array with 2 folders if there is a separator', function () {
        expect(getFolders('test/demo')).to.have.members(['test', 'test/demo']);
    });

    it('should return an array with 3 folders if there is two separators', function () {
        expect(getFolders('test/demo/tree')).to.have.members(['test', 'test/demo', 'test/demo/tree']);
    });
});


describe('addFolders', function () {
    var addFolders = fileUtils.addFolders;

    it('should not add nothing if there is no folders in the files', function () {
        var files = ['abc.txt', 'xyz.doc'];
        expect(addFolders(files)).to.have.members(files);
    });

    it('should add a folder if there a subfolder in the files', function () {
        var files = ['abc.txt', 'demo/xyz.doc'];
        expect(addFolders(files)).to.have.members(['demo', 'abc.txt', 'demo/xyz.doc']);
    });

    it('should add 3 folders if there three subfolder in the files', function () {
        var files = ['abc.txt', 'demo/xyz.doc', 'one/two/file.txt'];
        expect(addFolders(files)).to.have.members(['demo', 'one', 'one/two', 'abc.txt', 'demo/xyz.doc', 'one/two/file.txt']);
    });

    it('should include a folder just one time', function () {
        var files = ['demo/abc.txt', 'demo/xyz.doc'];
        expect(addFolders(files)).to.have.length(3);
    });
});
