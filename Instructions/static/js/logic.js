const API_KEY = "pk.eyJ1IjoiY2hleWVubmVwYXJyb3R0IiwiYSI6ImNraGJhZnp6czBkbG0ycnNhMWozcGpsYWMifQ.lL6x_cnw_ya4MtHSvTJ_gA"

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl, function(data) {

    createFeatures(data.features);
    console.log(data.features)
  });

function circleFeatures(Magnitude){
    if (Magnitude <= 1) return "greenyellow"
    else if (Magnitude <= 2) return "yellow"
    else if (Magnitude <= 3) return "blue"
    else if (Magnitude <= 4) return "orange"
    else if (Magnitude <= 5) return "red"
    else return "darkred"
};

function sizeFeatures(Magnitude){
    // if (Magnitude === 1) return 1
    return (Magnitude *10000)

}

  function createFeatures(earthquakeData) {
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
   
    var earthquakes = L.geoJSON(earthquakeData, {

      onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "Magnitude" + feature.properties.mag + "</p>");
      },
        pointToLayer: function (feature, latlong){
            return new L.circle(latlong,
                {
                    radius: sizeFeatures(feature.properties.mag),
                    color: "grey",
                    fillColor: circleFeatures(feature.properties.mag),
                    opacity: .3,
                    fillOpacity: 1

                }
                )
        }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,     
     zoomOffset: -1,
     id: "mapbox/outdoors-v11",
    accessToken: API_KEY
 });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

// var earthquakes = new L.LayerGroup()

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

var legend = L.control({ position: "bottomleft"});
legend.onAdd= function(){
    var div = L.DomUtil.create('div', "legend info"), Magnitude = [0,1,2,3,4,5];
    for (var i=0; i<Magnitude.length; i++) {
        div.innerHTML += '<i style= "background: ' + circleFeatures(Magnitude[i]+1) + '" ></i> ' + 
        + Magnitude[i] + (Magnitude[i+1] ? ' - ' + Magnitude[i+1] + ' <br> ' : '+'); 

    }
    return div;
};
legend.addTo(myMap);

}


