'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const rp = require('request-promise');
const journeyAPIurl = 'https://journeyedu.herokuapp.com';

let userInfo;

// ↓Fetch functions to journeyedu.herokuapp.com API↓
const getUsersFromDB = () => {
  return rp(`${journeyAPIurl}/slingair/users`)
  .then(data => JSON.parse(data))
  .catch(err => console.log(err));
}

const getFlightsFromDB = () => {
  return rp(`${journeyAPIurl}/slingair/flights`)
  .then(data => JSON.parse(data).flights)
  .catch(err => console.log(err));
}

const getSpecificFlightsFromDB = (flightNum) => {
  return rp(`${journeyAPIurl}/slingair/flights/${flightNum}`)
  .then(data => JSON.parse(data)[flightNum])
  .catch(err => console.log(err));
}

const addReservationToDB = (userPayLoad) => {
  const { email, flight, givenName, id, seat, surname } = userPayLoad;

  return rp({
    method: 'POST',
    uri: `${journeyAPIurl}/slingair/users`,
    body: {
      email,
      flight,
      givenName,
      id,
      seat,
      surname
    },
    json: true // Automatically stringifies the body to JSON
  })
}
// ↑Fetch functions to journeyedu.herokuapp.com API↑

/* ↓----------------------- Handlers functions -------------------------------------------------------↓ */
const handleFlightNumber = (req, res) => {
  const {flightNumber} = req.params;
  const regEx = /(SA)\d{3}/;

    if(flightNumber.match(regEx)){
      getSpecificFlightsFromDB(flightNumber)
      .then(flightSeatData => {
        res.status(200).send(flightSeatData);
      })
    } else {
      res.status(400).send('Invalid flight number or flight is unavailable');
    }
  
}

const handleAvailableFlights = (req, res) => {
  getFlightsFromDB()
  .then(data => {
    if(data){
      res.status(200).send(data);
    } else {
      res.status(404).send('Cannot find ressourse');
    }
  })
  .catch(err => console.log(err));

}

const handleForm = (req, res) => {

  getUsersFromDB()
  .then(data => {
    if(data) {
      userInfo = req.body;
      userInfo.id = uuidv4();
      res.status(200).send(userInfo);
    } else {
      res.status(400).send('Enter correct input in correct fields');
    }
  })
  .then(() => {
    return addReservationToDB(userInfo);
  })
  .catch(err => console.log(err));

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
  
  getUsersFromDB()
  .then(listOfUsers => listOfUsers.find(user => user.email === email))
  .then(user => userInfo = user)
  .then(() => {
      if(userInfo){
        res.status(200).redirect('/view-reservation');
      } else {
        res.status(400).send('Cannot find user');
      }
    }
  )
  .catch(err => console.log(err))
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
