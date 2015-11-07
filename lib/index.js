'use strict';

var Metronome = require('./metronome');
var Trainer = require('./trainer');
var App = require('./app.jsx');
var ReactDOM = require('react-dom');
var React = require('react');

function init() {
  var metronome = window.m = new Metronome({
    tempo: 96
  });

  var trainer = window.t = new Trainer(96, 120, 10, 2);

  //t.play();
  var app = React.createFactory(App)({ metronome, trainer });
  ReactDOM.render(app, document.getElementById('mount'));
}

window.addEventListener('load', init);
