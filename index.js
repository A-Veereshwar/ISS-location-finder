//Section for making map and tiles
const url = "https://api.wheretheiss.at/v1/satellites/25544";
const map = L.map('locateISS').setView([50.505, 30.57], 5);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', 
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

// For showing latitude and longitude when clicked at a place on Map.
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

//ISS marker image icon display.
const myIcon = L.icon({
    iconUrl: 'src/issImg.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16],
    popupAnchor: [0,-20]
});

//Defining the marker
const marker = L.marker([50.505, 30.57], {icon: myIcon}).addTo(map).bindPopup(`Hello! <br>I'm here.`).openPopup();

//To get the current time
function updateTime(){
    let time = new Date();
   let currHours = time.getHours();
   let currMins = time.getMinutes();
   let currSecs = time.getSeconds();
   return {currHours, currMins, currSecs};
}

let fixZoom = true;

//To get the latitude and longitude from the whereisiss.at API
async function ISS_Position(){
    const data = await fetch(url);
    const response = await data.json();
    const {altitude, latitude, longitude} = response;
    marker.setLatLng([latitude,longitude]);
    if(fixZoom){
        map.setView([latitude,longitude],5);
        fixZoom = false;
    }
    let currHours = updateTime().currHours;
    let currMins = updateTime().currMins;
    let currSecs = updateTime().currSecs;
    if((currHours >= 18 && currHours <= 24) || (currHours >= 0 && currHours <= 5)){
        document.body.style.background = "black";
        document.body.style.color = "white";
    }else if((currHours > 5 && currHours < 18)){
        document.body.style.background = "white";
        document.body.style.color = "black";
    }
    document.getElementById("altitude").textContent = altitude.toFixed(6);
    document.getElementById("latitude").textContent = latitude.toFixed(6);
    document.getElementById("longitude").textContent = longitude.toFixed(6);
    document.getElementById("time").innerText = String(currHours)+" : "+ String(currMins)+" : "+String(currSecs);
}
function toggleVisibility() {
    const elements = ["altitude", "latitude", "longitude"];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
        } else {
            element.style.visibility = 'hidden';
        }
    });
}
//Function to display the  latitude and longitude whenever we refresh the page.
ISS_Position();
setInterval(ISS_Position,1000);
setInterval(toggleVisibility,600);