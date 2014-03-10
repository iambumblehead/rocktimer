// Filename: rocktimerframes.js
// Timestamp: 2014.03.09-16:53:36 (last modified)  
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

var rocktimerms = require('./rocktimerms'),
    mlcm = require('mlcm');

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
          fn(msObj); 
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
    framesArr.getmsIndexNum = function (ms) {
      for (var x = this.length; x--;) {
        if (this[x].msObj.ms === ms) return x;
      }
    };

    return framesArr;
  }
};
