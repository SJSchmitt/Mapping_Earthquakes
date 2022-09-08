// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// create a base map layer
let baseMaps = {
    Street: streets,
    Satellite: satelliteStreets
};

//Create map object with center, zoom level, and defualt layer
let map = L.map('mapid', {
    center: [43.7, -79.3],
    zoom: 11,
    layers: [streets]
})

//pass map layers into layers control, and add control to map
L.control.layers(baseMaps).addTo(map);

// Access the Toronto Neighborhoods GeoJSON URL
let torontoHoods = "https://raw.githubusercontent.com/SJSchmitt/Mapping_Earthquakes/Mapping_GeoJSON_Polygons/Mapping_GeoJSON_Polygons/torontoNeighborhoods.json";

// Grab the GeoJSON data
d3.json(torontoHoods).then(function(data) {
    console.log(data);
    // create GeoJSON layer from retrieved data
    L.geoJSON(data, {
        color: "blue",
        weight: 1,
        fillColor: "#ffff41",
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Neighborhood: " + feature.properties.AREA_NAME + "</h3>");
        }
    })
    .addTo(map);
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);