// Filename: rocktimer.js
// Timestamp: 2015.12.20-01:14:44 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)

var rocktimerframes = require('./lib/rocktimerframes'),
    rocktimerms = require('./lib/rocktimerms'),
    eventhook = require('eventhook');

var rocktimer = module.exports = (function (p) {

  var timer = {
    timer : null,
    ms : 0,
    msextended : 0,

    getms : rocktimerms.getms,

    isActive : function () {
      return this.timer === null ? false : true;
    },

    getFrameObjCur : function () {
      return this.framesArr[this.frameindex];
    },

    onStop : function (fn) {
      this.onStopHook.addFn(fn);
      return this;
    },

    onClear : function (fn) {
      this.onClearHook.addFn(fn);
      return this;
    },

    onStart : function (fn) {
      this.onStartHook.addFn(fn);
      return this;
    },

    onExtend : function (fn) {
      this.onExtendHook.addFn(fn);
      return this;
    },

    callStop : function () {
      this.onStopHook.fire(this.getFrameObjCur().msObj);
    },

    callClear : function () {
      this.onClearHook.fire(this.getFrameObjCur().msObj);
    },

    callStart : function () {
      this.onStartHook.fire(this.getFrameObjCur().msObj);
    },

    callExtend : function () {
      this.onExtendHook.fire(this.getFrameObjCur().msObj);
    },

    // return the time remaining (milliseconds)
    getRemainingms : function () {
      var that = this,
          farr = that.framesArr,
          framesRemaining = farr.length - that.frameindex;

      return framesRemaining * farr.mspf;
    },

    // bind functions to time interval
    //
    // rock.forEach({ ms : 100 }, function (rt, ms) {
    //     // every 100 ms
    // });
    //
    // 'ms' value of interval is defined on each function,
    // allows queuing of functions for use with timer (buildFrames).
    //  * add ms to function,
    //  * push function to frame arr
    //  * preprocess array buildframes
    forEach : function (timeopts, fn) {
      var that = this,
          newindex,
          newframesArr,
          ms = that.getms(timeopts);

      if (typeof ms !== 'number') {
        throw new Error('invalid timeopts');
      } else if (typeof fn !== 'function') {
        throw new Error('invalid function');
      } else if (that.st === 1) {
        throw new Error('invalid forEach during animate');
      }
      
      fn.ms = ms;
      that.foreachArr.push(fn);

      // rebuild framesArr for each interval this method adds
      // handle frameindex so the timer may be rebuild as it
      // runs
      newframesArr = rocktimerframes.buildObjArr(that.foreachArr, that.msextended);

      if (that.frameindex) {
        newindex = that.framesArr[that.frameindex].msObj.ms;
        newindex = newframesArr.getmsIndexNum(newindex);
      }

      that.framesArr = newframesArr;
      that.frameindex = newindex || 0;        

      return that;
    },

    updateFrameState : function (frameindex, framesArr, st) {
      if (st === 1 && frameindex >= framesArr.length) {
        st = 4;
      }
      
      return st;
    },

    animate : function () {
      var my = this;

      (function nextFrame(f, framesArr) {
        framesArr = my.framesArr;
        my.st = my.updateFrameState(++my.frameindex, framesArr, my.st);

        switch (my.st) {
        case 1: // continue
          framesArr.callframe(my.frameindex);
          my.timer = setTimeout(nextFrame, framesArr.mspf);
          break;
        case 2: // sleep
          my.st = 1;
          break;
        case 3: // killed
          my.st = 3;
          my.clear();
          break;
        default: // completed
          my.st = 4;
          my.frameindex--;
          my.complete();
          break;
        }
      }());
    },

    clearInterval : function () {
      var that = this;
      if (that.timer) {
        clearInterval(that.timer);
        that.timer = null;
      }
    },

    reset : function () {
      var that = this;

      if (that.st === 1) {
        that.st = 2;
        that.clearInterval();
      }
      that.msextended = +that.ms;
      that.framesArr = rocktimerframes.buildObjArr(that.foreachArr, that.msextended);
      that.clear();

      return that;
    },

    // remainingms and endtime are redefined to suit the new values given...
    extend : function (opts) {
      var that = this,
          newms = that.msextended + that.getms(opts);

      that.framesArr = rocktimerframes.buildObjArr(that.foreachArr, newms);
      that.msextended = newms;

      that.callExtend();

      return that;
    },

    complete : function () {
      var that = this;
      
      if (that.st === 1) {
        that.st = 4;
        that.clearInterval();
      }

      that.callStop();
    },

    stop : function () {
      var that = this;

      if (that.st === 1) {
        that.st = 2;
        that.clearInterval();
        that.callStop();
      }
      return that;
    },

    clear : function () {
      var that = this;

      that.frameindex = 0;
      that.callClear();
      
      if (that.st !== 1) {
        that.st = 4;
        that.clearInterval();
      }
      return that;
    },

    start : function (fn) {
      var that = this,
          st = that.st;

      if (st === 4 || st === 2) {
        if (st === 4 && that.frameindex === 0) {
          that.bgnDate = new Date();
        }
        that.callStart();        
        that.st = 1;
        that.animate();
      }
      return that;
    },

    reinit : function () {
      var that = this;

      that.clear();
      that.st = 4;
      that.init();
      return that;
    }    

  };

  p = function (opts) {
    var that = Object.create(timer);

    that.onClearHook = eventhook();
    that.onStartHook = eventhook();
    that.onStopHook = eventhook();
    that.onExtendHook = eventhook();

    that.bgnDate = new Date();
    that.frameindex = 0;
    that.foreachArr = [];
    that.timer = null;
    that.ms = that.getms(opts) || 0;
    that.msextended = +that.ms;
    that.st = 4;

    that.framesArr = rocktimerframes.buildObjArr([], that.msextended);

    return that;
  };

  p.proto = timer;

  return p;

}());

