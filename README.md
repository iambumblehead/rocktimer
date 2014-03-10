rocktimer
=========
**(c)[Bumblehead][0], 2013** [MIT-license](#license)

### OVERVIEW:

`rocktimer` is for implementing things such as, **countdowns**, **stopwatches**, and **session expirations**. Reliably _start_, _stop_, _clear_, _reset_ and _extend_ the timer. Add functions called during those events and during time intervals you define.

`rocktimer` uses unicode formatted time descriptors.

A demo timer/countdown application is included in the tests. To build the test document, Use `npm start`:

 ![screenshot][1]

 * **Easy (constructor used by demo app)**: 
   ```
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 5,
       ms : 0
   }).forEach({ mm : 1 }, function (ms) {
       that.setLabelMin(ms.asmm());
   }).forEach({ ss : 1 }, function (ms) {
       that.setLabelSec(ms.asss());
   }).forEach({ ms : 100 }, function (ms) {
       that.setLabelCountdown(ms.remaining.asms());
       that.setLabelMs(ms.asms());
   }).onStart(function (ms) {
       that.setLabelMin(ms.asmm());
       that.setLabelSec(ms.asss());
       that.setLabelMs(ms.asms());
       that.setLabelCountdown(ms.remaining.asss());
       that.setLabelStatus('Start.');
   }).onStop(function (ms) {
       that.setLabelStatus('Stop, time remaining (ms): ' + ms.remaining.asms());
   }).onExtend(function (ms) {
       that.setLabelCountdown(ms.remaining.asss());
       that.setLabelStatus('Extended, time remaining (ms): ' + ms.mstotal);
   }).onClear(function (ms) {
       that.setLabelMin(ms.asmm());
       that.setLabelSec(ms.asss());
       that.setLabelMs(ms.asms());
       that.setLabelCountdown(ms.remaining.asss());
       that.setLabelStatus('Clear.');
   });   
   ```
   
 * **Accurate _Enough_?**:
 
   Accuracy of a scripted timer is limited by the host environment. `rocktimer` does not adjust itself for scenarious that reduce accuracy. When preprocessing is handled on 'start', actual start time is less accurate. When multiple functions are bound to a time interval, they are called in sequence allowing small time differences. Rocktimer is accurate enough only.


`rocktimer` **does not** use a popular library like jQuery. Its minified size is ~4.8kb. All methods are public and may be redefined as needed.

**The `forEach` method and event hooks are what make `rocktimer` really useful.**

```javascript
rocktimer({
    hh : 0,
    mm : 0,
    ss : 1,
    ms : 100
}).forEach({ mm : 1 }, function (ms) {
   // every 1 minute
}).forEach({ mm : 2 }, function (ms) {
   // every 2 minues
}).forEach({ ss : 1 }, function (ms) {
   // every 1 second
}).forEach({ hh : 100 }, function (ms) {       
   // every 100 hours
}).onStart(function (ms) {
   // timer is started
}).onStop(function (ms) {   
   // timer is stopped
}).onExtend(function (ms) {
   // timer is extended
}).onClear(function (ms) {   
   // timer is cleared
}).start();
```
 
Unlimited time intervals and event hooks may be added. Overlapping intervals are handled with rock stability. A brevity of syntax needed means less overhead for managing part of your application that using rocktimer.



[0]: http://www.bumblehead.com                            "bumblehead"
[1]: https://github.com/iambumblehead/rocktimer/raw/master/img/screenshot-timer.png

---------------------------------------------------------
#### <a id="install"></a>INSTALL:

rocktimer may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install rocktimer
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/rocktimer.git
 $ cd rocktimer && npm install
 ```
 
This repository contains two ready-to-use files, [rocktimer.min.js][23] and [rocktimer.unmin.js][24].

Run npm start to build a sample rocktimer page. 

[23]: http://github.com/iambumblehead/rocktimer/raw/master/rocktimer.min.js
[24]: http://github.com/iambumblehead/rocktimer/raw/master/rocktimer.unmin.js


---------------------------------------------------------
#### <a id="test"></a>Test:

 to run tests, use `npm test` from a shell.

 ```bash
 $ npm test
 ```

---------------------------------------------------------
#### <a id="usage">USAGE:

Create a timer. Start it. Stop it.

 ```javascript
 rocktimer({
     hh : 0,
     mm : 0,
     ss : 1,
     ms : 100
 }).start().stop();
 ```
 
`rocktimer` uses only the shortest time interval needed to support any callbacks given. Creates a time interval of 1 hour:
 ```javascript
 rocktimer({
     hh : 1
 }).forEach({hh : 1}, function (ms) {
     console.log(ms);
 });
 ```
 
Creates a time interval of 200 milliseconds:
 ```javascript
 rocktimer({
     hh : 1
 }).forEach({ms : 200}, function (ms) {
     console.log(ms.asms());
 });
 ``` 
 
Longer time intervals are more accurate. You may modify the time intervals dynamically. Update a 10 minute timer to use a 1 second interval during the final minute:

 ```
 var rock = rocktimer({
     mm : 3
 }).onStart(function (ms) {
     that.setLabelSec(ms.remaining.asss());
     that.setLabelMin(ms.remaining.asmm());
 }).onClear(function (ms) {
     that.setLabelSec(ms.remaining.asss());
     that.setLabelMin(ms.remaining.asmm());
 }).forEach({ ss : 1 }, function (ms) {
     that.setLabelMin(ms.remaining.asmm());
     that.setLabelSec(ms.remaining.asss());
 }).forEach({ mm : 1 }, function (ms) {
     that.setLabelMin(ms.remaining.asmm());
     if (ms.remaining.asmm() == 2) {      
         rock.stop().forEach({ ms : 100 }, function (ms) {
            if (ms.remaining.asms() <= 60000) {
                that.setLabelMs(ms.remaining.asms());
            }
         }).start();
     }
 }); 
 ```
 
Each callback added to the timer gets an 'ms' objects as the first parameter. The object holds data describing the time at which the callback is expected:

 ```javascript
 var rock = rocktimer({
     mm : 3
 }).onStart(function (ms) {
     ms.ashh();           // 0
     ms.asmm();           // 0
     ms.asss();           // 0
     ms.asms();           // 0
     ms.remaining.ashh(); // 0
     ms.remaining.asmm(); // 3
     ms.remaining.asss(); // 180
     ms.remaining.asms(); // 180000
 }).start()
 ```


---------------------------------------------------------
#### <a id="methods">METHODS:


 - **rocktimer ( _timeOpts_ )**  
   returns a timer object. timeOpts should be an object with property-names corresponding to unicode time values.

   ```javascript
   rocktimer({
       hh : 1,  // 1 hour
       mm : 0,  // 0 minutes
       ss : 1,  // 1 second
       ms : 100 // 100 milliseconds
   });   
   ```

 - **rocktimer.prototype**
   prototype is not a method but a property defined on the `rocktimer` namespace. the prototype is used by `rocktimer` to construct its own timer object. prototype may be accessed to redefine its default properties. Methods on the prototype include `start`, `stop`, `clear`, `reset`, `extend`, `isActive`, `getremainingms`.


 - **rocktimer.prototype.start ( )**

   starts the timer.

   ```javascript
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).onStart(function () {
       console.log('timer will complete after 1100 milliseconds');   
   }).start();
   ```

 - **rocktimer.prototype.stop ( )**

   stops the timer.

   ```javascript
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).onStop(function () {
       console.log('timer is stopped');   
   }).start().stop();
   ```

 - **rocktimer.prototype.reset ( )**

   Reset values. If timer was created for 5 minutes, timer will have 5 minutes remaining after reset(), no matter what its extended time may have been. Reset also stops and clears the timer.

   ```javascript
   var rock = rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).onStop(function () {
       console.log('~2100 milliseconds have passed');
   }).start();
   
   setTimeout(function () {
       rock.reset();
   }, 1000)   
   ```

 - **rocktimer.prototype.clear ( )**

   Clears the timer to begins at 0. Extended times added to the timer remain on the timer.

   ```javascript
   var rock = rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).onStop(function () {
       console.log('~2100 milliseconds have passed');
   }).start();
   
   setTimeout(function () {
       rock.clear();
   }, 1000)   
   ```

 - **rocktimer.prototype.extend ( )**

   add more time to the timer.

   ```javascript
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).onStop(function () {
       console.log('~2100 milliseconds have passed');
   }).start().extend({
       ms : 1000
   });
   ```

 - **rocktimer.prototype.isActive ( )**

   is the timer active?

   ```javascript
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).start().isActive()   // true
       .stop().isActive(); // false
   ```

   
 - **rocktimer.prototype.forEach ( )** _and event hooks_   
 
   The `forEach` method and event hooks are what make `rocktimer` really useful.

   ```javascript
   rocktimer({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).forEach({ mm : 1 }, function (ms) {
      // every 1 minute
   }).forEach({ mm : 2 }, function (ms) {
      // every 2 minues
   }).forEach({ ss : 1 }, function (ms) {
      // every 1 second
   }).forEach({ hh : 100 }, function (ms) {       
      // every 100 hours
   }).onStart(function (ms) {
      // timer is started
   }).onStop(function (ms) {   
      // timer is stopped
   }).onExtend(function (ms) {
      // timer is extended
   }).onClear(function (ms) {   
      // timer is cleared
   }).start();
   ```
 
   Unlimited time intervals and event hooks may be added. Overlapping intervals are handled with rock stability. A brevity of syntax needed means less overhead for managing part of your application that using rocktimer.


---------------------------------------------------------
#### <a id="license">License:

 ![scrounge](http://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
