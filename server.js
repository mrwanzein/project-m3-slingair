'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');

let userInfo;

/* ↓----------------------- Handlers functions -------------------------------------------------------↓ */
const handleFlightNumber = (req, res) => {
  const {flightNumber} = req.params;
  const regEx = /(SA)\d{3}/;

  if(flightNumber.match(regEx)){
    const selectedFlight = flights[flightNumber];
    res.status(200).send(selectedFlight);
  } else {
    res.status(400).send('Invalid flight number or flight is unavailable');
  }
}

const handleAvailableFlights = (req, res) => {

  if(flights){
    res.status(200).send(flights);
  } else {
    res.status(404).send('Cannot find ressourse');
  }
}

const handleForm = (req, res) => {

  if(flights){
    userInfo = req.body;
    res.status(200).send(req.body);
  } else {
    res.status(400).send('Enter correct input in correct fields');
  }
}

const sendUserInfo = (req, res) => {
  if(userInfo){
    res.status(200).send(userInfo);
  } else {
    res.status(404).send('Cannot find ressource');
  }
}

/* ↑----------------------- Handlers functions -------------------------------------------------------↑ */ 


express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get('/flights/:flightNumber', handleFlightNumber)
  .get('/available-flights', handleAvailableFlights)
  .post('/users', handleForm)
  .get('/get-user-info', sendUserInfo)

  .use((req, res) => res.send('Not Found'))
  .listen(8000, () => console.log(`Listening on port 8000`));
