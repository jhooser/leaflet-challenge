// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
shades = ["#e5f5f9","#99d8c9","#2ca25f"]
function colorChanger(number){
  if(number> 5){
    return shades[2]
  }
  if(number > 3){
    return shades[1]
  }
  else{
    return shades[0]
  }
};
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    //Experimental code
    // This will be run when L.geoJSON creates the point layer from the GeoJSON data.

function createCircleMarker( feature, latlng ){
    // Change the values of these options to change the symbol's appearance
    let options = {
      radius: (feature.properties.mag * 2),
      fillColor: colorChanger(feature.properties.mag),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    return L.circleMarker( latlng, options );
  }
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(data, {
        pointToLayer: createCircleMarker, // Call the function createCircleMarker to create the symbol for this layer
        onEachFeature:onEachFeature
      });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes); 
})
  function createMap(earthquakes) {
// Define variables for our base layers
var hiking = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.run-bike-hike",
    accessToken: API_KEY
  });
  
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

// Create a baseMaps object3
var baseMaps = {
  "Terrain": hiking,
  "Satellite Map": satellitemap
};

// Create an overlay object
var overlayMaps = {
    Earthquakes: earthquakes    
};

// Define a map object
var myMap = L.map("map", {
  center: [37.960666, -95.715244],
  zoom: 5,
  layers: [hiking,earthquakes]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var legend = L.control({position: "bottomleft"});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = [0,3,5];
  var colors = shades;
  var labels = [];

  // Add min & max
  var legendInfo = "<h1>Median Income</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

legend.addTo(map);
}