/*
*   map.js
*
*   This file generates a leaflet map with several functions (legend, layer, sidebar, etc.).
*
*   Date: 01.12.2018
*   Author: Simon Isler, Jan Oberhänsli
*
*/

// global variables
var mapname = 'mapbox.light';
var dataLayerName = 'entwaesserungsgraben';
var wmsLayer = '';
var maplayer = '';
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;

//restrict view of map
const topLeftCorner = L.latLng(47.8157, 8.2538);
const bottomRightCorner = L.latLng(47.2730, 9.77);
const maxBounds = L.latLngBounds(topLeftCorner, bottomRightCorner);

// Init map
var map = L.map('map', {
    maxBounds: maxBounds,
    maxZoom: 17,
    minZoom: 9,
    attributionControl: false
}).setView([47.54, 9.075], 11);

// change map zoom according to screen width & height
function resizeMap() {
    if (width < 768) {
        map.setZoom(10);
    } else if (width > 1599 && height > 1300) {
        map.setZoom(12);
    } else {
        map.setZoom(11);
    }
}

resizeMap();

// change map zoom according to screen width & height if window gets smaller
window.addEventListener('resize', function () {
    // get the width of the screen after the resize event
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    resizeMap();
});

// Map options
map.scrollWheelZoom.disable(); // handle zooming/scrolling

var zoom = L.control.zoom({ // add zoom control
    position: 'topright'
});
zoom.addTo(map);

L.control.scale().addTo(map); // show scale meter on bottom left corner

var sidebar = L.control.sidebar({ // add sidebar
    container: 'sidebar'
});
sidebar.addTo(map);

var legend = L.control({position: 'bottomright'}); // add legend

// function to check if website is online
function isSiteOnline(url, callback) {
    var img = document.createElement("img");
    img.src = url + "/favicon.ico";

    img.onload = function () {
        callback(true);
    };

    img.onerror = function () {
        callback(false);
    };
}

// change map style
function changeMapStyle(name) {
    // map API url
    var mapApi = "https://api.openstreetmap.org/";

    // check if Site is online
    isSiteOnline(mapApi, function (found) {
        // site is online
        if (found) {
            //Remove previous layer on the map
            if (maplayer !== '') {
                map.removeLayer(maplayer);
            }

            //Add new layer to map
            maplayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: name,
                format: 'images/png',
                accessToken: 'pk.eyJ1IjoiamFub2JlMiIsImEiOiJjam00b3Vpa2wzZjNoM3BxbmJtams3Z2U0In0.ZOdhoX3gBfEJkGy0-w8Bwg'
            }).addTo(map);

            // show loading icon
            addSpinner(maplayer);

            //Move wmslayer to front
            if (wmsLayer !== '') {
                wmsLayer.bringToFront();
            }
        }

        // site is offline
        else {
            alert("Die Map konnte nicht geladen werden! Versuchen Sie die Seite neuzuladen!");
        }
    });
}

// removes all data (used for no display option bullet point)
function removeAll() {
    map.removeLayer(wmsLayer);
    legend.remove(map);
}

// change wms layer
function changeLayer(id) {
    // save id of radio button
    dataLayerName = id;

    // WMS data URL
    var imgUrl = "https://map.geo.tg.ch/proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&Service=WMS&Version=1.3.0&Request=GetCapabilities&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=" + dataLayerName + "&CRS=EPSG%3A2056&STYLES=&WIDTH=650&HEIGHT=390&BBOX=2690000%2C1246000%2C2755000%2C1285000";

    // check if Site is online
    isSiteOnline(imgUrl, function (found) {
        // site is online
        if (found) {
            //remove previous data layer & legend
            if (wmsLayer !== '') {
                map.removeLayer(wmsLayer);
                legend.remove(map);
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

            // show legend (if legend has only one item, then do not display)
            if (dataLayerName === 'entwaesserungsgraben' || dataLayerName === 'fliessgewaesser' || dataLayerName === 'Stehendes_Gewaesser') {
                legend.onAdd = function () {
                    // create legend
                    var div = L.DomUtil.create('div', 'info legend');
                    var url = 'http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=' + dataLayerName + '&format=image/png&STYLE=default';
                    div.innerHTML += '<h4>Legende</h4><br>' +
                        '<img src=' + url + ' alt="legend" class="legend">';
                    return div;
                };
                legend.addTo(map);
            }
        }
        // data is offline
        else {
            alert("Die WMS-Daten konnten nicht geladen werden! Versuchen Sie die Seite neuzuladen!");
        }
    });
}

// loading icon
function addSpinner(layer) {
    var runningSpinner = false;
    const spinnerMap = document.getElementsByClassName('spinner')[0];
    const spinnerMap1 = document.getElementsByClassName('spinner')[1];

    // data is loading
    layer.on('tileload', function () {
        if (!runningSpinner) {
            spinnerMap.style.display = 'block';
            spinnerMap1.style.display = 'block';
            runningSpinner = true;
        }

    });

    // no data is loading
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