import Card from './../data/Card';

import Reflux from 'reflux';
import {CardActions} from './../actions';

import React from 'react-native';
var {
  AsyncStorage
} = React;

const CARD_KEY = 'zebreto-cards';

var cardsStore = Reflux.createStore({
  init() {
    this._loadCards().done();
    this.listenTo(CardActions.createCard, this.createCard);
    this._cards = [];
    this.trigger([]);
  },

  async _loadCards() {
    try {
      var val = await AsyncStorage.getItem(CARD_KEY);
      if (val !== null) {
        this._cards = JSON.parse(val).map((cardObj) => {
          return Card.fromObject(cardObj);
        });
        this.emit();
      }
      else {
        console.info(`${CARD_KEY} not found on disk.`);
      }
    } catch (error) {
      console.error('AsyncStorage error: ', error.message);
    }
  },

  async _writeCards() {
    try {
      await AsyncStorage.setItem(CARD_KEY, JSON.stringify(this._cards));
    } catch (error) {
      console.error('AsyncStorage error: ', error.message);
    }
  },

  createCard(front, back, deckID) {
    this._cards.push(new Card(front, back, deckID));
    this._writeCards().done();
    this.emit();
  },

  emit() {
    this.trigger(this._cards);
  }
});

module.exports = cardsStore;