//creating map
var mymap = L.map('mapid', {
    maxBounds: mybounds,
    maxBoundsViscosity: 1.0,
    maxZoom: 18,
    minZoom: 11,
    transparent: true,
    zoomControl: false,
    crs: L.CRS.EPSG2056
}).setView([47.603786, 9.055737], 11);

//restrict view of map
var southWest = L.latLng(47.35248575, 8.54693941),
    northEast = L.latLng(47.72887099, 9.49451021),
    mybounds = L.latLngBounds(southWest, northEast);

//Show scale meter on bottom left corner
L.control.scale().addTo(mymap);

// Chane map style
function changeMapStyle(mapName) {
    //Remove every layer on the map
    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });

    //Redraw new layer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: mapName,
        accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
    }).addTo(mymap);
}

// Add data
function dataLayer(){

}

//Add Event Listener for radio buttons
document.getElementById("tgKarteStreets").addEventListener("click", function () {
    changeMapStyle('mapbox.streets');
});
document.getElementById("tgKarteLight").addEventListener("click", function () {
    changeMapStyle('mapbox.light');
});
document.getElementById("tgKarteSatellite").addEventListener("click", function () {
    changeMapStyle('mapbox.satellite');
});

// execute
changeMapStyle('mapbox.light');
dataLayer();