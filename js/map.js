// Globale Variablen
var mapname = 'mapbox.light';
var dataLayerName = 'entwaesserungsgraben';
var wmsLayer = '';
var maplayer = '';
var legend = L.control({position: 'bottomright'});

//restrict view of map
const topLeftCorner = L.latLng(47.7157, 8.6538);
const bottomRightCorner = L.latLng(47.3730, 9.47);
const maxBounds = L.latLngBounds(topLeftCorner, bottomRightCorner);

var mymap = L.map('map', {
    maxBounds: maxBounds,
    maxZoom: 14,
    minZoom: 11,
    zoomControl: false,
    attributionControl: false
}).setView([47.54, 9.075], 11);

// Handle zooming/scrolling
mymap.scrollWheelZoom.disable();

// control that shows state info on hover
var info = L.control({position: 'topleft'});

// Add zoom control
var zoom = L.control.zoom({
    position: 'topright'
});
zoom.addTo(mymap);

//Show scale meter on bottom left corner
L.control.scale().addTo(mymap);

// Chane map style
function changeMapStyle(name) {
    //Remove every layer on the map
    if(maplayer !== '')
        mymap.removeLayer(maplayer);
    if(wmsLayer !== '')
        mymap.removeLayer(wmsLayer);

    //Add new layer to map
    maplayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: name,
        format: 'images/png',
        accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
    }).addTo(mymap);


    //Add data layer over ground layer
    if(wmsLayer !== '')
        wmsLayer.addTo(mymap);
}

function changeLayer(thisId){
    //remove data layer & legend
    if(wmsLayer !== '')
        mymap.removeLayer(wmsLayer);
        legend.remove(mymap);

    //check, if checkbox is checked or not, if it's checked then draw layer
    if(document.getElementById(thisId).checked)
        dataLayerName = thisId;
    else
        dataLayerName = '';

    wmsLayer = L.tileLayer.wms('http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&', {
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        opacity: 1,
        identify: false,
        layers: dataLayerName
    }).addTo(mymap);

    // Legende
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var url = 'http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=' + dataLayerName + '&format=image/png&STYLE=default';
        div.innerHTML += '<h4>Legende</h4><br>' +
            '<img src='+url+' alt="legend" class="img-fluid" style="width: 100%; display: block;">';

        return div;
    };
    legend.addTo(mymap);
}

//Add Event Listener for radio buttons
document.getElementById("tgKarteStreets").addEventListener("click", function () {
    mapname = 'mapbox.streets';
    changeMapStyle(mapname);
});
document.getElementById("tgKarteLight").addEventListener("click", function () {
    mapname = 'mapbox.light';
    changeMapStyle(mapname);
});
document.getElementById("tgKarteSatellite").addEventListener("click", function () {
    mapname = 'mapbox.satellite';
    changeMapStyle(mapname);
});

// generate map
changeMapStyle(mapname);
