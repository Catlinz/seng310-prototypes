package com.loop.utils


class LatLngBounds {
    public LatLng _max
    public LatLng _min

    public LatLngBounds(def min, def max) {
        setMax(max);
        setMin(min);
    }

    public LatLng getMax() { return _max; }
    public LatLng getMin() { return _min; }

    public void setMax(def latlng) { _max = new LatLng(latlng) }
    public void setMin(def latlng) { _min = new LatLng(latlng) }
}
