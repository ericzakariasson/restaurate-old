import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './App';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import ResetPassword from './views/ResetPassword';
import Account from './views/Account';
import About from './views/About';
import NewReview from './views/NewReview';
import Reviews from './views/Reviews';
import Review from './views/Review';

import NoMatch from './views/NoMatch';

import './index.css';

const Root = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}></IndexRoute>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/account" component={Account}></Route>
        <Route path="/resetpassword" component={ResetPassword}></Route>
        <Route path="/new" component={NewReview}></Route>
        <Route path="/reviews" component={Reviews}></Route>
        <Route path="/reviews/:reviewId" component={Review}></Route>
        <Route path="/about" component={About}></Route>
        <Route path="*" component={NoMatch}></Route>
      </Route>
    </Router>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);