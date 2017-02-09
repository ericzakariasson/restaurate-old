import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';

class AddCategory extends Component  {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.saveCategory = this.saveCategory.bind(this);

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
    this.setState({value: event.target.value});
  }

  handleRemove() {
    this.setState({active: !this.state.active, value: ''});
  }

  saveCategory(e) {
    e.preventDefault();
    this.props.addCategory(this.state.value)
    this.setState({active: !this.state.active, value: ''});
  }

  render() {

    const inputClass = this.state.active ? 'visible add-category' : 'hidden';
    const buttonClass = this.state.active ? 'hidden' : 'button button-add-category visible';

    const placeholders = ['svenskt', 'närodlat', 'italienskt', 'vegetariskt', 'ekologiskt', 'husmanskost', 'LCHF', 'glutenfritt', 'laktosfritt', 'grill', 'BBQ', 'buffé'];
    const placeholder = placeholders[Math.floor(Math.random()*placeholders.length)];

    return (
      <div>
        <button onClick={this.handleClick} className={buttonClass}>Lägg till&nbsp;<span className="bold">kategori +</span></button>
        <div className={inputClass}>
          <form onSubmit={this.saveCategory}>
            <AutosizeInput placeholder={`t.ex ${placeholder}`} value={this.state.value} onChange={this.handleChange} ref={(input) => {this.input = input}}/>
            <div onClick={this.handleRemove} className="remove-data">
              <span className="remove-data-cross"></span>
              <span className="remove-data-cross"></span>
            </div>
            <button className="save-category-button" type="submit">Spara</button>
          </form>
        </div>
      </div>
    )
  }
}
            
export default AddCategory;