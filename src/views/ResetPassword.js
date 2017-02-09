import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import base from '../base';

class ResetPassword extends Component {

  constructor() {
    super();

    this.state = {
      error: ''
    }
  }

  componentDidMount() {
    this.emailInput.focus();
  }


  handleClick(e) {
    e.preventDefault();

    const email = this.emailInput.value;
    base.resetPassword({
      email: email
    }).then(() => {
      const button = document.querySelector('.button');
      button.classList.add('save-success');
      setTimeout(() => {
        button.classList.remove('save-success');
        browserHistory.push('/login');
      }, 2000);
    }).catch((err) => {
      console.error(err);
      this.setState({error: 'Ett fel har uppstått. Försök igen'});
    })
  }

  render() {

    const errorClass = this.state.error ? 'auth-error auth-error-active' : 'auth-error';

    return (
      <div>
        <section className="info">
          <h2 className="h2">Återställ lösenord </h2>
          <p>Återställ lösenord genom att fylla i din emailadress. Du kommer att få ett mail med instruktioner om hur du återställer ditt lösenord.</p>
        </section>
        <form className="form" onSubmit={this.registerUser}>
          <div className="input-area">
            <input type="email" className="input input-top input-bottom" ref={(input) => { this.emailInput = input }} placeholder="Email" />
          </div>
          <button onClick={this.handleClick.bind(this)} className="button button-cta" type="submit">Återställ lösenord</button>
        </form>
        <div className={errorClass}>
          <span>{this.state.error ? this.state.error : ''}</span>
        </div>
      </div>
      )
    }
  }

export default ResetPassword;