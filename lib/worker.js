'use strict';

var timerID = null;
var interval = 100;

var log = console.log.bind(console, 'WORKER:')

module.exports = function(self) {

  self.onmessage = function(e) {
    if (e.data == 'start') {
      log('starting');
      timerID = setInterval(function() {
        self.postMessage('tick');
      }, interval);

    } else if (e.data.interval) {
      log('setting interval');
      interval = e.data.interval;
      log('interval = ' + interval);

      if (timerID) {
        clearInterval(timerID);
        timerID = setInterval(function() {
          self.postMessage('tick');
        }, interval);
      }
    } else if (e.data == 'stop') {
      log('stopping');
      clearInterval(timerID);
      timerID = null;
    }
  };

  self.postMessage('Worker Started...');
};
