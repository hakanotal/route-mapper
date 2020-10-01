const myMap = L.map('map').setView([37.89135, 32.48464], 12);

var markers = new L.layerGroup();

let check = 0;
function checkBox(){
  if(check == 0){
    check = 1;
    myMap.addLayer(markers);
  } 
  else {
    check = 0;
    myMap.removeLayer(markers);
  }
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

var start = L.icon({
  iconUrl: 'images/start.png',
  iconSize: [30, 40],
  iconAnchor: [15, 20],
  shadowUrl: 'images/shadow.png',
});

var end = L.icon({
  iconUrl: 'images/end.svg',
  iconSize: [30, 40],
  iconAnchor: [15, 20],
  shadowUrl: 'images/shadow.png',
});

async function getResponse(){
  try {
    const response = await fetch('markers');
    const data = await response.json();
    console.log(data);
    putData(data);
  } 
  catch (error) {
    console.error(error);
  }
}

function putData(data){
  for(activity of data.res){     
    var coordinates = L.Polyline.fromEncoded(activity.map.summary_polyline).getLatLngs()

    L.polyline(
      coordinates,
      {
        color: 'blue',
        opacity: 0.4,
        weight: 4,
        lineJoin: 'round'
      }
    ).addTo(myMap).bindPopup(`${activity.name}<br/>${activity.start_date.split("T")[0]}<br/>${activity.distance} m`);

    var startMarker = L.marker(
                        coordinates[0], 
                        {icon: start}
                      ).addTo(myMap);
    markers.addLayer(startMarker);
    
    var endMarker = L.marker(
                        coordinates[coordinates.length-1], 
                        {icon: end}
                      ).addTo(myMap);
    markers.addLayer(endMarker);
  }
  myMap.addLayer(markers);
  myMap.removeLayer(markers);

  document.getElementById("r").innerHTML = data.r;
  document.getElementById("d").innerHTML = data.d;
  document.getElementById("e").innerHTML = data.e;

  document.getElementById("map").style.visibility = "visible";
  document.getElementById("spinner").style.display = "none";
}

getResponse();