import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import base from '../base';

class Login extends Component {
  constructor() {
    super();

    this.authenticateWithPassword = this.authenticateWithPassword.bind(this);
    this.authHandler = this.authHandler.bind(this);

    this.state = {
      name: '',
      reviews: [],
      error: '',
    }
  }

  componentWillMount() {
    if (this.props.state.authenticated) {
      browserHistory.push('/');
    }
  }

  componentDidMount() {
    this.emailInput.focus();
  }


  authenticateWithPassword(e) {
    e.preventDefault();

    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    base.authWithPassword({
      email: email,
      password: password
    }, this.authHandler)
  }

  authHandler(err, authData) {
    let errorMessage = '';
    
    if(err) {
      console.error(err);

      switch (err.code) {
        case 'auth/wrong-password':
          errorMessage = 'Email och lösenord matchar inte';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Email och lösenord matchar inte';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Popup-fönstret stängdes innan användaren loggades in.'
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Ett konto är redan kopplat till den här emailadressen. Vänligen logga in med det konto som är associerat med emailadressen.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Ett nätverksfel har uppstått. Vänligen försök igen senare.';
          break;
        default:
          alert(err.message);
          break;
      }

      this.setState({error: errorMessage});
      return;
    } else {
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
    }
  }

  render() {

    const errorClass = this.state.error ? 'auth-error auth-error-active' : 'auth-error';

    return (
      <div>
        <h2 className="h2">Logga in</h2>
        <form onSubmit={this.authenticateWithPassword} className="form">
          <div className="input-area">
            <input required type="email" className="input input-top" placeholder="Email" ref={(input) => { this.emailInput = input }} />
            <input required pattern=".{6,}" type="password" className="input input-bottom" placeholder="Lösenord" ref={(input) => { this.passwordInput = input }} />
          </div>
            <button className="button button-cta" type="submit">Logga in</button>
        </form>
        <span onClick={this.forgotPassword} className="login-span login-forgot-password"><Link to="/resetpassword">Glömt lösenord?</Link></span>
        <div className={errorClass}>
          <span>{this.state.error ? this.state.error : ''}</span>
        </div>
      </div>
    );
  }
}

export default Login;