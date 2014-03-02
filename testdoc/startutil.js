var fs = require('fs'),
    ncp = require('ncp');

module.exports = {
  copyFile : function (source, target, cb) {
    var cbCalled = false,
        rd = fs.createReadStream(source),
        wr = fs.createWriteStream(target);

    rd.on("error", function(err) {
      done(err);
    });

    wr.on("error", function(err) {
      done(err);
    });

    wr.on("close", function(ex) {
      done();
    });

    rd.pipe(wr);

    function done(err) {
      if (!cbCalled) {
        cb(err);
        cbCalled = true;
      }
    }
  },

  createDirIfNotExist : function (opts, fn) {
    var srcPath = opts.pathSrc
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd()),
        finPath = opts.pathFin
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd()),
        that = this;

    fs.stat(finPath, function (err, stat) { 
      if (stat && stat.isDirectory()) return fn(null);
      console.log('[www] create directory: ' + finPath);
      ncp(srcPath, finPath, fn);
    });
  },

  createFileIfNotExist : function (opts, fn) {
    var srcPath = opts.pathSrc
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd()),
        finPath = opts.pathFin
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd()),
        that = this;

    fs.stat(finPath, function (err, stat) { 
      if (stat && stat.isFile()) return fn(null);
      console.log('[www] create file: ' + finPath);
      that.copyFile(srcPath, finPath, fn);
    });
  },

  createSymlinkIfNotExist : function (opts, fn) {
    var srcPath = opts.pathSrc
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd()),
        finPath = opts.pathFin
          .replace(/^~(?=\/)/, process.env.HOME)
          .replace(/^.(?=\/)/, process.cwd());

    fs.stat(finPath, function (err, stat) { 
      if (stat && (stat.isSymbolicLink() || stat.isDirectory())) return fn(null);
      console.log('[www] create file: ' + finPath);
      fs.symlink(srcPath, finPath, ['dir'], fn);
    });
  }  
};
