/* globals AudioContext */
'use strict';

var work = require('webworkify');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

class Metronome extends EventEmitter {
  constructor(opts) {
    super();

    _.assign(this, {
      tempo: 96.0, // tempo (in beats per minute)
      lookahead: 25.0, // How frequently to call scheduling function (in milliseconds)
      scheduleAheadTime: 0.1 // How far ahead to schedule audio (sec)
    }, opts);

    this.playing = false;
    this.audioContext = new AudioContext();

    this.current16thNote = 0; // What note is currently last scheduled?

    // This is calculated from lookahead, and overlaps
    // with next interval (in case the timer is late)
    this.nextNoteTime = 0.0; // when the next note is due.
    this.noteResolution = 2; // 0 == 16th, 1 == 8th, 2 == quarter note
    this.noteLength = 0.05; // length of 'beep' (in seconds)

    // the notes that have been put into the web audio,
    // and may or may not have played yet. {note, time}
    // USED FOR UI var notesInQueue = [];

    this.on('tick', this.schedule.bind(this));

    this.worker = work(require('./worker'));

    this.worker.addEventListener('message', function(e) {
      if (e.data == 'tick') {
        this.emit('tick');
      } else
        console.log('Worker message: ' + e.data);
    }.bind(this));

    this.worker.postMessage({
      'interval': this.lookahead
    });
  }

  setNextNote() {
    // Advance current note and time by a 16th note...
    // Notice this picks up the CURRENTtempo value to calculate beat length.
    var secondsPerBeat = 60.0 / this.tempo;

    // Add beat length to last beat time
    this.nextNoteTime += 0.25 * secondsPerBeat;

    // Advance the beat number, wrap to zero
    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    //notesInQueue.push({
    //   note: beatNumber,
    //   time: time
    //});

    // we're not playing non-8th 16th notes
    if (this.noteResolution == 1 && beatNumber % 2) return;

    // we're not playing non-quarter 8th notes
    if (this.noteResolution == 2 && beatNumber % 4) return;

    // create an oscillator
    let osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);

    // beat 0 == low pitch
    if (beatNumber % 16 === 0) {
      this.emit('tick:start');
      osc.frequency.value = 880.0;
    }
    // quarter notes = medium pitch
    else if (beatNumber % 4 === 0) {
      osc.frequency.value = 440.0;
    }
    // other 16th notes = high pitch
    else {
      osc.frequency.value = 220.0;
    }

    osc.start(time);
    osc.stop(time + this.noteLength);
  }

  schedule() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.setNextNote();
    }
  }

  play() {
    if (this.playing) return;

    this.playing = true;
    this.current16thNote = 0;
    this.nextNoteTime = this.audioContext.currentTime;
    this.worker.postMessage('start');
  }

  stop() {
    if (!this.playing) return;

    this.playing = false;
    this.worker.postMessage('stop');
  }

  onTick(method) {
    this._onTickMethods.push(method);
  }
}

module.exports = Metronome;
