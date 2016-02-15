package com.loop.filters

import com.seng310.loop.MusicEvent

class EventFilters {
    private DistanceFilter _distance = null

    public EventFilters(def params) {
        Map parsed = getParsedParams(params);

        if (parsed?.distance) { _distance = new DistanceFilter(parsed.distance) }
    }

    public List<MusicEvent> filterResults(List<MusicEvent> results) {
        /* First, by distance */
        if (_distance) { results = _distance.filterResults(results); }

        return results;
    }

    public DistanceFilter getDistance() { return _distance; }

    public static Map getParsedParams(def params) {
        Map parsed = [:];

        if (params.boolean('DistanceFilter')) {
            parsed['distance'] = [
                    center: [lat: params.double('DistanceFilter.center.lat'), lng: params.double('DistanceFilter.center.lng')],
                    maxRadius: params.double('DistanceFilter.maxRadius'),
                    minRadius: params.double('DistanceFilter.minRadius')
            ]
        }

        return parsed
    }

}
