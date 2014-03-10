var rocktimer = require('../rocktimer'),
    compareobj = require('compareobj');

function isNear(numa, numb, errorval) {
  return Math.abs(numa - numb) < errorval;
}

describe("rocktimer.getNew", function () {

  it("should return an object with top-level properties atCompleteFnArr, bgnTime, endTime and timer", function () {
    var rocktimerObj = rocktimer();

    // compare obj not yet ready to compare properties defined as array
    expect(
      compareobj.isSameMembersDefinedObj({    
        timer : null
      }, rocktimerObj)
    ).toBe( true );
  });

});

describe("rocktimerObj.getms", function () {

  it("should return 5430100 for { hh: 1, mm: 30, ss: 30, ms: 100 }", function () {
    var rocktimerObj = rocktimer(), ms;    

    ms = rocktimerObj.getms({
      hh : 1,
      mm : 30,
      ss : 30,
      ms : 100
    }); // 5430100 ms

    // Fri Apr 05 2013 21:23:41 GMT-0700 (PDT)
    // var date1 = new Date(1365222221485);
    // Fri Apr 05 2013 22:54:11 GMT-0700 (PDT)
    // var date2 = new Date(1365222221485 + 5430100);

    expect( ms ).toBe( 5430100 );
  });

});


describe("rocktimerObj.start", function () {

  it("should start a timer that is reasonably accurate", function (done) {

    var rt = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function (ms) {
      expect(isNear(Date.now() - rt.bgnDate.getTime(), 1100, 40)).toBe(true);
      done();
    }).start();
  });




  it("should start a timer that has been stopped", function (done) {
    var x = 0;
    
    var rocktimerObj = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStart(function () {
      x++;
    }).start().stop().start();

    setTimeout(function () {
       expect( x ).toBe( 2 );
       done();
    }, 2200);
    
  });

  it("should start a timer that has been stopped and timer should not end prematurely", function (done) {
    var x = 0;

    var rocktimerObj = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function () {
      x++;
    }).start().stop();

    setTimeout(function () {
      rocktimerObj.start();
    }, 1200);

    setTimeout(function () {
       expect( x ).toBe( 1 );
       done();
    }, 1000);
    
  });

});

describe("rocktimerObj.clear", function () {
  it("should clear index timer properties", function (done) {


    var rt = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onClear(function (ms) {
    
      expect(rt.frameindex).toBe(0);
      done();

    }).stop();    

    rt.clear().stop();

  });
});


describe("rocktimerObj.reset", function () {

  it("should reset a timer, callback should not be called before timer end", function (done) {
    var x = 0;
    var rocktimerObj = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function () {
      x++;
    }).start();

    setTimeout(function () {
      rocktimerObj.clear();
    }, 500);

    setTimeout(function () {
       expect( x ).toBe( 0 );
       rocktimerObj.stop();
       done();
    }, 1100);
    
  });


  it("should reset a timer, callback should be called at timer end", function (done) {
    var x = 0;
    var rocktimerObj = rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function () {
       x++;
    }).start().stop();

    setTimeout(function () {
      rocktimerObj.clear();
    }, 700);

    setTimeout(function () {
       expect( x ).toBe( 2 );
       done();
    }, 2300);
    
  });
});


describe("rocktimerObj.extend", function () {
  it("should extend the time on the timer, callback should not be called before timer end", function (done) {
    var x = 0;

    rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function () {
      x++;
    }).extend({
      ss : 1
    }).start();

    setTimeout(function () {
       expect( x ).toBe( 0 );
       done();
    }, 1500);    
  });

  it("should extend the time on the timer, callback should not be called after timer end", function (done) {
    var x = 0;

    rocktimer({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }).onStop(function () {
      x++;
    }).extend({
      ss : 1
    }).start();

    setTimeout(function () {
       expect( x ).toBe( 1 );
       done();
    }, 2400);    
  });

});


describe("rocktimerObj", function () {
  it("with a time of 9mm, should start at 0mm", function (done) {

    var rt = rocktimer({
      mm : 9
    }).onStart(function (ms) {
      expect(ms.asmm() === 0).toBe( true );
      done();
      rt.stop();
    });

    rt.start();

  });

  it("with a time of 9mm, should start with time remaining 9mm", function (done) {
    var rt = rocktimer({
      mm : 9
    }).onStart(function (ms) {
      expect(ms.remaining.asmm() === 9).toBe( true );
      done();
      rt.stop();
    });

    rt.start();
  });

});

