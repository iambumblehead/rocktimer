var rocktimer = require('../rocktimer'),
    compareobj = require('compareobj');


describe("rocktimer.getNew", function () {

  it("should return an object with top-level properties atCompleteFnArr, bgnTime, endTime and interval", function () {
    var rocktimerObj = rocktimer.getNew();

    // compare obj not yet ready to compare properties defined as array
    expect(
      compareobj.isSameMembersDefinedObj({    
        bgnTime : null,
        endTime : null,
        interval : null
      }, rocktimerObj)
    ).toBe( true );
  });

});


describe("rocktimerObj.atCompleteFnArrInit", function () {

  it("should call callback functions when called", function () {
    var rocktimerObj = rocktimer.getNew(), x = 0;

    rocktimerObj.atCompleteFnArr.push(function () {
      x++;
    });

    rocktimerObj.atCompleteFnArr.push(function () {
      x++;
    });

    rocktimerObj.atCompleteFnArrInit();

    expect( x ).toBe( 2 );
  });

});


describe("rocktimerObj.getms", function () {

  it("should return 5430100 for { hh: 1, mm: 30, ss: 30, ms: 100 }", function () {
    var rocktimerObj = rocktimer.getNew(), ms;    

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

  it("should start a timer (time values defined and callback called)", function (done) {
    var rocktimerObj = rocktimer.getNew(), x = 0;    

    rocktimerObj.start({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }, function () {
      x++;
    });

    if (rocktimerObj.ms === 1100) {
       if (rocktimerObj.endTime.getTime() -
           rocktimerObj.bgnTime.getTime() === 1100) {
         x++;
       }
    }

    setTimeout(function () {
      expect( x ).toBe( 2 );
      done();
    }, 1200);

  });

  it("should start a timer that completes ~at the specified time", function (done) {
    var rocktimerObj = rocktimer.getNew(), bgnTime, endTime;    

    bgnTime = new Date(Date.now() + 1100);

    rocktimerObj.start({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }, function () {
      var now = Date.now();

      console.log(bgnTime.getTime(), now, endTime.getTime());
      expect( 
        (bgnTime.getTime() < now) &&
        (endTime.getTime() > now)
      ).toBe( true );
      done();
    });

    endTime = new Date(Date.now() + 1100);
      
  });

});

