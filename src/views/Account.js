import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import base from '../base';


class About extends Component {

  constructor() {
    super();

    this.errorHandler = this.errorHandler.bind(this);
    this.logOut = this.logOut.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeName = this.changeName.bind(this);

    this.state = {
      error: '',
      email: '',
    }
  }

  componentWillMount() {
    const uid = base.auth().currentUser.uid;
    base.fetch('users/' + uid, {
      context: this,
    }).then(result => {
      this.setState({ email: result.email });
    })
  }


  errorHandler(err) {
    let errorMessage = '';

    switch (err) {
      case 'name':
        errorMessage = 'Namnet måste vara längre'; 
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Denna operationen kräver att du nyligen loggat in. Logga in på nytt och försök igen';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Emailadressen är inte giltig';
        break;
      default:
        errorMessage = 'Ett fel uppstod. Vänligen försök igen';
        break;
    }

    this.setState({error: errorMessage});
  }

  logOut() {
    base.unauth();
    this.props.stateSetter({
      authenticated: false,
      user: {
        name: '',
      },
      reviews: [],
    });
    browserHistory.push('./');
  }

  changeEmail() {
    const user = base.auth().currentUser;
    const newEmail = this.emailInput.value;

    user.updateEmail(newEmail).then(() => {
      base.update('/users/' + user.uid, {
        data: {
          email: newEmail,
        }
      })
      this.setState({ email: newEmail });
      const buttonEmail = document.querySelector('.button-email');
      buttonEmail.classList.add('save-success');
      setTimeout(() => {
        buttonEmail.classList.remove('save-success');
      }, 2000);
    }, (err) => {
      console.error(err);
      this.errorHandler(err.code);
    });
  }

  changeName() {
    const newName = this.nameInput.value;

    if (newName.length >= 1) {
      base.update('/users/' + base.auth().currentUser.uid, {
        data: {
          name: newName
        },
      }).then(() => {
        this.props.stateSetter({
          user: {
            name: newName
          }
        });
        const buttonName = document.querySelector('.button-name');
        buttonName.classList.add('save-success');
        setTimeout(() => {
          buttonName.classList.remove('save-success');
        }, 2000);
      }).catch(err => {
        console.error(err);
        this.errorHandler(err.code);
      })
    } else {
      this.errorHandler('name');
    }
  }

  render() {

    const errorClass = this.state.error ? 'auth-error auth-error-active' : 'auth-error';

    return (
      <div>
        <section className="account-fields">
          <article className="account-field">
            <h2 className="account-field-title">Uppdatera namn</h2>
            <div className="account-field-interactive">
              <input pattern=".{1,}" placeholder={this.props.state.user.name} className="input" ref={(input) => this.nameInput = input} />
              <button className="button button-black button-name" onClick={this.changeName}>Uppdatera namn</button>
            </div>
          </article>
          <article className="account-field">
            <h2 className="account-field-title">Uppdatera email</h2>
            <span className="light">(kräver färsk inloggning)</span>
            <div className="account-field-interactive">
              <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" type="email" placeholder={this.state.email} className="input" ref={(input) => this.emailInput = input} />
              <button className="button button-black button-email" onClick={this.changeEmail}>Uppdatera email</button>
            </div>
          </article>
        </section>
        <div className={errorClass}>
          <span>{this.state.error ? this.state.error : ''}</span>
        </div>
        <button className="button button-cta" onClick={this.logOut}>Logga ut</button>
      </div> 
      )
  }
}

export default About;