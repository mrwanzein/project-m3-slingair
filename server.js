'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations');

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
    userInfo.id = uuidv4();
    reservations.push(userInfo);

    // To test ids of other users
    console.log(reservations)

    res.status(200).send(userInfo);
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

const viewUserFlightWithEmail = (req, res) => {
  const {email} = req.params;
  
  const user = reservations.find(user => user.email === email);
  userInfo = user
  
  if(user){
    res.status(200).redirect('/view-reservation');
  } else {
    res.status(400).send('Cannot find user');
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
  .get('/view-reservation/:email', viewUserFlightWithEmail)

  .use((req, res) => res.send('Not Found'))
  .listen(8000, () => console.log(`Listening on port 8000`));
