import React, { Component } from 'react';
import Logo from './img/logo.svg';

import Header from './modules/Header';
import Footer from './modules/Footer';

import base from './base';

class App extends Component {

  constructor() {
    super();
    this.stateSetter = this.stateSetter.bind(this);
    
    this.state = {
      loading: true,
      authenticated: false,
      user: {
        name: '',
      },
      reviews: [],
    };
  }

  componentWillMount() {
    //Om localStorage finns
    if (localStorage.getItem('firebase:authUser:AIzaSyDeXQKRTcKLMbINDVjLMAY6RDOFrX4sJYI:[DEFAULT]')) {
      const uid = JSON.parse(localStorage.getItem('firebase:authUser:AIzaSyDeXQKRTcKLMbINDVjLMAY6RDOFrX4sJYI:[DEFAULT]')).uid;

      base.fetch('/users/' + uid, {
        context: this,
      }).then((data) => {
        this.setState({
          authenticated: true,
          user: {
            name: data.name,
          }
        });

        const userReviewsRef = base.database().ref(`/users/${uid}/reviews`);
        userReviewsRef.once('value').then(snapshot => {
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
            this.setState({reviews: result, loading: false});
          });
        })
        .catch(err => {
          console.error(err);
        });
      }).catch((err) => {
        //Fixa felmeddelande
        alert('Error');
        console.error(err);
      });
    } else {
      this.setState({ loading: false});
    }
    
  }

  stateSetter(newState) {
    this.setState(newState);
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <div className="loading">
            <img src={Logo} alt="Laddar" />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Header username={this.state.user.name} authenticated={this.state.authenticated} />
          <main>
            {
              this.props.children && React.cloneElement(this.props.children, {
                state: this.state,
                stateSetter: this.stateSetter
              })
            }
          </main>
          <Footer />
        </div>
      )
    }
  }
}
            
export default App;