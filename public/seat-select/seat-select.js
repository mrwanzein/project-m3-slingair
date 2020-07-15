const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

const availableFlightOptions = document.getElementsByTagName('datalist')[0];

// fetching the available flights for the input list
const getAvailableFlights = async () => {
    await fetch('/available-flights')
    .then(res => res.json())
    .then(data => {
        // Make the available flight input a list of available flights
        Object.keys(data).forEach(flightNumber => {
            let input = document.createElement('option');
            input.setAttribute('value', `${flightNumber}`)
            availableFlightOptions.append(input);
        });
    })
    .catch(err => console.log(err));
}

getAvailableFlights();

let selection = '';

const renderSeats = (unvailableSeatsIds) => {
    //console.log(unavailableSeats)
    document.querySelector('.form-container').style.display = 'block';
    while (seatsDiv.firstChild) {
        seatsDiv.removeChild(seatsDiv.lastChild);
      }

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li');

            // Two types of seats to render
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        
            
            // TODO: render the seat availability based on the data...
            if(unvailableSeatsIds.includes(seatNumber)){
                seat.innerHTML = seatOccupied;
            } else {
                seat.innerHTML = seatAvailable;
            }
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}


const toggleFormContent = (event) => {
    const flightNumber = flightInput.value;
    
    fetch(`/flights/${flightNumber}`)
        .then(res => res.json())
        .then(data => {
            // Sending to renderSeats() the ids of the unvailable seats
            const unvailableSeats = data.filter(seatDetail => seatDetail.isAvailable === false);
            const unvailableSeatsIds = unvailableSeats.map(seat => seat.id);

            renderSeats(unvailableSeatsIds);
        })
        .catch(err => console.log(err));
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    // TODO: everything in here!
    fetch('/users', {
        method: 'POST',
        body: JSON.stringify({
            'givenName': document.getElementById('givenName').value
        }),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })

}

flightInput.addEventListener('blur', toggleFormContent);