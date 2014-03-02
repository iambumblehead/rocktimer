// Filename: rocktimer-test.js
// Timestamp: 2014.03.02-14:48:25 (last modified)  
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
    var that = this;

    return rocktimer({
      hh : 0,
      mm : 5,
      ss : 2,
      ms : 100
    }).forEach({ mm : 1 }, function (rt, ms) {
      that.setLabelMin(ms.asmm());
    }).forEach({ ss : 1 }, function (rt, ms) {
      that.setLabelSec(ms.asss());
    }).forEach({ ms : 100 }, function (rt, ms) {
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelMs(ms);
    }).onStart(function (rt, ms) {
      that.setLabelMin(ms.asmm());
      that.setLabelSec(ms.asss());
      that.setLabelMs(ms);
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Start.');
    }).onStop(function (rt, ms) {
      console.log('stop');
      that.setLabelStatus('Stop, time remaining (ms): ' + ms.remaining);
    }).onExtend(function (rt, ms) {
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Extended, time remaining (ms): ' + ms.mstotal);
    }).onClear(function (rt, ms) {
      that.setLabelMin(ms.asmm());
      that.setLabelSec(ms.asss());
      that.setLabelMs(ms);
      that.setLabelCountdown(ms.remaining.asss());
      that.setLabelStatus('Clear.');
    });
  },

  stop : function (rock) {
    rock.stop();
  },

  clear : function (rock) {
    rock.clear();
  },

  start : function (rock) {
    rock.start();
  },

  init : function () {
    var that = this,
        rock = that.getTimer(),
        startElem = document.getElementById('Start'),
        stopElem = document.getElementById('Stop'),
        clearElem = document.getElementById('Clear'),
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

    extendElem.onclick = function (e) {
      e.preventDefault();
      rock.extend({ ss : 10 });
    };
  }
};

