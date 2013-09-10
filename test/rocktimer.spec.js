var rocktimer = require('../rocktimer'),
    compareobj = require('compareobj');


describe("rocktimer.getNew", function () {

  it("should return an object with top-level properties atCompleteFnArr, bgnTime, endTime and timer", function () {
    var rocktimerObj = rocktimer.getNew();

    // compare obj not yet ready to compare properties defined as array
    expect(
      compareobj.isSameMembersDefinedObj({    
        bgnTime : null,
        endTime : null,
        timer : null
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
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;    

    rocktimerObj.start(function () {
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
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), bgnTime, endTime;    

    bgnTime = new Date(Date.now() + 1090);

    rocktimerObj.start(function () {
      var now = Date.now();

      expect( 
        (bgnTime.getTime() < now) &&
        (endTime.getTime() > now)
      ).toBe( true );
      done();
    });

    endTime = new Date(Date.now() + 1110);
      
  });

  it("should start a timer that has been stopped", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), bgnTime, endTime, x = 0;

    rocktimerObj.start(function () {
      x++;
    }); 
    
    rocktimerObj.stop();

    setTimeout(function () {
      rocktimerObj.start();
    }, 1000);

    setTimeout(function () {
       expect( x ).toBe( 1 );
       done();
    }, 2200);
    
  });

  it("should start a timer that has been stopped and timer should not end prematurely", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), bgnTime, endTime, x = 0;

    rocktimerObj.start(function () {
      x++;
    }); 
    
    rocktimerObj.stop();

    setTimeout(function () {
      rocktimerObj.start();
    }, 1000);

    setTimeout(function () {
       expect( x ).toBe( 0 );
       done();
    }, 1000);
    
  });

});


describe("rocktimerObj.stop", function () {
  it("should set the timeout property to null", function () {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;    

    rocktimerObj.start(); 
    rocktimerObj.stop(); 

    expect( rocktimerObj.timer ).toBe( null );    
  });

  it("should prevent any callbacks from being called", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;    

    rocktimerObj.start(function () {
      x++;
    }); 

    rocktimerObj.stop(); 

    setTimeout(function () {
      expect( x ).toBe( 0 );          
      done();
    }, 1200);
  });

});

describe("rocktimerObj.clear", function () {
  it("should clear all timer properties", function () {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    });    

    rocktimerObj.start(); 
    rocktimerObj.clear();

    expect(
      compareobj.isSameMembersDefinedObj({    
        bgnTime : null,
        endTime : null,
        timer : null,
        remainingms : 0
      }, rocktimerObj)
    ).toBe( true );

  });
});


describe("rocktimerObj.reset", function () {
  it("should reset a timer, callback should not be called before timer end", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;

    rocktimerObj.start(function () {
      x++;
    }); 

    rocktimerObj.stop();

    setTimeout(function () {
      rocktimerObj.reset();
    }, 1000);

    setTimeout(function () {
       expect( x ).toBe( 0 );
       done();
    }, 2000);
    
  });


  it("should reset a timer, callback should be called at timer end", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;

    rocktimerObj.start(function () {
      x++;
    }); 

    rocktimerObj.stop();

    setTimeout(function () {
      rocktimerObj.reset();
    }, 1000);


    setTimeout(function () {
       expect( x ).toBe( 1 );
       done();
    }, 2300);
    
  });

});

describe("rocktimerObj.extend", function () {
  it("should extend the time on the timer, callback should not be called before timer end", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;


    rocktimerObj.start(function () {
      x++;
    }); 

    rocktimerObj.extend({
      ms : 1000
    });

    setTimeout(function () {
       expect( x ).toBe( 0 );
       done();
    }, 2000);    
  });


  it("should extend the time on the timer, callback should not be called after timer end", function (done) {
    var rocktimerObj = rocktimer.getNew({
      hh : 0,
      mm : 0,
      ss : 1,
      ms : 100
    }), x = 0;


    rocktimerObj.start(function () {
      x++;
    }); 

    rocktimerObj.extend({
      ms : 1000
    });

    setTimeout(function () {
       expect( x ).toBe( 1 );
       done();
    }, 2400);    
  });

});
