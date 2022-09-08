// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let lightNav = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let darkNav = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// create a base map layer
let baseMaps = {
    "Day Navigation": lightNav,
    "Night Navigation": darkNav
};

//Create map object with center, zoom level, and defualt layer
let map = L.map('mapid', {
    center: [44.0, -80.0],
    zoom: 2,
    layers: [darkNav]
})

//pass map layers into layers control, and add control to map
L.control.layers(baseMaps).addTo(map);

// Access the flight routes GeoJSON URL
let torontoData = "https://raw.githubusercontent.com/SJSchmitt/Mapping_Earthquakes/Mapping_GeoJSON_Linestrings/Mapping_GeoJSON_Linestrings/torontoRoutes.json";

// Grab the GeoJSON data
d3.json(torontoData).then(function(data) {
    console.log(data);
    // create GeoJSON layer from retrieved data
    L.geoJSON(data, {
        color: "#ffffa1",
        weight: 2,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Airline: " + feature.properties.airline + "</h3> <hr> <h3> Destination: "
            + feature.properties.dst + "</h3>");
        }
    })
    .addTo(map);
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);