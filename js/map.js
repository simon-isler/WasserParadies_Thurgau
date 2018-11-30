var map = L.map('map', {
    minZoom: 11,
    maxZoom: 14, // Maximal max: 14
    zoomControl: false,
    attributionControl: false
}).setView([47.54, 9.075], 11);

L.tileLayer.wms('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var ogd = L.tileLayer.wms('http://map.geo.tg.ch//proxy/geofy_chsdi3/gewaesserkataster_gewaesser-gewaesserlauf?access_key=YoW2syIQ4xe0ccJA&', {
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    crs: L.CRS.EPSG4326,
    opacity: 1,
    identify: false,
    layers: 'Gewaessersystem'
}).addTo(map);
