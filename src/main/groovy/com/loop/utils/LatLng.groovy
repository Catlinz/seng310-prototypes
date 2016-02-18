package com.loop.utils

class LatLng {
    private double _lat
    private double _lng

    public LatLng(def params) {
        _lat = params.lat ?: 0.0;
        _lng = params.lng ?: 0.0;
    }

    public LatLng(double lat, double lng) {
        _lat = lat;
        _lng = lng;
    }

    public double getLat() { return _lat; }
    public double getLng() { return _lng; }

    public void setLat(double lat) { _lat = lat; }
    public void setLng(double lng) { _lng = lng; }

    public String toString() {
        return "[lat: ${_lat}, lng: ${_lng}]"
    }

}
