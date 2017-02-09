import React, { Component } from 'react';

class AddInfoModal extends Component  {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      active: false,
      value: '',
    }
  }

  componentDidUpdate() {
    if (!this.state.value) {
      this.input.focus();
    }
  }

  handleClick() {
    this.setState({active: !this.state.active});
  }

  handleChange(event) {
    this.setState({value: event.target.value}, () => {
      const key = this.props.info;
      const value = this.state.value;
      
      this.props.setInfo(key, value);
    });
  }

  handleRemove() {
    this.setState({active: false, value: ''}, () => {
      this.input.value = '';

      const key = this.props.info;
      this.props.setInfo(key, null);
    });
  }

  render() {
    const inputClass = this.state.active ? `visible add-info add-info-${this.props.info}` : 'hidden';
    const buttonClass = this.state.active ? 'hidden' : 'button button-add-info visible';

    return (
      <div>
        <button onClick={this.handleClick} className={buttonClass}>Lägg till&nbsp;<span className="bold">{this.props.title} +</span></button>
        <div className={inputClass}>
          <input placeholder={this.props.title} onKeyUp={this.handleChange} ref={(input) => {this.input = input}} className="input input-data-input" />
          <div onClick={this.handleRemove} className="remove-data">
            <span className="remove-data-cross"></span>
            <span className="remove-data-cross"></span>
          </div>
        </div>
      </div>
    )
  }
}
            
export default AddInfoModal;