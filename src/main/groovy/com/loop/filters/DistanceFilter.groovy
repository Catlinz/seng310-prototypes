package com.loop.filters

import com.loop.utils.LatLng
import com.loop.utils.LatLngBounds
import com.loop.utils.Location
import com.seng310.loop.MusicEvent

class DistanceFilter {
    private double _minRadius
    private double _maxRadius;

    private LatLng _center;
    private LatLngBounds _bounds = null;

    private Map<Long, Double> distances;

    public DistanceFilter(def map = null) {
        if (!map) { map = [:] }
        _minRadius = 0.0;
        _maxRadius = 0.0;

        _center = new LatLng(map.center ?: [lat: 0, lng: 0]);
        if (map.radius ||  map.maxRadius || map.max) { doSetMaxRadius(map.radius ?: (map.maxRadius ?: map.min)); }
        if (map.minRadius || map.min) { doSetMinRadius(map.minRadius ?: map.min) }

        if (_minRadius < _maxRadius) { calculateBounds() }

    }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        distances = [:]
        if (isValid) {
            return results.findAll {
                double d = Location.distance(_center, it.location());
                if (d >= _minRadius && d <= _maxRadius) {
                    distances[(it.id)] = d;
                    return true
                }
                else { return false }
            }
        } else {
            results.each { distances[(it.id)] = Location.distance(_center, it.location()) }
            return results
        }
    }

    public void postProcess(List<MusicEvent> results) {
        def map = [:]
        results.each { map[(it.id)] = distances[(it.id)] }
        distances = map
    }

    public def getStats() {
        double max = _minRadius
        double min = _maxRadius
        distances.each { k, v ->
            if (v > max) { max = v }
            else if (v < min) { min = v }
        }

        max = Math.ceil(max + 1)
        min = Math.floor(min)

        def buckets = []
        int numBuckets = 8
        double bw = (max - min) / numBuckets;

        for (int i = 0; i < numBuckets; ++i) {
            double s = i*bw + min
            double e = ((i + 1)*bw) + min
            buckets.add([start: s, end: e, count: distances.count { k, v -> (v >= s && v < e) }])
        }

        return [min: min, max: max, buckets: buckets]
    }

    public boolean getIsValid() { return _bounds != null }

    public LatLng getCenter() { return _center }
    public double getMaxRadius() { return _maxRadius; }
    public double getMinRadius() { return _minRadius; }
    public LatLngBounds getBounds() { return _bounds; }

    public void setMaxRadius(def metres) {
        doSetMaxRadius(metres)
        calculateBounds()
    }

    public void setMinRadius(def metres) {
        doSetMinRadius(metres)
        calculateBounds()
    }

    public void calculateBounds() {
        _bounds = Location.getBounds(center, _maxRadius)
    }

    private void doSetMaxRadius(def metres) {
        if (_maxRadius < (_minRadius + 1)) { _minRadius = _maxRadius - 1 }
        _maxRadius = metres;
    }

    private void doSetMinRadius(def metres) {
        if (metres > _maxRadius) { _maxRadius = metres + 1; }
        _minRadius = metres;
    }

}
