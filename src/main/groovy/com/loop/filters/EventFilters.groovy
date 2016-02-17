package com.loop.filters

import com.seng310.loop.MusicEvent

class EventFilters {
    private DistanceFilter _distance = null
    private CoverChargeFilter _cover = null
    private DateFilter _date = null;
    private AgeFilter _age = null;

    public EventFilters(def map) {
        Map parsed = getParsedParams(map);

        if (parsed?.distance) { _distance = new DistanceFilter(parsed.distance) }
        if (parsed?.cover) { _cover = new CoverChargeFilter(parsed.cover) }
        if (parsed?.date) { _date = new DateFilter(parsed.date) }
        if (parsed?.age) { _age = new AgeFilter(parsed.age) }
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

    public AgeFilter getAge() { return _age; }
    public DateFilter getDate() { return _date; }
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
        if (params.boolean('DateFilter')) {
            parsed['date'] = [
                    start: params['DateFilter.start'] ?: null,
                    end: params['DateFilter.end'] ?: null,
                    days: params.list('DateFilter.days[]').collect { it as int }
            ]
        }
        if (params.boolean('AgeFilter')) {
            parsed['age'] = [
                    hideAdultOnly: params.boolean('AgeFilter.hideAdultOnly')
            ]
        }

        return parsed
    }

}
