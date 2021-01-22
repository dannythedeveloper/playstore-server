/* eslint-disable no-console */
/* eslint-disable strict */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('common'));
app.use(cors());


const apps = require('./playstore-data');

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let results = apps;

  if(sort) {
    if(!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
  }

  if(sort === 'app') {
    results = apps.sort((a, b) => {
      let x = a['App'].toLowerCase();
      let y = b['App'].toLowerCase();

      return x > y ? 1 : x < y ? -1 : 0;
    });
  } else if (sort === 'rating') {
    results = results.sort((a, b) => {
      return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
    });
  }

  if(genres) {
    if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genre must be one of action, puzzle, strategy, casual, arcade, or card');
    }
    results = results.filter(app => {
      return app.Genres.toLowerCase() === genres.toLowerCase();
    });
  }


  res
    .json(results);
});

module.exports = app;
