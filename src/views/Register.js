import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import base from '../base';

class Register extends Component {
  constructor() {
    super();

    this.registerUser = this.registerUser.bind(this);

    this.state = {
      error: ''
    }
  }

  registerUser(e) {
    e.preventDefault();

    let password = '';

    //Kontrollerar så att lösenorden matchar
    if(this.passwordInput.value === this.password2Input.value) {
      password = this.passwordInput.value;
    } else {
      this.password2Input.value = '';
      //Lägger till en class som visar att lösenorden inte matchar
      document.querySelector('#p2').classList.add('input-error');
      setTimeout(function() {
        document.querySelector('#p2').classList.remove('input-error');
      }, 2000);
      return;
    }

    const user = {
      name: this.nameInput.value,
      email: this.emailInput.value,
      password: password,
    }

    base.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(authData => {
        //Spara avändardatan till databas
        base.post(`/users/${authData.uid}`, {
          data: {
            name: user.name,
            email: user.email,
          },
        })
        .then(() => {
          const superFunction = () => {
          //Hämta användarens namn
          base.fetch('/users/' + user.uid, {
            context: this,
          }).then(data => {
              this.setState({
                name: data.name,
              });

              //Hämtar användaren recensioner
              const userReviewsRef = base.database().ref('/users/' + user.uid + '/reviews');
              userReviewsRef.once('value')
                .then(snapshot => {
                  let promises = [];
                  for (var key in snapshot.val()) {
                    const promise = base.database().ref('/reviews/' + key).once('value')
                      .then(snapshot2 => {
                        return snapshot2.val();
                      }).catch(err => {
                        console.error(err);
                      });
                    promises.push(promise);
                  }
                  Promise.all(promises).then(result => {
                    this.setState({
                      reviews: result
                    });

                    this.props.stateSetter({
                      authenticated: true,
                      user: {
                        name: this.state.name,
                      },
                      reviews: this.state.reviews
                    });
                    browserHistory.push('/');
                  })
                })
                .catch(err => {
                  console.error(err);
                  this.setState({
                    error: 'Ett fel uppstod. Uppdatera sidan och försök igen'
                  });
                });
            })
            .catch(err => {
              console.error(err);
              this.setState({
                error: 'Ett fel uppstod. Uppdatera sidan och försök igen'
              })
            })
          }

        let user = authData;

        //Fixa inlogg med provider på mobil. Misstänker att det har med redirect och ny flik att göra.
        if (authData.credential) {
          user = authData.user;

          let name = user.displayName;

          const usersRef = base.database().ref('/users/' + user.uid);
          //Kollar om användaren redan finns
          usersRef.once('value', snapshot => {
            if (snapshot.val() != null) {
              superFunction();
            } else {
              base.post('/users/' + user.uid, {
                data: {
                  name: name,
                  email: user.email,
                },
              }).then(() => {
                superFunction();
              }).catch((err) => {
                console.error(err);
              });
            }
          });
        } else {
          superFunction();
        }
        })
        .catch(err => {
          alert(err);
        })
      })
      //Felmeddelanden vid registrering
      .catch(error => {
        console.log(error.code);

        let errorMessage = '';

        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = 'Ett nätverksfel uppstod. Försök igen senare.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Ditt lösenord måste bestå av minst 6 tecken.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Det finns redan ett konto kopplat till denna emailadressen.';
            break;
          //Om inget av den ovan visas ett generellt felmeddelande
          default:
            alert('Ett fel uppstod. Vänligen försök igen senare eller kontakta oss via hej@restaurate.se');
            break;
        }

        this.setState({error: errorMessage});
      });
  }

  render() {

    if (this.props.state.authenticated) {
      browserHistory.push('/');
    }

    const errorClass = this.state.error ? 'auth-error auth-error-active' : 'auth-error';

    return (
      <div>
        <h2 className="h2">Registrera dig</h2>
        <form className="form" onSubmit={this.registerUser}>
          <div className="input-area">
            <input  className="input input-top" ref={(input) => { this.nameInput = input }} placeholder="Namn" />
            <input  className="input" ref={(input) => { this.emailInput = input }} placeholder="Email" type="email" />
            <input pattern=".{6,}" title="Minst 6 tecken" required className="input" ref={(input) => { this.passwordInput = input }} placeholder="Lösenord" type="password" />
            <input pattern=".{6,}" title="Minst 6 tecken" required id="p2" className="input input-bottom" ref={(input) => { this.password2Input = input }} placeholder="Upprepa lösenord" type="password" />
          </div>
          <div className={errorClass} >
            <span>{this.state.error ? this.state.error : ''}</span>
          </div>
          <button className="button button-cta" type="submit">Registrera</button>
        </form>
      </div>
    );
  }
}

export default Register;