
function Map(id, latlng, initialZoom) {
    this.id = id;
    this.location = latlng || Map.defaultLocation;
    this.initialZoom = initialZoom || 14;

    if (!this.location.lat && this.location.length == 2) {
        this.location = {lat: this.location[0], lng: this.location[1]};
    }

    this.markers = [];
    this.onMarkerClicked = null;
    this.selectedMarkerIndex = -1;

    /* Determine which API we are using, leaflet or google maps. */
    if (window.google) { this.api = 'google'; }
    else if(window.L && window.L.map) { this.api = 'leaflet'; }
    else {
        alert("Failed to find either Google Maps API or Leaflet API");
        this.api = 'none';
    }

    Map[this.api].initialise(this);
}

Map.prototype = {
    constructor: Map,

    addEventMarker: function(event) {
        this.markers.push(Map[this.api].addEventMarker(this, event));
    },

    addEventMarkers: function(list) {
        for (var i = 0; i < list.length; ++i) {
            this.addEventMarker(list.at(i));
        }
    },

    centerOnLocation: function() {
        Map[this.api].centerOnMarker(this, this.locMarker);
    },

    centerOnMarker: function(index) {
        if (!index) { index = 0; }
        Map[this.api].centerOnMarker(this, this.markers[index]);
    },

    clearEventMarkers: function() {
        for (var i = 0; i < this.markers.length; ++i) {
            Map[this.api].removeMarker(this, this.markers[i]);
        }
        this.markers = [];
        this.selectedMarkerIndex = -1;
    },

    showAllEventMarkers: function() {
        if (this.selectedMarkerIndex != -1) {
            for (var i = 0; i < this.markers.length; ++i) {
                if (this.selectedMarkerIndex != i) {
                    Map[this.api].showMarker(this, this.markers[i]);
                }
            }
            this.selectedMarkerIndex = -1;
        }
    },

    selectEventMarker: function(index) {
        for (var i = 0; i < this.markers.length; ++i) {
            if (i != index) {
                Map[this.api].hideMarker(this, this.markers[i]);
            }
        }
        this.selectedMarkerIndex = index;
        this.centerOnMarker(index);
    }
};

Map.defaultLocation = {lat: 48.441216117602345, lng: -123.3530330657959};

Map.google = {
    addEventMarker: function(self, event) {
        var marker = new google.maps.Marker({
            position: event.latlng,
            map: self.map,
            title: event.title,
            label: {
                text: event.code,
                color: 'white',
                fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '14pt',
                fontWeight: '600'
            },
            icon: {
                url: "/assets/marker-icon-2x.png",
                scaledSize: new google.maps.Size(25, 41),
                labelOrigin: new google.maps.Point(12,13)
            }
        });
        marker.addListener('click', function() { if (self.onMarkerClicked) { self.onMarkerClicked(event.code);} });
        return marker;
    },

    centerOnMarker: function(self, marker) {
        self.map.panTo(marker.getPosition());
    },

    createLocationMarker: function(self) {
        self.locMarker = new google.maps.Marker({
            position: self.location,
            map: self.map,
            title: "Current Location",
            icon: {
                url: "/assets/location-icon-2x.png",
                scaledSize: new google.maps.Size(25, 41)
            }
        });
        self.locMarker.addListener('click', function() { Map.google.centerOnMarker(self, self.locMarker); });
    },

    hideMarker: function(self, marker) {
        marker.setMap(null);
    },

    initialise: function(self) {
        self.map = new google.maps.Map(document.getElementById(self.id),  {
            center: self.location,
            zoom: self.initialZoom,
            disableDefaultUI: true
        });
        Map.google.updateLocationMarker(self);
    },

    removeMarker: function(self, marker) {
        marker.setMap(null);
    },

    showMarker: function(self, marker) {
        marker.setMap(self.map);
    },

    updateLocationMarker: function(self) {
        if (!self.locMarker) { Map.google.createLocationMarker(self); }
        else { self.locMarker.setPosition(self.location); }
    }
};

Map.leaflet = {
    addEventMarker: function(self, event) {
        var marker = L.marker(event.latlng, {icon: Map.leaflet.eventIcon(event.code)}).addTo(self.map);
        marker.on("click", function() { if (self.onMarkerClicked) { self.onMarkerClicked(event.code);} });
        return marker;
    },

    centerOnMarker: function(self, marker) {
        self.map.setView(marker.getLatLng());
    },

    createLocationMarker: function(self) {
        self.locMarker = L.marker(self.location, {icon: Map.leaflet.locationIcon()}).addTo(self.map);
        self.locMarker.on("click", function() { Map.leaflet.centerOnMarker(self, self.locMarker); });
    },

    eventIcon: function(code) {
        return L.divIcon({className: 'map-icon', iconSize: [50, 41], iconAnchor: [25, 41], popupAnchor: [0, -41], html:'<span class="letter">'+code+'</span>'});
    },

    hideMarker: function(self, marker) {
        self.map.removeLayer(marker);
    },

    initialise: function(self) {
        self.map = L.map(self.id).setView(self.location, self.initialZoom);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(self.map);
        Map.leaflet.updateLocationMarker(self);
    },

    locationIcon: function() {
        return L.icon({ iconUrl: '/assets/location-icon.png', iconRetinaUrl: '/assets/location-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
        });
    },

    removeMarker: function(self, marker) {
        self.map.removeLayer(marker);
    },

    showMarker: function(self, marker) {
        marker.addTo(self.map);
    },

    updateLocationMarker: function(self) {
        if (!self.locMarker) { Map.leaflet.createLocationMarker(self); }
        else { self.locMarker.setLatLng(self.location); }
    }
};