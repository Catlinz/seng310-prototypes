
function Map(id, latlng, initialZoom) {
    this.id = id;
    this.location = latlng || Map.defaultLocation;
    this.initialZoom = initialZoom || 14;

    if (!this.location.lat && this.location.length == 2) {
        this.location = {lat: this.location[0], lng: this.location[1]};
    }

    this.markers = [];
    this.onMarkerClicked = null;
    this.selectedMarker = null;
    this.h = new GM.Handlers({obj: this});
}

Map.prototype = {
    constructor: Map,

    addEventMarker: function(event) {
        var m = Map[this.api].addEventMarker(this, event);
        m.loopEventID = event.id;
        this.markers.push(m);
    },

    centerOnLocation: function() {
        Map[this.api].centerOnMarker(this, this.locMarker);
    },

    centerOnMarker: function(idOrMarker) {
        if (idOrMarker.loopEventID) { Map[this.api].centerOnMarker(this, idOrMarker); }
        else { Map[this.api].centerOnMarker(this, this.getEventMarkerByID(id)); }
    },

    clearEventMarkers: function() {
        for (var i = 0; i < this.markers.length; ++i) {
            Map[this.api].removeMarker(this, this.markers[i]);
        }
        this.markers = [];
        this.selectedMarker = null;
    },

    fire: function(action) { this.h.fire(action); },

    getEventMarkerByID: function(id) {
        for (var i = 0; i < this.markers.length; ++i) {
            if (this.markers[i].loopEventID == id) {
                return this.markers[i];
            }
        }
    },

    initialise: function() {
        /* Determine which API we are using, leaflet or google maps. */
        if (window.google) { this.api = 'google'; }
        else if(window.L && window.L.map) { this.api = 'leaflet'; }
        else {
            alert("Failed to find either Google Maps API or Leaflet API");
            this.api = 'none';
        }

        Map[this.api].initialise(this);
        this.fire('init');
    },

    needsInitialisation: function() { return (this.map) ? false : true; },

    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); },

    populate: function(events) {
        for (var i = 0; i < events.length; ++i) {
            this.addEventMarker(events[i]);
        }
    },

    showAllEventMarkers: function() {
        if (this.selectedMarker) {
            for (var i = 0; i < this.markers.length; ++i) {
                if (this.selectedMarker.loopEventID != this.markers[i].loopEventID) {
                    Map[this.api].showMarker(this, this.markers[i]);
                }
            }
            this.selectedMarker = null
        }
    },

    selectEventMarker: function(idOrMarker) {
        var m = (idOrMarker.loopEventID) ? idOrMarker : this.getEventMarkerByID(idOrMarker);
        for (var i = 0; i < this.markers.length; ++i) {
            if (this.markers[i].loopEventID != m.loopEventID) {
                Map[this.api].hideMarker(this, this.markers[i]);
            }
        }
        this.selectedMarker = m;
        this.centerOnMarker(m);
    },

    zoomToFitEventsAndLocation: function(maxZoom) {
        if (!maxZoom) { maxZoom = this.initialZoom; }
        var m = this.markers.slice(0);
        m.push(this.locMarker);
        Map[this.api].zoomToFitMarkers(this, m, maxZoom)
    },

    zoomToFitAllEvents: function(maxZoom) {
        if (!maxZoom) { maxZoom = this.initialZoom; }
        Map[this.api].zoomToFitMarkers(this, this.markers, maxZoom)
    }
};

Map.defaultLocation = {lat: 48.441216117602345, lng: -123.3530330657959};

Map.google = {
    addEventMarker: function(self, event) {
        var marker = new google.maps.Marker({
            position: {lat: event.lat, lng: event.lng},
            map: self.map,
            title: "Event",
            label: {
                text: ""+event.id,
                color: 'white',
                fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '12pt',
                fontWeight: '500'
            },
            icon: {
                url: "/assets/marker-icon-2x.png",
                scaledSize: new google.maps.Size(25, 41),
                labelOrigin: new google.maps.Point(12,13)
            }
        });
        marker.addListener('click', function() { if (self.onMarkerClicked) { self.onMarkerClicked(event.id);} });
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
    },

    zoomToFitMarkers: function(self, markers, maxZoom) {
        var m0 = markers[0].getPosition();
        var max = {lat: m0.lat(), lng: m0.lng()};
        var min = {lat: m0.lat(), lng: m0.lng()};

        for (var i = 1; i < markers.length; ++i) {
            var m = markers[i].getPosition();

            if (m.lat() > max.lat) { max.lat = m.lat(); }
            else if (m.lat() < min.lat) { min.lat = m.lat(); }

            if (m.lng() > max.lng) { max.lng = m.lng(); }
            else if (m.lng() < min.lng) { min.lng = m.lng(); }
        }

        self.map.fitBounds(new google.maps.LatLngBounds(min, max));
    }
};

Map.leaflet = {
    addEventMarker: function(self, event) {
        var marker = L.marker({lat: event.lat, lng: event.lng}, {icon: Map.leaflet.eventIcon(event.id)}).addTo(self.map);
        marker.on("click", function() { if (self.onMarkerClicked) { self.onMarkerClicked(event.id);} });
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
    },

    zoomToFitMarkers: function(self, markers, maxZoom) {
        var locs = [];
        for (var i = 0; i < markers.length; ++i) {
            locs.push(markers[i].getLatLng());
        }
        self.map.fitBounds(L.latLngBounds(locs), {
            paddingTopLeft: [30, 50],
            paddingBottomRight: [40,30],
            maxZoom: maxZoom
        });
    }
};