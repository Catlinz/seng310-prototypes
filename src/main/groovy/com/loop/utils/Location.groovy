package com.loop.utils


class Location {

    public static final double earthRadius = 6378137.0;

    public static LatLngBounds getBounds(def center, double radius) {
        double c_lat = center.lat;
        double c_lng = center.lng;
        def max = [
                lat: c_lat + (radius / earthRadius) * (180.0 / Math.PI),
                lng: c_lng + (radius / earthRadius) * (180.0 / Math.PI) / Math.cos(c_lat * Math.PI / 180.0)
        ]

        def min = [
                lat: c_lat - (radius / earthRadius) * (180.0 / Math.PI),
                lng: c_lng - (radius / earthRadius) * (180.0 / Math.PI) / Math.cos(c_lat * Math.PI / 180.0)
        ]

        return new LatLngBounds(min, max);
    }

    public static double distance(def p1, def p2) {
        double lat1 = p1.lat * Math.PI / 180.0
        double lat2 = p2.lat * Math.PI / 180.0
        double dlat = (p2.lat - p1.lat) * Math.PI / 180.0
        double dlng = (p2.lng - p1.lng) * Math.PI / 180.0

        double sdlat = Math.sin(dlat*0.5);
        double sdlng = Math.sin(dlng*0.5);

        double a = sdlat*sdlat + Math.cos(lat1) * Math.cos(lat2) * sdlng*sdlng
        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))
        return earthRadius * c;
    }

    public static boolean contains(def bounds, def point) {
        return (point.lat >= bounds.min.lat && point.lat <= bounds.max.lat) &&
                (point.lng >= bounds.min.lng && point.lng <= bounds.max.lng)
    }
}
