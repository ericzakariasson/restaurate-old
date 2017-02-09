import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import base from '../base';
import _ from 'underscore';

class Review extends Component {

  constructor() {
    super();

    this.state = {
      review: {}
    };
  }

  componentWillMount() {
    const reviewId = this.props.location.pathname.split('/')[2];
    const reviews = this.props.state.reviews;

    const review = _.find(reviews, function(review) {
      return review.id === reviewId;
    });
    
    this.setState({ review })
  }

  deleteReview() {
    const id = this.state.review.id
    const uid = base.auth().currentUser.uid;

    const indexOfReview = _.indexOf(this.props.state.reviews, this.state.review);
    let newReviews = this.props.state.reviews;
    newReviews.splice(indexOfReview, 1);

    const reviewRef = base.database().ref('/reviews/').orderByChild('id').equalTo(id);

    reviewRef.on('value', snapshot => {
      let promises = [];
      for (var key in snapshot.val()) {

        const reviewPromise = base.database().ref('reviews/' + key).remove();
        const userReviewPromise = base.database().ref('/users/' + uid + '/reviews/' + key).remove();

        promises.push(reviewPromise, userReviewPromise);
      }
      Promise.all(promises).then(() => {
        this.props.stateSetter({
          reviews: newReviews
        });
        browserHistory.push('/reviews');
      });
    })
  }

  render() {

    const review = this.state.review;

    //Kollar om objektet har prop med hjälp av underscores "isUndefined" och returnerar motsatsen.
    function isDefined(prop) {
      if (!_.isUndefined(prop)) {
        return prop;
      } else {
        return '-';
      }
    }
    //Kollar om serviceobjektet finns och sedan om den valda "prop"en finns.
    function isDefinedService(prop) {
      if (!_.isUndefined(review.ratings.service)) {
        if (_.has(review.ratings.service, prop)) {
          return review.ratings.service[prop];
        } else {
          return '-'
        }
      } else {
        return '-';
      }
    }

    function isDefinedEnvironment(prop) {
      if (!_.isUndefined(review.ratings.environment)) {
        if (_.has(review.ratings.environment, prop)) {
          return review.ratings.environment[prop];
        } else {
          return '-'
        }
      } else {
        return '-';
      }
    }

    function priceRange(value) {
        let price = '';
        switch (value) {
          case 1:
            price = 'billig';
            break;
          case 2:
            price = 'medel';
            break;
          case 3:
            price = 'dyr';
            break;
          case 4:
            price = 'exklusiv';
            break;
          default:
            price = '-';
            break;
        }
        return price;
      }

    function subScoreCounter(path) {
      let score = null;
      for (var key in path) {
        score += path[key];
      }
      return (score / 2);
    }

    function categories() {
      const categories = isDefined(review.info.categories);

      if (categories === '-') {
        return '-'
      } else {
        return (
          categories.map(category => {
            return <li key={_.uniqueId()} className="review-category">{category}</li>;
          })
        )
      }
    }

    return (
      <div>
        <article className="review-info review-header">
          <h2 className="review-header-info review-header-info-name">{isDefined(review.info.name)}</h2>
          <h2 className="review-header-info review-header-info-location">{isDefined(review.info.location)}</h2>
        </article>
        <section className="review-ratings">
          <div className="section-row">
            <h2 className="review-ratings-total-title">Total</h2>
            <h2 className="review-ratings-total-value">{isDefined(review.info.score)}</h2>
          </div>
          <section className="section-add-rate section-border">
            <article className="review-rating-header article">
              <h3 className="review-rating-header-title">Mat</h3>
              <h3 className="review-rating-header-value">{isDefined(review.ratings.food)}</h3>
            </article>
            <article className="review-rating article">
              <div className="review-rating-header">
                <h3 className="review-rating-header-title">Service</h3>
                <h3 className="review-rating-header-value">{subScoreCounter(review.ratings.service)}</h3>
              </div>
              <ul>
                <li className="review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Bemötande</h4>
                  <h4 className="review-rating-sub-header-value">{isDefinedService('treatment')}</h4>
                </li>
                <li className="review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Kunskap</h4>
                  <h4 className="review-rating-sub-header-value">{isDefinedService('knowledge')}</h4>
                </li>
              </ul>
            </article>
            <article className="review-rating article">
              <div className="review-rating-header">
                <h3 className="review-rating-header-title">Miljö</h3>
                <h3 className="review-rating-header-value">{subScoreCounter(review.ratings.environment)}</h3>
              </div>
              <ul>
                <li className="review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Interiör</h4>
                  <h4 className="review-rating-sub-header-value">{isDefinedEnvironment('interior')}</h4>
                </li>
                <li className="review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Atmosfär</h4>
                  <h4 className="review-rating-sub-header-value">{isDefinedEnvironment('atmosphere')}</h4>
                </li>
              </ul>
            </article>
            <article className="review-rating-header article">
              <h3 className="review-rating-header-title">Upplevelse</h3>
              <h3 className="review-rating-header-value">{isDefined(review.ratings.experience)}</h3>
            </article>
          </section>
        </section>
        <section className="articles-below-total">
          <article className="review-info review-comment">
            <h3 className="review-info-title">Kommentar</h3>
            <p className="review-info-comment">{isDefined(review.info.comment)}</p>
          </article>
          <article className="review-info review-categories">
            <h3 className="review-info-title">Kategori</h3>
            <ul className="review-categories-list">
              {categories()}
            </ul>
          </article>
          <article className="review-info review-price">
            <h3 className="review-info-title">Prisklass</h3>
            <div className="review-price-range">{priceRange(isDefined(review.info.price))}</div>
          </article>
        </section>
        <button onClick={this.deleteReview.bind(this)} className="button button-delete">Ta bort recension</button>
      </div>
    )
  }

}

export default Review;