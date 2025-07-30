// Base Maps
// Selected from https://leaflet-extras.github.io/leaflet-providers/preview/index.html

let provider = L.tileLayer.provider;
let baseLayers = {
    'CartoDB': provider('CartoDB.Voyager'),
    'CartoDB (faint)': provider('CartoDB.VoyagerLabelsUnder'),
    'CartoDB Positron': provider('CartoDB.Positron'),
    'OpenStreetMap': provider('OpenStreetMap.Mapnik'),
    'Esri Topo': provider('Esri.WorldTopoMap'),
    'Esri Imagery': provider('Esri.WorldImagery'),
    // 'USGS Imagery Topo': provider('USGS.USImageryTopo'),
    'USGS Topo': provider('USGS.USTopo'),
};
var defaultBaseLayer = 'OpenStreetMap'; // var -> enable a different default
