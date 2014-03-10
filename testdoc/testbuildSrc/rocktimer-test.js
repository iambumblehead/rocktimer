// Filename: rocktimer-test.js
// Timestamp: 2014.03.09-17:08:14 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: rocktimer.js

var rocktimer = require('rocktimer');

var rocktimerTest = {

  setLabelMin : function (val) {
    var label = document.getElementById('LabelA');

    if (label) {
      label.innerHTML = val;
    }
  },

  setLabelSec : function (val) {
    var label = document.getElementById('LabelB');

    if (label) {
      label.innerHTML = val;
    }
  },

  setLabelMs : function (val) {
    var label = document.getElementById('LabelC');
    
    if (label) {
      label.innerHTML = val;
    }
  },

  setLabelCountdown : function (val) {
    var label = document.getElementById('LabelD');

    if (label) {
      label.innerHTML = val;
    }
  },

  setLabelStatus : function (val) {
    var label = document.getElementById('LabelStatus');
    
    if (label) {
      label.innerHTML = val;
    }
  },

  getTimer : function () {
    var that = this, rock;

    /*
    return rocktimer({
      mm : 3
    }).onStart(function (ms) {
      console.log(ms.ashh());
      console.log(ms.asmm());
      console.log(ms.asss());
      console.log(ms.asms());     
      console.log(ms.remaining.ashh());
      console.log(ms.remaining.asmm());
      console.log(ms.remaining.asss());     
      console.log(ms.remaining.asms());          
    }).start();
     */

    /*
    return rock = rocktimer({
      mm : 3
    }).onStart(function (ms) {
      that.setLabelSec(ms.remaining.asss());
      that.setLabelMin(ms.remaining.asmm());
    }).onClear(function (ms) {
      that.setLabelSec(ms.remaining.asss());
      that.setLabelMin(ms.remaining.asmm());
    }).forEach({ ss : 1 }, function (ms) {
      that.setLabelMin(ms.remaining.asmm());
      that.setLabelSec(ms.remaining.asss());
    }).forEach({ mm : 1 }, function (ms) {
      that.setLabelMin(ms.remaining.asmm());
      if (ms.remaining.asmm() == 2) {      
        rock.stop().forEach({ ms : 100 }, function (ms) {
          if (ms.remaining.asms() <= 60000) {
            that.setLabelMs(ms.remaining.asms());
          }
        }).start();
      }
    });
     */

    return rocktimer({
      hh : 0,
      mm : 0,
      ss : 5,
      ms : 0
    }).forEach({ mm : 1 }, function (ms) {
      that.setLabelMin(ms.asmm());
    }).forEach({ ss : 1 }, function (ms) {
      that.setLabelSec(ms.asss());
    }).forEach({ ms : 100 }, function (ms) {
      that.setLabelCountdown(ms.remaining.asms());
      that.setLabelMs(ms.asms());
    }).onStart(function (ms) {
      that.setLabelMin(ms.asmm());
      that.setLabelSec(ms.asss());
      that.setLabelMs(ms.asms());
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Start.');
    }).onStop(function (ms) {
      that.setLabelStatus('Stop, time remaining (ms): ' + ms.remaining.asms());
    }).onExtend(function (ms) {
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Extended, time remaining (ms): ' + ms.mstotal);
    }).onClear(function (ms) {
      that.setLabelMin(ms.asmm());
      that.setLabelSec(ms.asss());
      that.setLabelMs(ms.asms());
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Clear.');
    });
  },

  init : function () {
    var that = this,
        rock = that.getTimer(),
        startElem = document.getElementById('Start'),
        stopElem = document.getElementById('Stop'),
        clearElem = document.getElementById('Clear'),
        resetElem = document.getElementById('Reset'),
        extendElem = document.getElementById('Extend');

    startElem.onclick = function (e) {
      e.preventDefault();
      rock.start();
    };

    stopElem.onclick = function (e) {
      e.preventDefault();
      rock.stop();
    };

    clearElem.onclick = function (e) {
      e.preventDefault();
      rock.clear();
    };

    resetElem.onclick = function (e) {
      e.preventDefault();
      rock.reset();
    };

    extendElem.onclick = function (e) {
      e.preventDefault();
      rock.extend({ ss : 10 });
    };
  }
};

