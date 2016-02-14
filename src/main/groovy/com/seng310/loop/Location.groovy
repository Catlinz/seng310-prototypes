package com.seng310.loop

class Location {
    private double _lat
    private double _lng

    public Location(double lat = 0, double lng = 0) {
        _lat = lat
        _lng = lng
    }

    public double getLat() { return _lat; }
    public double getLng() { return _lng; }

    public void setLat(double lat) { _lat = lat; }
    public void setLng(double lng) { _lng = lng; }
}
