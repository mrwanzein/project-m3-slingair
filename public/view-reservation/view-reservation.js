let userFlightNumber = document.getElementById('user-flight-number');
let userSeatNumber = document.getElementById('user-seat-number');
let userFullName = document.getElementById('user-full-name');
let userEmail = document.getElementById('user-email');

let userData;

fetch('/get-user-info')
.then(res => res.json())
.then(data => {
    userData = data
    userFlightNumber.innerHTML = userData.flight;
    userSeatNumber.innerHTML = userData.seat;
    userFullName.innerHTML = `${userData.givenName} ${userData.surname}`;
    userEmail.innerHTML = userData.email;
})
.catch((err) => console.log(err));
