package com.loop.filters

import com.loop.utils.LatLng
import com.loop.utils.LatLngBounds
import com.loop.utils.Location
import com.seng310.loop.MusicEvent

class DistanceFilter {
    private double _minRadius
    private double _maxRadius;

    private LatLng _center;
    private LatLngBounds _bounds;

    public DistanceFilter(def params = null) {
        if (!params) { params = [:] }
        _minRadius = 0.0;
        _maxRadius = 0.0;

        _center = new LatLng(params.center ?: [lat: 0, lng: 0]);
        if (params.radius ||  params.maxRadius || params.max) { doSetMaxRadius(params.radius ?: (params.maxRadius ?: params.min)); }
        if (params.minRadius || params.min) { doSetMinRadius(params.minRadius ?: params.min) }
        calculateBounds()
    }

    public List<MusicEvent> filterResults(List<MusicEvent> results) {
        return results.findAll {
            double d = Location.distance(_center, it.location());
            return (d >= _minRadius && d <= _maxRadius);
        }
    }

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
