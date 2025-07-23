// Descriptive text for about popup

var aboutText = `<div style="width:80vw height=90vh">
<p>
Wherever we go I like to keep a record of our stopping places to jog future memories.
This map represents 80 locations we made stops at on a trip to Nova Scotia, Prince Edward Island,
and New Brunswick in June/July 2025 as part of <a target="_blank" href="https://www.roadscholar.org/find-an-adventure/3788/The-Best-of-the-Canadian-Maritimes">Road Scholar 3788</a>.
</p>
<h2>Usage</h2>
<p>
The code arranges that the map will initially be zoomed to include the geographic
extent of all the locations I recorded as stops.
</p>
<p>
Markers that have not been clustered appear as blue bubbles
(<img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png" alt="bubble icon" width="16">)
- clicking one of those will show
whatever details OpenStreetMap had when the pin was dropped.
</p>
<p>
Markers that are in close
proximity to others will be clustered and colored
(<img src="data/cluster_example.png" alt="bubble icon" width="24">)
to indicate the number of markers at that
location. Clicking on one of these will zoom the map to enclose just those markers and expand
the cluster into smaller clusters and distinct markers.
</p>
<p>
Select from a number of base maps using the layer chooser in the upper right corner.
</p>
<p>
Map Zoom levels can be manually controlled using the + and - controls in the upper left.
Clicking the reset button, enabled if you've changed things, will return the map to its
initial geographic extent and zoom level.
</p>
<h2>Credits / Nerdy Details</h2>
<p>
I record locations using the <a href="https://organicmaps.app/" taget="_explainer">
Organic Maps app</a> - a free app that works using off-line
<a href="https://www.openstreetmap.org/about target="_explainer">Open Street Map</a>
data that I download before leaving on a trip. Great for roaming where cell coverage can be
chancy.
</p>
<p>
The map was made possible by the capabilities of several open-source projects:
</p>
<ul>
<li>
<a href="https://leafletjs.com/" target="explainer">Leaflet</a> -
"an open-source JavaScript library for mobile-friendly interactive maps" - the fundamental
basis for this map&rsquo;s display.
</li>
<li>
The <a href="https://github.com/leaflet-extras/leaflet-providers" target="explainer"
>Leaflet-providers</a> extension for selected free base map tile providers - as shown in the
layer control on the upper right.
</li>
<li>
The <a href="https://github.com/Leaflet/Leaflet.markercluster" target="explainer"
>Marker Cluster</a>
Leaflet Plugin to aggregate markers that would appear too close to one another and
symbolize them as the numbered circles.
</li>
<li>
<a href="https://github.com/cliffcloud/Leaflet.EasyButton" target="explainer"
>EasyButton</a> a leaflet control to add buttons to provide the reset map and this popup display
capabilities.
</li>
<li>
<a href="https://github.com/ptma/Leaflet.Legend" target="explainer"
>Leaflet.Legend</a> a leaflet control to create the map legend.
capabilities.
</li>
</ul>
<p>
That plus a bit of JavaScript coding to extract information from the marker
data and add those as pop up text descriptions for the markers as well as compose
the whole thing into a web accessible form and implement the extras.
</p>
</div>
</div>
`;
