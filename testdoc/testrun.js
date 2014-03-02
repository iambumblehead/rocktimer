var scroungejs = require('scroungejs'),
    startutils = require('./startutil');

startutils.createFileIfNotExist({
  pathSrc : './testdoc/indexSrc.html',
  pathFin : './testdoc/index.html'
}, function (err, res) {
  if (err) return console.log(err);

  var scroungeTestOpts,
      scroungeMinOpts,
      scroungeUnminOpts;

  scroungeTestOpts = {
    inputPath : [
      './testdoc/testbuildSrc',
      './node_modules',
      './lib',
      './rocktimer.js'
    ],
    outputPath : './testdoc/testbuildFin', 
    isRecursive : true,
    isSourcePathUnique : true,
    isCompressed : true,
    isConcatenated : true,
    basepage : './testdoc/index.html'
  };

  scroungeMinOpts = Object.create(scroungeTestOpts);
  scroungeMinOpts.basepage = '';
  scroungeMinOpts.trees = ["rocktimer.full.js"];
  scroungeMinOpts.outputPath = './rocktimer.min.js';
  scroungeMinOpts.isCompressed = true;
  scroungeMinOpts.isConcatenated = true;
  scroungeMinOpts.isLines = false;

  scroungeUnminOpts = Object.create(scroungeTestOpts);
  scroungeUnminOpts.basepage = '';
  scroungeUnminOpts.trees = ["rocktimer.full.js"];
  scroungeUnminOpts.outputPath = './rocktimer.unmin.js';
  scroungeUnminOpts.isCompressed = false;
  scroungeUnminOpts.isConcatenated = true;

  
  scroungejs.build(scroungeTestOpts, function (err, res) {
    if (err) return console.log(err);

    // build a minified version
    scroungejs.build(scroungeMinOpts, function (err, res) {
      if (err) return console.log(err);

      // build a minified version
      scroungejs.build(scroungeUnminOpts, function (err, res) {
        if (err) return console.log(err);
        console.log('done');
      });
    });
  });

});
