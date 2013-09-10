// Filename: rocktimer.js
// Timestamp: 2013.09.09-18:28:50 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires:


var rocktimer = 
  ((typeof module === 'object') ? module : {}).exports = (function () {

  var timer = {
    bgnTime : null,
    endTime : null,
    timer : null,
    ms : 0,
    remainintms : 0,
    atCompleteFnArr : [],
    
    atCompleteFnArrInit : function (bgnDate, endDate) {
      var fnArr = this.atCompleteFnArr, x;

      for (x = fnArr.length; x--;) {
        fnArr[x](bgnDate, endDate);
      }
    },
    
    // {
    //   hh : 0, // hours
    //   mm : 0, // minutes
    //   ss : 0, // seconds
    //   ms : 0  // milliseconds
    // }
    getms : function (opts) {
      var ms = 0;
      if (typeof opts === 'object' && opts) {
        if (typeof opts.hh === 'number') ms += opts.hh * 60 * 60 * 1000;
        if (typeof opts.mm === 'number') ms += opts.mm * 60 * 1000;
        if (typeof opts.ss === 'number') ms += opts.ss * 1000;
        if (typeof opts.ms === 'number') ms += opts.ms;
      }
      return ms;
    },

    getFromDateNow : function (opts) {
      return this.getFromDate(opts, Date.now());
    },

    isActive : function () {
      return this.timer === null ? false : true;
    },

    // return the time remaining (milliseconds)
    getremainingms : function () {
      var that = this, endTime = this.endTime, r = 0;

      if (that.isActive()) {
        r = endTime.getTime() - Date.now();
      } else {
        r = +that.remainingms;
      }

      return r;
    },

    // starts the timer, adds the callback to an array of callbacks
    // called when the timer finishes
    //
    // opts = {
    //   hh : 0, // hours
    //   mm : 0, // minutes
    //   ss : 0, // seconds
    //   ms : 0  // milliseconds
    // }
    //
    // the timer must be fully reset or new time values will not be defined.
    start : function (fn) {
      var that = this,
          ms = that.remainingms || that.ms;

      if (!that.isActive()) {
        if (typeof fn === 'function') that.atCompleteFnArr.push(fn);

        if (that.bgnTime === null) that.bgnTime = new Date();
        if (that.endTime === null) that.endTime = new Date(that.bgnTime.getTime() + ms);

        that.timer = setTimeout(function () {
          that.clear();
          that.atCompleteFnArrInit(that.bgnTime, new Date());
        }, ms);
        
      }
      return that;
    },

    // stop the timer -preserve the time so that start may be called again to
    // complete the remaining time
    stop : function () {
      var that = this;

      if (that.isActive()) {
        that.remainingms = that.getremainingms();
        clearTimeout(that.timer);
        that.timer = null;
        that.endTime = null;
      }
      return that;
    },

    clear : function () {
      var that = this;
      clearTimeout(that.timer);
      that.timer = null;
      that.endTime = null;      
      that.bgnTime = null;
      that.remainingms = +that.ms;
      return that;
    },

    // starts the timer from a beginning time, even if currently active
    reset : function () {
      var that = this;
      that.clear();
      that.start();
      return that;
    },

    // remainingms and endtime are redefined to suit the new values given...
    extend : function (opts) {
      var that = this, 
          ms = that.getms(opts);

      that.endTime = new Date(that.endTime.getTime() + ms);
      that.remainingTime += ms;
      that.stop();
      that.start();
      return that;
    }
  };

  return {
    prototype : timer,
    getNew : function (opts) {
      var that = Object.create(timer);

      that.timer = null,
      that.atCompleteFnArr = [];
      that.ms = that.getms(opts) || 0;
      that.remainingms = +that.ms;
      that.bgnTime = null;
      that.endTime = null;

      return that;
    }
  };

}());

