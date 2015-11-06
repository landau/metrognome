'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

class Trainer extends EventEmitter {
  constructor(metronome, targetTempo, tempoStep, bars) {
    super();

    _.assign(this, {
      metronome, targetTempo, tempoStep, bars
    });

    this.originalTempo = this.metronome.tempo;
    this.curBar = 0;

    this.metronome.on('tick:start', this.onTick.bind(this));
  }

  onTick() {
    if (this.curBar < this.bars) {
      this.curBar++;
      return;
    }

    this.curBar = 1; // We've moved on to the next bar
    this.metronome.tempo += this.tempoStep;

    // FIXME if tempo + tempoStep exceeds targetTempo, but never played that tempo
    // it should normalize to the targetTempo
    if (this.metronome.tempo > this.targetTempo) {
      this.stop();
    }
  }

  play() {
    if (this.metronome.playing) return;
    this.reset();
    this.metronome.play();
  }

  reset() {
    this.curBar = 0;
    this.metronome.tempo = this.originalTempo;
  }

  stop() {
    if (!this.metronome.playing) return;
    this.metronome.stop();
  }
}

module.exports = Trainer;
