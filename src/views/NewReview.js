import React, { Component } from 'react';
import AddInfo from '../modules/AddInfo';
import AddRate from '../modules/AddRate';
import AddCategory from '../modules/AddCategory';
import AddComment from '../modules/AddComment';
import { browserHistory } from 'react-router';
import base from '../base';
import _ from 'underscore';

class NewReview extends Component {


  constructor() {
    super()

    this.errorHandler = this.errorHandler.bind(this);
    this.saveReview = this.saveReview.bind(this);
    this.setInfo = this.setInfo.bind(this);
    this.setPrice = this.setPrice.bind(this);
    this.setRate = this.setRate.bind(this);
    this.setRateService = this.setRateService.bind(this);
    this.setRateEnvironment = this.setRateEnvironment.bind(this);
    this.addCategory = this.addCategory.bind(this);

    this.state = {
      error: '',
      newReview: {
        id: '',
        owner: '',
        time: null,
        info: {
          score: 0,
          name: '',
          location: null,
          categories: [],
          price: null,
          comment: null,
        },
        ratings: {
          food: null,
          service: {
            treatment: null,
            knowledge: null,
          },
          environment: {
            interior: null,
            atmosphere: null
          },
          experience: null,
        }
      }
    }
  }

  componentWillMount() {
    //Om användaren inte är inloggad
    if (!this.props.state.authenticated) {
      browserHistory.push('/login');
    } else {
      //Spara ägaren till recensionen
      const owner = base.auth().currentUser.uid;
      this.setState({
        newReview: {
          ...this.state.newReview,
          owner: owner
        }
      });  
    }
  }
  
  errorHandler(err) {
    let errorMessage = '';

    switch (err) {
      case 'name':
        errorMessage = 'Fyll i restaurangens namn'; 
        break;
      case 'score':
        errorMessage = 'Ge resturangen ett betyg';
        break;
      default:
        errorMessage = 'Ett fel uppstod. Vänligen försök igen';
        break;
    }

    this.setState({error: errorMessage});
  }

  saveReview(totalScore) {

    if (this.state.newReview.info.name.length === 0) {
      this.errorHandler('name');
    } else if (!totalScore) {
      this.errorHandler('score');
    } else {

      //Sparar totalpoängen med 1 variabel.
      const totalScoredFixed = totalScore.toFixed(1);
      const timeStamp = Date.now();

      //Genererar ett slumpmässigt id
      function dec2hex (dec) {
        return dec.toString(16)
      }

      function generateId (len) {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr).map(dec2hex).join('')
      }

      this.setState({
        newReview: {
          ...this.state.newReview,
          time: timeStamp,
          info: {
            ...this.state.newReview.info,
            score: totalScoredFixed
          },
          id: (timeStamp + generateId(4)),
        }
      }, () => {
        base.push('reviews/', {
          data: this.state.newReview,
        }).then((snapshot) => {
            var generatedKey = snapshot.key;
            base.post(`users/${this.state.newReview.owner}/reviews/${generatedKey}`, {
              data: {[this.state.newReview.owner]: true}
            });

          //Lägg till i appstate
          this.props.stateSetter({reviews: this.props.state.reviews.concat([this.state.newReview])});
          const saveButton = document.querySelector('.button-cta')

          //Visa att recensionen sparades
          saveButton.classList.add('save-success');

          //När animationen är slut
          saveButton.addEventListener('transitionend', (e) => {
            browserHistory.push('/reviews');
          })

          //Om ett fel uppstod
        }).catch((err) => {
          console.error(err);
        })
      });
    }
  }

  setInfo(key, value) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        info: {
          ...this.state.newReview.info,
          [key]: value,
        },
      }
    });
  }

  setRate(key, value) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        ratings: {
          ...this.state.newReview.ratings,
          [key]: value,
        },
      }
    });
  }

  setRateService(key, value) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        ratings: {
          ...this.state.newReview.ratings,
          service: {
            ...this.state.newReview.ratings.service,
            [key]: value,
          }
        },
      },
    });
  }

  setRateEnvironment(key, value) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        ratings: {
          ...this.state.newReview.ratings,
          environment: {
            ...this.state.newReview.ratings.environment,
            [key]: value,
          }
        },
      },
    });
  }
  
  addCategory(item) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        info: {
          ...this.state.newReview.info,
          categories: this.state.newReview.info.categories.concat([item])
        }
      }
    });
  }

  setPrice(price) {
    this.setState({
      newReview: {
        ...this.state.newReview,
        info: {
          ...this.state.newReview.info,
          price: price
        }
      }
    });

    //Highlightar den knapp som är vald.
    const buttons = document.querySelectorAll('.button-price');

    for (var i = buttons.length - 1; i >= 0; i--) {
      buttons[i].classList.remove('button-price-active');
    }
    document.querySelector('.button-price-' + price).classList.add('button-price-active');
  }

  render() {

    function isReal(path) {
      if (path != null && !_.isUndefined(path)) {
        return true;
      } else {
        return false;
      }
    }

    let totalRatingValue = 0;
    let totalRatingCount = 0;

    for (var key in this.state.newReview.ratings) {
      var obj = this.state.newReview.ratings[key];
      if (isReal(obj) && typeof(obj) !== 'object' && typeof(obj) !== 'string' && obj !== '') {  
        totalRatingValue += this.state.newReview.ratings[key];
        totalRatingCount += 1;
      }
      
      for (var prop in obj) {
        if (isReal(obj[prop])) {  
          totalRatingValue += obj[prop];
          totalRatingCount += 1;
        }
      }
    }

    let totalScore = (totalRatingValue / totalRatingCount);

    let serviceRating = null;
    let serviceRatingCount = null;
    let serviceRatingFinal = null;


    if (isReal(this.state.newReview.ratings.service.treatment)) {
      serviceRatingCount += 1;
      serviceRating += this.state.newReview.ratings.service.treatment;
    }

    if (isReal(this.state.newReview.ratings.service.knowledge)) {
      serviceRatingCount += 1;
      serviceRating += this.state.newReview.ratings.service.knowledge;
    }

    serviceRatingFinal = (serviceRating / serviceRatingCount);

    let environmentRating = null;
    let environmentRatingCount = null;
    let environmentRatingFinal = null;

    const environment = this.state.newReview.ratings.environment;

    if (isReal(environment.interior)) {
      environmentRatingCount += 1;
      environmentRating += this.state.newReview.ratings.environment.interior;
    }

    if (isReal(environment.atmosphere)) {
      environmentRatingCount += 1;
      environmentRating += this.state.newReview.ratings.environment.atmosphere;
    }

    environmentRatingFinal = (environmentRating / environmentRatingCount);

    const errorClass = this.state.error ? 'auth-error auth-error-active' : 'auth-error';

    return (
      <div>
        <section className="info">
          <h1 className="h1">Betygsätt en ny restaurang</h1>
          <p>Här betygsätter du en ny restaurang. De fält du inte fyller i kommer inte att räknas in i det totala betyget.</p>
        </section>
        <article className="review-info review-header">
          <AddInfo setInfo={this.setInfo} title="namn" info="name" />
          <AddInfo setInfo={this.setInfo} title="plats" info="location" />
        </article>
        <section className="review-ratings">
          <div className="section-row">
            <h2 className="review-ratings-total-title">Total</h2>
            <h2 className="review-ratings-total-value">{totalScore ? totalScore.toFixed(1) : '-'}</h2>
          </div>
          <section className="section-add-rate section-border">
            <article className="review-rating-header article add-review-rating-header">
              <h3 className="review-rating-header-title">Mat</h3>
              <div className="rating-button-text">
                <AddRate setRate={this.setRate} info="food" />
              </div>
            </article>
            <article className="review-rating article">
              <div className="review-rating-header">
                <h3 className="review-rating-header-title">Service</h3>
                <h3 className="review-rating-header-value">{serviceRatingFinal ? serviceRatingFinal : '-'}</h3>
              </div>
              <ul>
                <li className="review-rating-sub-header add-review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Bemötande</h4>
                  <div className="rating-button-text">
                    <AddRate setRate={this.setRateService} info="treatment" />
                  </div>
                </li>
                <li className="review-rating-sub-header add-review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Kunskap</h4>
                  <div className="rating-button-text">
                    <AddRate setRate={this.setRateService} info="knowledge" />
                  </div>
                </li>
              </ul>
            </article>
            <article className="review-rating article">
              <div className="review-rating-header">
                <h3 className="review-rating-header-title">Miljö</h3>
                <h3 className="review-rating-header-value">{environmentRatingFinal ? environmentRatingFinal : '-'}</h3>
              </div>
              <ul>
                <li className="review-rating-sub-header add-review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Interiör</h4>
                  <div className="rating-button-text">
                    <AddRate setRate={this.setRateEnvironment} info="interior" />
                  </div>
                </li>
                <li className="review-rating-sub-header add-review-rating-sub-header">
                  <h4 className="review-rating-sub-header-title">Atmosfär</h4>
                  <div className="rating-button-text">
                    <AddRate setRate={this.setRateEnvironment} info="atmosphere" />
                  </div>
                </li>
              </ul>
            </article>
            <article className="review-rating-header article add-review-rating-header">
              <h3 className="review-rating-header-title">Upplevelse</h3>
              <div className="rating-button-text">
                <AddRate setRate={this.setRate} info="experience" />
              </div>
            </article>
          </section>
        </section>
        <section className="articles-below-total">
          <article className="review-info review-comment">
            <h3 className="review-info-title">Kommentar</h3>
            <AddComment setInfo={this.setInfo} title="kommentar" info="comment" />
          </article>
          <article className="review-info review-categories">
            <h3 className="review-info-title">Kategori</h3>
            <ul className="review-categories-list">
            {
              this.state.newReview.info.categories.map(category => {
                return (
                  <li key={_.uniqueId()}>
                    <div className="add-category">
                      <span className="bold">{category}</span>
                    </div>
                  </li>
                )
              })
            }
            </ul>
            <AddCategory addCategory={this.addCategory} />
          </article>
          <article className="review-info review-price">
            <h3 className="review-info-title">Prisklass</h3>
            <ul>
              <li><button onClick={() => this.setPrice(1)} className="review-price-range button-price button-price-1">Billig</button></li>
              <li><button onClick={() => this.setPrice(2)} className="review-price-range button-price button-price-2">Medel</button></li>
              <li><button onClick={() => this.setPrice(3)} className="review-price-range button-price button-price-3">Dyr</button></li>
              <li><button onClick={() => this.setPrice(4)} className="review-price-range button-price button-price-4">Exklusiv</button></li>
            </ul>
          </article>
          <div className={errorClass}>
            <span>{this.state.error ? this.state.error : ''}</span>
          </div>
          <button onClick={() => this.saveReview(totalScore)} className="button button-cta">Spara recension</button>
        </section>
      </div>
    )
  }
}

export default NewReview;