class MarkerSymbolizer {
    constructor(map) {
        this.map = map;
    }

    popupContent(props) {
        let popupText = `<p><strong>${props.name}</strong>`;
        if (props.undefined) {        // doesn't seem to be anything else useful
            popupText += `<br/>${props.undefined},`;
        } else {
            popupText += '<br/>';
        }
        popupText += '</p>';
        return popupText;
    }

    symbolizeMarker(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(this.popupContent(feature.properties));
        }
    }

    addMarkersToMap(markers) {

        // Arrange that markers in the approximately same location will get clustered
        let clusters = L.markerClusterGroup();

        // ... and add markers for each feature
        let markerLayer = L.geoJSON(markers, {
            onEachFeature: this.symbolizeMarker
        });

        // Cluster the markers
        markerLayer.addTo(clusters);

        // Add the clusters to the map
        this.map.addLayer(clusters);

        // And fit the map to the markers' extent
        this.map.fitBounds(markerLayer.getBounds())
        return clusters
    }
}

class MapDataLoader {
    constructor() {
        this.map = null;
        this.dataLayer = null;
        this.cluster = false;
    }

    // Style function for different feature types
    styleFeature(feature) {
        const props = feature.properties;

        // Different styles based on feature type or properties
        if (props.name && props.name.toLowerCase().includes('track')) {
            return { color: '#ff7800', weight: 4, opacity: 0.8 };
        } else if (props.name && props.name.toLowerCase().includes('route')) {
            return { color: '#0078ff', weight: 3, opacity: 0.8 };
        }
        return { color: '#3388ff', weight: 2, opacity: 0.8 };
    }

    // Add popup content to features
    describeFeature(feature, layer) {
        let popupContent = '';

        if (feature.properties.name) {
            popupContent += `<strong>${feature.properties.name}</strong>`;
        }
        if (feature.properties.description || feature.properties.desc) {
            const text = feature.properties.description || feature.properties.desc;
            popupContent += popupContent ? `<br>${text}` : text;
        }

        if (popupContent) {
            layer.bindPopup(popupContent);
        }
    }

    // add popups for markers, styling for non-points
    symbolizeFeatures(layer) {
        // Apply styling and features
        layer.eachLayer((sublayer) => {
            if (sublayer.feature) {
                // Apply popup descriptions
                this.describeFeature(sublayer.feature, sublayer);

                // Apply styling for lines
                if (sublayer.setStyle && sublayer.feature.geometry.type !== 'Point') {
                    sublayer.setStyle(this.styleFeature(sublayer.feature));
                } else {
                    console.log("Point feature " + sublayer.feature);
                }
            } else {
                console.log("sublayer non feature?:" + sublayer);
            }
        })
    }

    // Load data using omnivore
    loadDataFile(filePath) {
        return new Promise((resolve, reject) => {
            const fileExtension = filePath.split('.').pop().toLowerCase();
            let layer;

            // Use appropriate omnivore method based on file type
            if (fileExtension === 'kml') {
                layer = omnivore.kml(filePath);
            } else if (fileExtension === 'gpx') {
                layer = omnivore.gpx(filePath);
            } else {
                reject(new Error('Unsupported file format. Please use KML or GPX files.'));
                return;
            }

            // Set up event handlers
            layer.on('ready', () => {
                if (this.cluster) {
                    // Arrange that markers in the approximately same location will get clustered
                    let clusterLayer = L.markerClusterGroup();
                    clusterLayer.addLayer(layer);
                    resolve(clusterLayer);
                } else {
                    this.symbolizeFeatures(layer);
                    resolve(layer);
                }
            });

            layer.on('error', (e) => {
                let msg = new Error(`Failed to load or parse the file: ${e.error?.message || 'Unknown error'}`)
                reject(msg);
            });
        });
    }

    // Initialize the map and load data
    async initializeMapData(map, reset, cluster) {
        try {
            this.map = map;
            this.cluster = cluster;

            // Get file path from hidden element
            const dataElement = document.getElementById('data-file-path');
            const filePath = dataElement.getAttribute('data-file');

            if (!filePath) {
                throw new Error('No data file specified');
            }

            // Load and add the data
            this.dataLayer = await this.loadDataFile(filePath);

            // Check if we have any data
            const bounds = this.dataLayer.getBounds();
            if (bounds.isValid()) {
                document.getElementById('loading').style.display = 'none';
                this.dataLayer.addTo(this.map);
                this.map.fitBounds(bounds, { padding: [20, 20] });
                reset.update();
            } else {
                throw new Error('No geographic features found in ' + filePath);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
        document.getElementById('loading').style.display = 'none';
        console.log("Error: " + message);
    }
}
