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

  window.t = new Trainer(96, 260, 30, 2);

  //t.play();

  ReactDOM.render(
    React.createFactory(App)({ metronome: metronome}),
    document.getElementById('mount')
  );
}

window.addEventListener('load', init);
