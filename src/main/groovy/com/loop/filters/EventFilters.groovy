package com.loop.filters

import com.seng310.loop.MusicEvent

class EventFilters {
    private DistanceFilter _distance = null
    private CoverChargeFilter _cover = null

    public EventFilters(def params) {
        Map parsed = getParsedParams(params);

        if (parsed?.distance) { _distance = new DistanceFilter(parsed.distance) }
        if (parsed?.cover) { _cover = new CoverChargeFilter(parsed.cover) }
    }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        /* First, by distance */
        if (_distance) { results = _distance.processAndFilterResults(results) }
        if (_cover) { results = _cover.processAndFilterResults(results) }

        /* Do any post processing needed, e.g., removing filtered items from stats */
        if (_distance) { _distance.postProcess(results) }
        if (_cover) { _cover.postProcess(results) }

        return results;
    }

    public def getStats() {
        return [
                distance: (_distance) ? _distance.stats : null,
                cover: (_cover) ? _cover.stats : null
        ]
    }

    public DistanceFilter getDistance() { return _distance; }

    public CoverChargeFilter getCover() { return _cover }

    public static Map getParsedParams(def params) {
        Map parsed = [:];

        if (params.boolean('DistanceFilter')) {
            parsed['distance'] = [
                    center: [lat: params.double('DistanceFilter.center.lat'), lng: params.double('DistanceFilter.center.lng')],
                    maxRadius: params.double('DistanceFilter.maxRadius') ?: 0,
                    minRadius: params.double('DistanceFilter.minRadius') ?: 0
            ]
        }
        if (params.boolean('CoverChargeFilter')) {
            parsed['cover'] = [
                    min: params.double('CoverChargeFilter.min') ?: 0,
                    max: params.double('CoverChargeFilter.max') ?: 0
            ]
        }

        return parsed
    }

}
