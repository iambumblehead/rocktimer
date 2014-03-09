// Filename: rocktimer.full.js  
// Timestamp: 2014/03/01 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

// Filename: incrnum.js  
// Timestamp: 2013.10.22-11:32:49 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var incrnum = ((typeof module === 'object') ? module : {}).exports = (function (uid, fn) {
  
  fn = function () { return uid++; };
  fn.toString = function () { return uid++; };

  return fn;

}(0));
// Filename: eventhook.js
// Timestamp: 2013.10.30-10:51:34 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: incrnum.js



var eventhook = ((typeof module === 'object') ? module : {}).exports = (function () {

  var proto = {
    fnArr: [],

    addFn: function (fn) {
      if (typeof fn === 'function') {
        fn.oname = 'fn' + incrnum;
        this.fnArr.push(fn);
      }
    },

    rmFn: function (fn) {
      var oname = fn.oname;

      if (typeof fn === 'function') {
        this.fnArr = this.fnArr.filter(function (fn) {
          return fn.oname !== oname;
        });
      }
    },

    fire: function (a1,a2,a3,a4) {
      this.fnArr.map(function (fn) {
        fn(a1,a2,a3,a4);
      });
    }
  };

  return {
    proto : proto,
    getNew : function () {
      var that = Object.create(proto);
      that.fnArr = [];
      return that;
    }
  };

}());
// Filename: rocktimerms.js
// Timestamp: 2014.03.09-11:50:21 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// returned object holds stateful time information
//

var rocktimerms = ((typeof module === 'object') ? module : {}).exports = (function (p) {

  var proto = {
    ms : 0,
    mstotal : 0,
    remaining : null,
  
    toString : function () {
      return this.ms;
    },

    round : Math.floor,

    ashh : function () {
      return this.round(this.ms / 3600000);
    },
    asmm : function () {
      return this.round(this.ms / 60000);    
    },
    asss : function () {
      return this.round(this.ms / 1000);
    },
    asms : function () {
      return this.ms;
    }
  };

  p = function (ms, mstotal) {
    var that = Object.create(proto);    

    that.ms = ms;
    that.mstotal = mstotal;

    that.remaining = Object.create(that);
    that.remaining.ms = mstotal - ms;
    that.remaining.round = Math.ceil;

    return that;
  };

  p.proto = proto;

  // where opts is,
  // {
  //   hh : 0, // hours
  //   mm : 0, // minutes
  //   ss : 0, // seconds
  //   ms : 0  // milliseconds
  // }
  p.getms = function (opts) {
    var ms = 0;
    if (typeof opts === 'object' && opts) {
      if (typeof opts.hh === 'number') ms += opts.hh * 3600000;
      if (typeof opts.mm === 'number') ms += opts.mm * 60000;
      if (typeof opts.ss === 'number') ms += opts.ss * 1000;
      if (typeof opts.ms === 'number') ms += opts.ms;
    }
    return ms;
  };

  return p;

}());
// Filename: mlcm.js
// Timestamp: 2014.02.15-10:22:09 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires:


var mlcm = ((typeof module === 'object') ? module : {}).exports = (function (p) {

  function gcd (numbers) {
    return numbers.reduce(function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    });
  }

  function lcm (numbers) {
    return numbers.reduce(function(a, b) {
      return Math.abs(a * b) / gcd([a, b]);
    });
  }

  p = lcm;
  p.lcm = lcm;
  p.gcd = gcd;

  return p;

}());
// Filename: rocktimerframes.js
// Timestamp: 2014.03.02-13:21:30 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: mlcm.js
//
// returns an array of 'frames' augmented with convenience methods.
//
// functions called during the timer process are ordered into frames.
// each frame represents a time interval and includes a function to call at 
// a the frame-represented time OR if no functions are bound the time, the 
// element is undefined.
// 
// frames are constructed before added to timer- add preprocessing steps here.
//
// frame array is augmented with these properties:
//   framesArr.mspf      // milliseconds perframe
//   framesArr.framesnum // total number of frames
//   framesArr.callframe // method calls a frame, if defined 




var rocktimerframes = ((typeof module === 'object') ? module : {}).exports = {
  getPossibleFramesGCD : function (framefnArr, totalms) {
    var gcd = +totalms;
  
    if (framefnArr.length) {
      gcd = mlcm.gcd(framefnArr.map(function (framefn) {
        return framefn.ms;
      }));
    }
    
    return gcd;
  },

  buildObj : function (framefnArr, framems, totalms) {
    var that = this, 
        frame = {},
        msObj = rocktimerms(framems, totalms),
        fnArr = framefnArr.filter(function (framefn) {
          return framems === 0 ||
            (framems % framefn.ms === 0 && 
             framems >= framefn.ms);
        });

    if (fnArr.length) {
      frame = function () {
        fnArr.map(function (fn) { 
          fn(that, msObj); 
        });
      };
    }

    frame.msObj = msObj;

    return frame;
  },

  buildObjArr : function (framefnArr, totalms) {
    var that = this,
        gcd = that.getPossibleFramesGCD(framefnArr, totalms),
        frames = Math.ceil(totalms / gcd),
        framenum = -1,
        framesArr = [];

    while (++framenum <= frames) {
      framesArr.push(that.buildObj(framefnArr, gcd * framenum, totalms));
    }

    framesArr.ms = totalms;
    framesArr.mspf = gcd;
    framesArr.framesnum = frames;
    framesArr.callframe = function (index, f) {
      return typeof (f = this[index]) === 'function' && f();
    };
    framesArr.getframemsObj = function (index, f) {
      return ((f = this[index])) && f.msObj;
    };

    return framesArr;
  }
};
// Filename: rocktimer.js
// Timestamp: 2014.03.02-14:29:21 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: rocktimerframes.js, rocktimerms.js, eventhook.js





var rocktimer = 
  ((typeof module === 'object') ? module : {}).exports = (function (p) {

  var timer = {
    timer : null,
    ms : 0,

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
      this.onStopHook.fire(this, this.getFrameObjCur().msObj);
    },

    callClear : function () {
      this.onClearHook.fire(this, this.getFrameObjCur().msObj);
    },

    callStart : function () {
      this.onStartHook.fire(this, this.getFrameObjCur().msObj);
    },

    callExtend : function () {
      this.onExtendHook.fire(this, this.getFrameObjCur().msObj);
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
          ms = that.getms(timeopts);

      if (typeof ms !== 'number') {
        throw new Error('invalid timeopts');
      } else if (typeof fn !== 'function') {
        throw new Error('invalid function');
      }
      
      fn.ms = ms;
      that.foreachArr.push(fn);

      // rebuild framesArr for each interval this method adds
      that.framesArr = rocktimerframes.buildObjArr(that.foreachArr, that.ms);

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
      that.clear();
      that.start();
      return that;
    },

    // remainingms and endtime are redefined to suit the new values given...
    extend : function (opts) {
      var that = this,
          newms = that.ms + that.getms(opts);

      that.framesArr = rocktimerframes.buildObjArr(that.foreachArr, newms);
      that.ms = newms;

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
        if (st === 4) {
          that.bgnDate = new Date();
          that.frameindex = 0;
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

    that.onClearHook = eventhook.getNew();
    that.onStartHook = eventhook.getNew();
    that.onStopHook = eventhook.getNew();
    that.onExtendHook = eventhook.getNew();

    that.bgnDate = new Date();
    that.frameindex = 0;
    that.foreachArr = [];
    that.timer = null;
    that.ms = that.getms(opts) || 0;
    that.st = 4;

    that.framesArr = rocktimerframes.buildObjArr([], that.ms);

    return that;
  };

  p.proto = timer;

  return p;

}());

// Filename: rocktimer.full.js  
// Timestamp: 2014.03.01-11:00:19 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
// Requires: rocktimer.js
//
// placeholder file for directing scroungejs build
