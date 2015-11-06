'use strict';

var React = require('react');

var App = React.createClass({
  //getInitialState() {
  //  return {
  //    tempo: 96,
  //    target: 200,
  //    step: 10,
  //    bars: 2
  //  };
  //}

  //componentDidMount() {
  //  this.props.metronome.tempo = this.state.tempo;
  //  console.log(this.props.metronome);
  //}

  render: function() {
    return (
      <div className='jumbotron'>
        <div className='row'>
          <div className='col-lg-4 col-lg-offset-1'>
            <form className='form-horizontal'>
              <fieldset>
                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Tempo</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='tempo' placeholder='140'/>
                  </div>
                </div>

                <hr/>
                <h4>Speed Trainer</h4>
                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Target Tempo</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='tempo' placeholder='180'/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Tempo Step</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='tempo' placeholder='10'/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Bars</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='tempo' placeholder='4'/>
                  </div>
                </div>
              </fieldset>
            </form>

          </div>

          <div className='col-lg-6 center-block'>
            <div className='text-center'>
              <img src='/img/logo.png' className='image-responsive' style={{
                width: '175px'
              }}/>
              <h2>Beat: 2</h2>
              <h2>BPM: 160</h2>
              <button type='submit' className='btn btn-primary'>Start</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
