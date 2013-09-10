rocktimer
=========
**(c)[Bumblehead][0], 2013** [MIT-license](#license)

### OVERVIEW:

A timer. Some useful things:
  - easily start, stop, clear, reset and extend the timer.
  - add callbacks to the timer -called when the timer completes.
  - defines time using milliseconds and timestamps.
  - extensible.


[0]: http://www.bumblehead.com                            "bumblehead"

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
 ```

---------------------------------------------------------
#### <a id="usage">USAGE:

 1. Create a timer.

 ```javascript
 rocktimer = require('rocktimer');
 var rocktimerObj = rocktimer.getNew({
   hh : 0,
   mm : 0,
   ss : 1,
   ms : 100
 });
 ```

 2. Start the timer.

 ```javascript
 rocktimer.start(function () { console.log('finished'); });
 ```

 2. Stop the timer.

 ```javascript
 rocktimer.stop();
 ```

---------------------------------------------------------
#### <a id="methods">METHODS:



 - **rocktimer.getNew ( _timeOpts_ )**  
   returns a new and unstarted timer object. timeOpts should be an object with property-names corresponding to unicode time values.

   get a timer object with time set to 1 hour and 20 minutes:

   ```javascript
   var rocktimerObj = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });   
   ```

 - **rocktimer.prototype**
   prototype is not a method but a property defined on the `rocktimer` namespace. the prototype is used by `rocktimer` to construct its own timer object. prototype may be accessed to redefine its default properties. for example, you may want to redefine the `stop` method to enable callback calls when that method is called,

   start, stop, clear, reset, extent, isActive, getremainingms


 - **rocktimer.prototype.start ( _fn_ )**

   starts the timer. the first argument is an optional callback.

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start(function () {
       console.log('timer is completed after 1100 milliseconds');
   });
   ```

 - **rocktimer.prototype.stop ( )**

   stops the timer.

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start(function () {
       console.log('timer is completed after 1100 milliseconds');
   });
   
   timer.stop();
   ```

 - **rocktimer.prototype.clear ( )**

   stop the timer and reset values. if the timer was created for 5 minutes, the timer will have 5 minutes remaining when it is started again.

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start(function () {
       console.log('~2100 milliseconds have passed');
   });
   
   setTimeout(function () {
       timer.clear();
       timer.start();
   }, 1000)   
   ```

 - **rocktimer.prototype.reset ( )**

   convenience method that calls clear() followed by start(). useful if the timer is used for a browser session -each time a link is clicked, timer resets and session time is renewed.

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start(function () {
       console.log('~2100 milliseconds have passed');
   });
   
   setTimeout(function () {
       timer.reset();
   }, 1000)   
   ```

 - **rocktimer.prototype.extend ( )**

   add more time to the timer.

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start(function () {
       console.log('~2100 milliseconds have passed');
   });
   
   timer.extend({
       ms : 1000
   });
   ```

 - **rocktimer.prototype.isActive ( )**

   is the timer active?

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   });
   
   timer.start();
   console.log(timer.isActive); // true
   timer.stop();
   console.log(timer.isActive); // false
   ```

 - **rocktimer.prototype.getramainingms ( )**

   ```javascript
   var timer = rocktimer.getNew({
       hh : 0,
       mm : 0,
       ss : 1,
       ms : 100
   }).start();
   
   setTimeout(function () {
       console.log(timer.getremainingms()); // 600
   }, 500);
   ```



---------------------------------------------------------

#### <a id="license">License:

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
