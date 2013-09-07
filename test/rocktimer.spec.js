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

