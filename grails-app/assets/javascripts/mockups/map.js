
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

    addVenueToMap: function(venue) {
        var m = Map[this.api].addVenueMarker(this, venue);
        m.loop = {
            venue: { id: venue.id },
            events: venue.events
        };
        this.markers.push(m);
    },

    centerOnLocation: function(options) {
        this.centerOnMarker(this.locMarker, options);
    },

    /** params can be a venue ID, a marker of a map with either the 'venue' or 'event' id specified. **/
    centerOnMarker: function(params, options) {
        var marker = (params.loop) ? params : ((params.event) ? this.getMarkerByEventId(params.event) : ((params.venue) ? this.getMarkerByVenueId(params.venue) : this.getMarkerByVenueId(params)));
        if (marker) { Map[this.api].centerOnMarker(this, marker, options); }
    },

    clearEventMarkers: function() {
        for (var i = 0; i < this.markers.length; ++i) {
            Map[this.api].removeMarker(this, this.markers[i]);
        }
        this.markers = [];
        this.selectedMarker = null;
    },

    fire: function(action) { this.h.fire(action); },

    getMarkerByEventId: function(id) {
        var idx = this.getMarkerIndexByEventId(id);
        if (idx != -1) { return this.markers[idx]; }
        else { return null; }
    },

    getMarkerByVenueId: function(id) {
        var idx = this.getMarkerIndexByVenueId(id);
        if (idx != -1) { return this.markers[idx]; }
        else { return null; }
    },

    getMarkerIndexByEventId: function(id) {
        for (var i = 0; i < this.markers.length; ++i) {
            for (var j = 0; j < this.markers[i].loop.events.length; ++j) {
                if (this.markers[i].loop.events[j].id == id) { return i; }
            }
        }
        return -1;
    },

    getMarkerIndexByVenueId: function(id) {
        for (var i = 0; i < this.markers.length; ++i) {
            if (this.markers[i].loop.venue.id == id) { return i; }
        }
        return -1;
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

    populate: function(venues) {
        for (var i = 0; i < venues.length; ++i) {
            this.addVenueToMap(venues[i]);
        }
    },

    selectMarker: function(marker, options) {
        this.selectedMarker = marker;
        Map[this.api].focusMarker(this, marker);
        this.centerOnMarker(marker, options);
    },

    selectNone: function() {
        Map[this.api].focusMarker(this, null);
        this.selectedMarker = null;
    },

    selectVenueByEventId: function(id, options) {
        this.selectMarker(this.getMarkerByEventId(id), options);
    },

    selectVenueById: function(id, options) {
        this.selectMarker(this.getMarkerByVenueId(id), options);
    },

    zoomToFitAll: function(maxZoom) {
        if (!maxZoom) { maxZoom = this.initialZoom; }
        var m = this.markers.slice(0);
        m.push(this.locMarker);
        Map[this.api].zoomToFitMarkers(this, m, maxZoom)
    }
};

Map.defaultLocation = {lat: 48.441216117602345, lng: -123.3530330657959};

Map.google = {
    addVenueMarker: function(self, venue) {
        var params = {
            position: {lat: venue.lat, lng: venue.lng},
            map: self.map,
            title: venue.name,
            icon: {
                url: "/assets/location-icon-2x.png",
                scaledSize: new google.maps.Size(25, 41),
                labelOrigin: new google.maps.Point(12, 13)
            }
        };
        if (venue.events.length > 0) {
            params.label = {
                text: ""+(venue.events.length),
                color: 'white',
                fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '12pt',
                fontWeight: '500'
            };
            params.icon.url = "/assets/marker-icon-2x.png"
        }
        var marker = new google.maps.Marker(params);
        marker.addListener('click', function() { if (self.onMarkerClicked) { self.onMarkerClicked(this);} });
        return marker;
    },

    centerOnMarker: function(self, marker, opt) {
        if (!opt) { opt = {}; }
        if (opt.padding) {
            var p = {t: opt.padding[0], r: opt.padding[1], b: opt.padding[2], l: opt.padding[3]};
            var c = Map.google.project(self, self.map.getCenter());
            var mc = Map.google.project(self, marker.getPosition());
            self.map.panBy(mc.x + p.l - (p.l + p.r)*0.5 - c.x, mc.y - p.t + (p.t + p.b)*0.5 - c.y);
        }
        else { self.map.panTo(marker.getPosition()); }

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
        self.locMarker.loop = {location: true};
        self.locMarker.addListener('click', function() { Map.google.centerOnMarker(self, self.locMarker); });
    },

    focusMarker: function(self, marker) {
        if (marker) {
            for (var i = 0; i < self.markers.length; ++i) {
                if (self.markers[i] != marker) { self.markers[i].setOpacity(0.3); }
            }
            marker.setOpacity(1.0);
        }
        else {
            for (var i = 0; i < self.markers.length; ++i) {
                self.markers[i].setOpacity(1.0);
            }
        }
    },

    initialise: function(self) {
        self.map = new google.maps.Map(document.getElementById(self.id),  {
            center: self.location,
            zoom: self.initialZoom,
            disableDefaultUI: true
        });
        Map.google.updateLocationMarker(self);
    },

    project: function(self, latlng) {
        var scale = 1 << self.map.getZoom();
        var p = self.map.getProjection().fromLatLngToPoint(latlng);
        return new google.maps.Point(Math.floor(p.x * scale), Math.floor(p.y * scale));

    },

    removeMarker: function(self, marker) {
        marker.setMap(null);
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
    addVenueMarker: function(self, venue) {
        var marker = L.marker({lat: venue.lat, lng: venue.lng}, {icon: Map.leaflet.venueIcon(venue)}).addTo(self.map);
        marker.on("click", function() { if (self.onMarkerClicked) { self.onMarkerClicked(this);} });
        return marker;
    },

    centerOnMarker: function(self, marker, opt) {
        if (!opt) { opt = {}; }
        if (opt.padding) {
            var p = {t: opt.padding[0], r: opt.padding[1], b: opt.padding[2], l: opt.padding[3]};
            var c = self.map.project(self.map.getCenter());
            var mc = self.map.project(marker.getLatLng());
            self.map.panBy([mc.x + p.l - (p.l + p.r)*0.5 - c.x, mc.y - p.t + (p.t + p.b)*0.5 - c.y], {animate: true});
        }
        else { self.map.setView(marker.getLatLng()); }

    },

    createLocationMarker: function(self) {
        self.locMarker = L.marker(self.location, {icon: Map.leaflet.locationIcon()}).addTo(self.map);
        self.locMarker.loop = {location: true};
        self.locMarker.on("click", function() { Map.leaflet.centerOnMarker(self, self.locMarker); });
    },

    venueIcon: function(venue) {
        return L.divIcon({className: 'map-icon', iconSize: [50, 41], iconAnchor: [25, 41], popupAnchor: [0, -41], html:'<span class="letter">'+venue.events.length+'</span>'});
    },

    focusMarker: function(self, marker) {
        if (marker) {
            for (var i = 0; i < self.markers.length; ++i) {
                if (self.markers[i] != marker) { self.markers[i].setOpacity(0.3); }
            }
            marker.setOpacity(1.0);
        }
        else {
            for (var i = 0; i < self.markers.length; ++i) {
                self.markers[i].setOpacity(1.0);
            }
        }
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