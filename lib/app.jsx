'use strict';

var React = require('react');
var _ = require('lodash');

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: false };
  }

  onChange(e) {
    this.setState({
      checked: !this.state.checked
    });

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(!this.state.checked);
    }
  }

  render() {
    return (
      <div className="togglebutton">
        <label>
          <input type="checkbox" checked={this.state.checked} />
          <span className="toggle" onClick={this.onChange.bind(this)}></span> {this.props.children}
        </label>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { metronome: this.props.metronome };
  }

  componentWillMount() {
    let forceUpdate = this.forceUpdate.bind(this, null);
    this.props.metronome.on('tick:beat', forceUpdate);
    this.props.trainer.metronome.on('tick:beat', forceUpdate);
  }

  _onStart() {
    if (this.refs.switch.state.checked) {
      this.props.trainer.play();
    } else {
      this.props.metronome.play();
    }
  }

  _onStop() {
    if (this.refs.switch.state.checked) {
      this.props.trainer.stop();
    } else {
      this.props.metronome.stop();
    }
  }

  _onTick() {

  }

  onChangeTempo(e) {
    // TODO disable while playing
    let tempo =  parseInt(e.target.value, 10) || this.props.metronome.tempo;
    this.props.metronome.tempo = this.props.trainer.tempo = tempo;
    this.forceUpdate();
  }

  onToggle(checked) {
    this.setState({
      metronome: checked ? this.props.trainer.metronome : this.props.metronome
    });
  }

  onChangeTarget(e) {
    this.props.trainer.targetTempo = parseInt(e.target.value, 10) || this.props.trainer.targetTempo;
  }

  onChangeStep(e) {
    this.props.trainer.tempoStep = parseInt(e.target.value, 10) || this.props.trainer.tempoStep;
  }

  onChangeBars(e) {
    this.props.trainer.bars = parseInt(e.target.value, 10) || this.props.trainer.bars;
  }

  render() {
    return (
      <div className='jumbotron'>
        <div className='row'>
          <div className='col-lg-4 col-lg-offset-1'>
            <form className='form-horizontal'>
              <legend>Metrognome</legend>
              <fieldset>
                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Tempo</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='tempo' placeholder={this.props.metronome.tempo} onChange={this.onChangeTempo.bind(this)}/>
                  </div>
                </div>

                <h4>Speed Trainer</h4>
                <div className='form-group'>
                  <div className="col-lg-10">
                    <Toggle ref="switch" onChange={this.onToggle.bind(this)}>Enable</Toggle>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Target Tempo</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='target' placeholder={this.props.trainer.targetTempo} onChange={this.onChangeTarget.bind(this)}/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Tempo Step</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='step' placeholder={this.props.trainer.tempoStep} onChange={this.onChangeStep.bind(this)}/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='tempo' className='col-lg-2 control-label'>Bars</label>
                  <div className='col-lg-10'>
                    <input type='email' className='form-control' id='bars' placeholder={this.props.trainer.bars} onChange={this.onChangeBars.bind(this)}/>
                  </div>
                </div>
              </fieldset>
            </form>

          </div>

          <div className='col-lg-6 center-block'>
            <div className='text-center'>
              <h2>Beat: {this.state.metronome.beat}</h2>
              <h2>BPM: {this.state.metronome.tempo}</h2>
              <button type='submit' className='btn btn-primary' onClick={this._onStart.bind(this)}>Start</button>
              <button className='btn' onClick={this._onStop.bind(this)}>Stop</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = App;
