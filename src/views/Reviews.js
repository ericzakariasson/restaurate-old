import React, { Component } from 'react';

import ReviewsModule from '../modules/Reviews';

class Reviews extends Component {

  constructor() {
    super();

    this.handleSortBy = this.handleSortBy.bind(this);
    this.searchHandler = this.searchHandler.bind(this);

    this.state = {
      sortBy: {
        method: 'date',
        reverse: false,
      },
      searchValue: '',
    }
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  handleSortBy(method) {
    if (this.state.sortBy.method === method) {
      this.setState({sortBy: {
        ...this.state.sortBy,
        reverse: !this.state.sortBy.reverse,
      }});
    } else {
      this.setState({sortBy: {
        method: method,
        reverse: false
      }});
    }

  }

  searchHandler(e) {
    this.setState({searchValue: e.target.value});
  }

  render() {

    let arrowClassDate = 'button-sort-arrow';
    let arrowClassScore = 'button-sort-arrow';

    if (this.state.sortBy.method === 'date' && this.state.sortBy.reverse) {
      arrowClassDate = 'button-sort-arrow reverse';
    }

    if (this.state.sortBy.method === 'score' && this.state.sortBy.reverse) {
      arrowClassScore = 'button-sort-arrow reverse';
    }

    return (
      <div>
        <section className="reviews-filter">
          <h1 className="h1 h1-light">Recensioner</h1>
          <div className="container">
            <div className="reviews-filter-item reviews-filter-sort">
              <h2 className="title">Sortera</h2>
              <div className="buttons">
                <button className="button button-sort" onClick={() => { this.handleSortBy('date') }}>
                  <span>Datum</span>
                  <div className={arrowClassDate}>
                    <span className="arrow arrow-left"></span>
                    <span className="arrow arrow-right"></span>
                  </div>
                </button>
                <button className="button button-sort" onClick={() => { this.handleSortBy('score') }}>
                  <span>Betyg</span>
                  <div className={arrowClassScore}>
                    <span className="arrow arrow-left"></span>
                    <span className="arrow arrow-right"></span>
                  </div>
                </button>
              </div>
            </div>
            <div className="reviews-filter-item reviews-filter-search">
              <h2 className="title">Sök</h2>
              <input onKeyUp={this.searchHandler} ref={input => this.searchInput = input} className="input" placeholder="Sök efter namn, plats, kategori, prisklass" />
            </div>
          </div>

        </section>
        <ReviewsModule reviews={this.props.state.reviews} sortBy={this.state.sortBy} filter={this.state.searchValue} />
      </div>
    )
  }
}

export default Reviews