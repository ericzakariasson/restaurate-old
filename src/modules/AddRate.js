import React, { Component } from 'react';

class AddRate extends Component  {

  constructor() {
    super();

    this.toggleClass = this.toggleClass.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      active: false,
      value: '',
    }
  }

  toggleClass() {
    this.arrow.classList.toggle('arrow-active');
  }

  handleClick() {
    this.setState({active: !this.state.active});
  }

  handleChange(event) {
    this.setState({value: event.target.value}, () => {
      const key = this.props.info;
      const value = parseInt(this.state.value, 10);
      this.props.setRate(key, value);
    });
  }

  handleRemove() {
    this.setState({active: false, value: ''}, () => {
      const key = this.props.info;
      this.props.setRate(key, null);
    });
  }

  render() {
    const selectClass = this.state.active ? `visible add-rate add-rate-${this.props.info}` : 'hidden';
    const buttonClass = this.state.active ? 'hidden' : 'button button-add-info visible';

    return (
      <div>
        <button onClick={this.handleClick} className={buttonClass}>Lägg till&nbsp;<span className="bold">betyg +</span></button>
        <div className={selectClass}>
          <select value={this.state.value} onClick={this.toggleClass} className="select input-rate" onChange={this.handleChange} ref={(select) => {this.select = select}}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </select>
          <div ref={arrow => this.arrow = arrow} className="add-rate-select-arrow">
            <span className="arrow arrow-left"></span>
            <span className="arrow arrow-right"></span>
          </div>
          <div onClick={this.handleRemove} className="remove-data">
            <span className="remove-data-cross"></span>
            <span className="remove-data-cross"></span>
          </div>
        </div>
      </div>
    )
  }
}
            
export default AddRate;