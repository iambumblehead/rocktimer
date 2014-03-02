// Filename: rocktimerms.js
// Timestamp: 2014.03.02-11:47:04 (last modified)  
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

    ashh : function (ms) {
      return Math.floor(this.ms / 3600000);
    },
    asmm : function (ms) {
      return Math.floor(this.ms / 60000);    
    },
    asss : function (ms) {
      return Math.floor(this.ms / 1000);
    }
  };

  p = function (ms, mstotal) {
    var that = Object.create(proto);    

    that.ms = ms;
    that.mstotal = mstotal;

    that.remaining = Object.create(that);
    that.remaining.ms = mstotal - ms;

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
