//restrict view of map
var southWest = L.latLng(47.35248575, 8.54693941),
    northEast = L.latLng(47.72887099, 9.49451021),
    mybounds = L.latLngBounds(southWest, northEast);

//creating map
var mymap = L.map('mapid', {
    maxZoom: 18,
    minZoom: 11,
    maxBounds: mybounds,

}).setView([47.603786, 9.055737], 11);

//creating layer of map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
}).addTo(mymap);

//Show scale meter on bottom left corner
L.control.scale().addTo(mymap);
