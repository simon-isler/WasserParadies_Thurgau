var mapname = 'mapbox.light';
var dataLayerName = '';

var mymap = L.map('mapid', {
    maxBounds: mybounds,
    maxBoundsViscosity: 1.0,
    maxZoom: 18,
    minZoom: 3,
    transparent: true
}).setView([47.603786, 9.055737], 11);

//restrict view of map
var southWest = L.latLng(47.35248575, 8.54693941),
    northEast = L.latLng(47.72887099, 9.49451021),
    mybounds = L.latLngBounds(southWest, northEast);

//Show scale meter on bottom left corner
L.control.scale().addTo(mymap);

// Chane map style
function changeMapStyle(mapName, dataName) {
    //Remove every layer on the map
    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });

    //Redraw new layer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: mapName,
        format: 'images/png',
        accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
    }).addTo(mymap);

    var wmsLayer = L.tileLayer.wms('http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&', {
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        opacity: 1,
        identify: false,
        layers: dataName
    }).addTo(mymap);

}

//Add Event Listener for radio buttons
document.getElementById("tgKarteStreets").addEventListener("click", function () {
    mapname = 'mapbox.streets';
    changeMapStyle(mapname, dataLayerName);
});
document.getElementById("tgKarteLight").addEventListener("click", function () {
    mapname = 'mapbox.light';
    changeMapStyle(mapname, dataLayerName);
});
document.getElementById("tgKarteSatellite").addEventListener("click", function () {
    mapname = 'mapbox.satellite';
    changeMapStyle(mapname, dataLayerName);
});

// generate map
changeMapStyle(mapname, dataLayerName);

