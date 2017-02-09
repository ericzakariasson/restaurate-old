import React, { Component } from 'react';
import { Link } from 'react-router';
import _ from 'underscore';

const Reviews = (props) => {
    //Om det finns recensioner
    if (props.reviews.length) {

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

      function priceHandler(path) {
        if (path) {
          return (<div className="review-restaurant-price">{priceRange(path)}</div>);
        } else {
          return '';
        }
      }

      function categoriesHandler(path) {
        if (path) {
          return (
            path.map(category => {
              return <li key={_.uniqueId()} className="review-category">{category}</li>;
            })
          )
        } else {
          return '';
        }
      }
      
      const reviews = props.reviews;
      const sortBy = props.sortBy.method;
      const reverse = props.sortBy.reverse;
      const filterValue = props.filter;

      function isSet(prop) {
        if (!_.isUndefined(prop) && prop !== null) {
          return true;
        } else {
          return false;
        }
      }

      //Söker efter namn
      const filteredReviewsByName = _.filter(reviews, function(review) {
        if (isSet(review.info.name)) {
          return review.info.name.match(new RegExp(filterValue, 'i'));
        }
      });

      //Söker efter plats
      const filteredReviewsByLocation = _.filter(reviews, function(review) {
        if (isSet(review.info.location)) {
          return review.info.location.match(new RegExp(filterValue, 'i'));
        }
      });

      //Söker efter kategori
      const filteredReviewsByCategory = _.filter(reviews, function(review) {
        if (isSet(review.info.categories)) {
          //Söker efter kategorier som matchar söksträngen.
          const matchedCategories = _.filter(review.info.categories, (category) => {
            return category.match(new RegExp(filterValue, 'i'));
          })
          //Jämför om kategorin finns i recensionen och returnerar en ny array om kategorin finns i båda arrays. Om arrayen har en längd, returnera recensionen.
          return _.intersection(review.info.categories, matchedCategories).length;
        }
      })

      //Söker efter pris
      const filteredReviewsByPrice = _.filter(reviews, function(review) {
        let price = '';
        if (isSet(review.info.price)) {
          switch(filterValue.charAt(0)) {
            case 'B':
            case 'b':
              price = 1;
              break;
            case 'M':
            case 'm':
              price = 2;
              break;
            case 'D':
            case 'd':
              price = 3;
              break;
            case 'E':
            case 'e':
              price = 4;
              break;
            default:
              price = 2;
              break;
          }
        }
        
        return review.info.price === price;
      });

      //Lägger ihop resultaten och tar bort dubletter
      const filteredReviews = _.union(filteredReviewsByName, filteredReviewsByLocation, filteredReviewsByCategory, filteredReviewsByPrice);

      //Standardsortering efter datum
      let sortedReviews = _.sortBy(filteredReviews, function(obj){ return +obj.time});

      //Returnerar en annan sortering. Väljer att han en switch ifall man lägger till fler sorteringar.
      switch (sortBy) {
        case 'score':
          sortedReviews = _.sortBy(filteredReviews, function(obj){ return +obj.info.score});
          break;
        default:
          break;
      }

      //Vänder ordning från asc till desc
      if(!reverse) {
        sortedReviews = sortedReviews.reverse();
      }

      return (
        <section className="reviews">
        {
          sortedReviews.map(review => {

            //Datumformat: YYYY-MM-DD
            const date = new Date(review.time).toISOString().split('T')[0];

            return (
              <article className="review" key={review.time}>
                <section className="review-main">
                  <div className="review-restaurant-info">
                    <h1 className="review-restaurant-name">{review.info.name}</h1>
                    <ul className="review-categories">
                      {categoriesHandler(review.info.categories)}
                    </ul>
                    {priceHandler(review.info.price)}
                  </div>
                  <h2 className="review-score">{review.info.score}</h2>
                  <span className="review-date">{date}</span>
                </section>
                <Link className="review-full" to={`/reviews/${review.id}`}>Se hela</Link>
              </article>
            )
          })
        }
        </section>
      )
    //Om det inte finns recensioner
    } else {
      return (
        <section className="reviews no-reviews">
          <div>
            <h1>Betygsätt din första restaurang!</h1>
            <button className="button button-black"><Link to="/new">Ny recension</Link></button>
          </div>
        </section>
      )
    }
}

export default Reviews