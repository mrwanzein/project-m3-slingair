let userData;

fetch('/get-user-info')
.then(res => res.json())
.then(data => userData = data)
.catch((err) => console.log(err));
