/*
*   map.js
*
*   This file generates a leaflet map with several functions (legend, layer, sidebar, etc.).
*
*   Date: 01.12.2018
*   Author: Simon Isler, Jan Oberhänsli
*
*/

// Global variables
var mapname = 'mapbox.light';
var dataLayerName = 'entwaesserungsgraben';
var wmsLayer = '';
var maplayer = '';

//restrict view of map
const topLeftCorner = L.latLng(47.7157, 8.6538);
const bottomRightCorner = L.latLng(47.3730, 9.47);
const maxBounds = L.latLngBounds(topLeftCorner, bottomRightCorner);

// Init map
var map = L.map('map', {
    maxBounds: maxBounds,
    maxZoom: 12,
    minZoom: 10,
    zoomControl: false,
    attributionControl: false
}).setView([47.54, 9.075], 11);

// change map zoom according to screen width
window.addEventListener('resize', function(event){
    // get the width of the screen after the resize event
    var width = document.documentElement.clientWidth;

    // tablets are between 768 and 922 pixels wide
    // phones are less than 768 pixels wide
    if (width < 768) {
        // set the zoom level to 10
        map.setZoom(10);
    } else if (width > 1599) {
        map.setZoom(12);
    }
    else {
        // set the zoom level to 8
        map.setZoom(11);
    }
});

// Map options
map.scrollWheelZoom.disable(); // handle zooming/scrolling

var zoom = L.control.zoom({ // add zoom control
    position: 'topright'
}); zoom.addTo(map);

L.control.scale().addTo(map); // show scale meter on bottom left corner

var sidebar = L.control.sidebar({ // sidebar
    container: 'sidebar'
}); sidebar.addTo(map);

var legend = L.control({position: 'bottomright'}); // legend

// change map style
function changeMapStyle(name) {
    //Remove every layer on the map
    if (wmsLayer !== '') {
        map.removeLayer(wmsLayer);
    }

    if (dataLayerName !== '') {
        //Add new layer to map
        maplayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: name,
            format: 'images/png',
            accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
        }).addTo(map);

        // show loading icon
        addSpinner(maplayer);

        //Add data layer onto the ground layer
        if (wmsLayer !== '') {
            wmsLayer.addTo(map);
        }
    }
}

// event listener for radio buttons to change the map style
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

// change layer
function changeLayer(thisId) {
    //remove data layer & legend
    if (wmsLayer !== '') {
        map.removeLayer(wmsLayer);
        legend.remove(map);
    }

    //check, if checkbox is checked or not, if it's checked then draw layer
    if (dataLayerName !== '') {
        if (document.getElementById(thisId).checked) {
            dataLayerName = thisId;
        } else {
            dataLayerName = '';
        }

        // add wms layer
        wmsLayer = L.tileLayer.wms('http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&', {
            version: '1.3.0',
            format: 'image/png',
            transparent: true,
            crs: L.CRS.EPSG4326,
            opacity: 1,
            identify: false,
            layers: dataLayerName
        }).addTo(map);

        // show loading icon
        addSpinner(wmsLayer);

        // show legend (if legend shows only one item, then do not display)
        if (dataLayerName === 'entwaesserungsgraben' || dataLayerName === 'fliessgewaesser' || dataLayerName === 'Stehendes_Gewaesser') { //Data with multiple items in legend
            legend.onAdd = function () {
                // create legend
                var div = L.DomUtil.create('div', 'info legend');
                var url = 'http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=' + dataLayerName + '&format=image/png&STYLE=default';
                div.innerHTML += '<h4>Legende</h4><br>' +
                    '<img src=' + url + ' alt="legend" width="auto" height="auto">';
                return div;
            };
            legend.addTo(map);
        }
    }
}

// add loading icon
function addSpinner(layer) {
    var runningSpinner = false;
    const spinnerMap = document.getElementsByClassName('spinner')[0];
    const spinnerMap1 = document.getElementsByClassName('spinner')[1];

    layer.on('tileload', function () {
        if (!runningSpinner) {
            spinnerMap.style.display = 'block';
            spinnerMap1.style.display = 'block';
            runningSpinner = true;
        }

    });
    layer.on('load', function () {
        if (!layer.isLoading()) {
            spinnerMap.style.display = 'none';
            spinnerMap1.style.display = 'none';
            runningSpinner = false;
        }
    });
}

// generate map
changeMapStyle(mapname);