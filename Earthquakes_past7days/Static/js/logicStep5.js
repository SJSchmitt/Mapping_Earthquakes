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

//create earthquake overlay layer
let earthquakes = new L.layerGroup();

// define object to contain overlays
let overlays = {
    Earthquakes: earthquakes
};

//Create map object with center, zoom level, and defualt layer
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})

//pass map layers into layers control, and add control to map
L.control.layers(baseMaps, overlays).addTo(map);

// Access the earthquake GeoJSON URL
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the GeoJSON data
d3.json(earthquakeData).then(function(data) {
    // return style information for each data point
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            // determine color based on magnitude
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            // determine radius based on magnitude
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // function to determine radius of marker based on magnitude of earthquake
    function getRadius(magnitude) {
        // plot earthquakes with a magnitude of 0 with a radius of 1
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }
    // function to choose marker color based on magnitude of earthquake
    function getColor(magnitude) {
        if (magnitude > 5) {
        return "#ea2c2c";
        }
        if (magnitude > 4) {
        return "#ea822c";
        }
        if (magnitude > 3) {
        return "#ee9c00";
        }
        if (magnitude > 2) {
        return "#eecc00";
        }
        if (magnitude > 1) {
        return "#d4ee00";
        }
        return "#98ee00";
    }

    // create GeoJSON layer from retrieved data
    L.geoJSON(data, {
        // turn each feature to a circleMarker on the earthquake overlay
        pointToLayer: function(feature, latlng) {
            //console.log(data);
            return L.circleMarker(latlng);
        },
        // add style as defined by styleInfo function
        style: styleInfo,
        // create a popup for each circleMarker displaying magnitude and location
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);
    // add earthquake markers to map
    earthquakes.addTo(map);
});

// create a legend control object
let legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
     }
    return div;
};

legend.addTo(map);

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);