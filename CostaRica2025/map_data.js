class MapDataLoader {
    constructor() {
        this.map = null;
        this.dataLayer = null;
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

    // Point styling for markers
    pointStyle(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 6,
            fillColor: '#ff4444',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
    }

    // Add popup content to features
    onEachFeature(feature, layer) {
        let popupContent = '';

        if (feature.properties.name) {
            popupContent += `<strong>${feature.properties.name}</strong>`;
        }
        if (feature.properties.description || feature.properties.desc) {
            const desc = feature.properties.description || feature.properties.desc;
            popupContent += popupContent ? `<br>${desc}` : desc;
        }

        if (popupContent) {
            layer.bindPopup(popupContent);
        }
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
                // Apply styling and features
                layer.eachLayer((sublayer) => {
                    if (sublayer.feature) {
                        // Apply popup functionality
                        this.onEachFeature(sublayer.feature, sublayer);

                        // Apply styling for lines
                        if (sublayer.setStyle && sublayer.feature.geometry.type !== 'Point') {
                            sublayer.setStyle(this.styleFeature(sublayer.feature));
                        }
                    }
                });

                resolve(layer);
            });

            layer.on('error', (e) => {
                let msg = new Error(`Failed to load or parse the file: ${e.error?.message || 'Unknown error'}`)
                reject(msg);
            });
        });
    }

    // Initialize the map and load data
    async initializeMapData(map) {
        try {
            this.map = map;

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
    }
}
