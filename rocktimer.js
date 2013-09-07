// Filename: rocktimer.js
// Timestamp: 2013.09.06-18:41:46 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires:


var rocktimer = 
  ((typeof module === 'object') ? module : {}).exports = (function () {

  var timer = {
    bgnTime : null,
    endTime : null,
    interval : null,
    atCompleteFnArr : [],
    
    atCompleteFnArrInit : function (bgnDate, endDate) {
      var fnArr = this.atCompleteFnArr, x;

      for (x = fnArr.length; x--;) {
        fnArr[x](bgnDate, endDate);
      }
    },

    checkTimer : function () {
      var that = this, 
          endTime = this.endTime;

      if (Date.now() > endTime.getTime()) {
        clearInterval(that.interval);
        that.atCompleteFnArrInit(endTime, new Date());
        this.endTime = null;
      }
    },

    extendTime : function (opts) {
      var that = this;

      that.endTime = that.getFromDate(opts);
    },
    
    // {
    //   hh : 0, // hours
    //   mm : 0, // minutes
    //   ss : 0, // seconds
    //   ms : 0  // milliseconds
    // }
    getms : function (opts, date) {
      var ms = 0;
      if (typeof opts.hh === 'number') time += opts.hh * 60 * 60 * 1000;
      if (typeof opts.mm === 'number') time += opts.mm * 60 * 1000;
      if (typeof opts.ss === 'number') time += opts.ss * 1000;
      if (typeof opts.ms === 'number') time += opts.ms;
      return ms;
    },

    getFromDateNow : function (opts) {
      return this.getFromDate(opts, Date.now());
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
    begin : function (opts, fn) {
      var that = this;

      that.bgnTime = new Date();
      that.endTime = that.getFromDate(opts);

      if (typeof fn === 'function') {
        that.atCompleteFnArr.push(fn);
      }

      that.timer = window.setInterval
      
      that.interval = window.setInterval(function () { that.checkTimer(); }, 1000);

      return that;
    }
  };

  return {
    prototype : timer,
    getNew : function () {
      var that = Object.create(timer);
      that.atCompleteFnArr = [];
      that.bgnTime = null;
      that.endTime = null;
      that.interval = null;
      return that;
    }
  };

}());

