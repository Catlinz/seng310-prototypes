package com.loop.filters

import com.seng310.loop.MusicEvent

class EventFilters {
    private DistanceFilter _distance = null
    private CoverChargeFilter _cover = null
    private DateFilter _date = null;
    private AgeFilter _age = null;
    private TextFilter _text = null;

    public EventFilters(def map) {
        Map parsed = getParsedParams(map);

        if (parsed?.distance) { _distance = new DistanceFilter(parsed.distance) }
        if (parsed?.cover) { _cover = new CoverChargeFilter(parsed.cover) }
        if (parsed?.date) { _date = new DateFilter(parsed.date) }
        if (parsed?.age) { _age = new AgeFilter(parsed.age) }
        if (parsed?.text) { _text = new TextFilter(parsed.text) }
    }

    public List<MusicEvent> filter(List<MusicEvent> events) {
        if (_distance?.isValid) { events = _distance.processAndFilterResults(events); }
        if (_cover?.isValid) { events = _cover.processAndFilterResults(events); }
        if (_date?.isValid) { events = _date.processAndFilterResults(events); }
        if (_age?.isValid) { events = _age.processAndFilterResults(events); }
        if (_text?.isValid) { events = _text.processAndFilterResults(events); }

        return events;
    }

    public String toString() {
        StringBuilder str = new StringBuilder(256)
        if (_distance?.isValid) {
            str.append("DistanceFilter: [")
                    .append("\n\tcenter: ").append(_distance.center)
                    .append(", \n\tminRadius: ").append(_distance.minRadius)
                    .append(", \n\tmaxRadius: ").append(_distance.maxRadius).append("\n]\n")
        }
        if (_cover?.isValid) {
            str.append("CoverChargeFilter: [").append("\n\tmin: ").append(_cover.min).append(", \n\tmax: ").append(_cover.max).append("\n]\n")
        }
        if (_date?.isValid) {
            str.append("DateFilter: [\n\tdates: [")
            _date.dates.each { str.append("\n\t\t[start: ").append(it.start).append(", end: ").append(it.end).append("], ") }
            str.append("\n\t]\n]\n")
        }
        if (_age?.isValid) {
            str.append("AgeFilter: [").append("\n\thideAdultOnly: ").append(_age.hideAdultOnly).append("\n]\n")
        }
        if (_text?.isValid) {
            str.append("TextFilter: [").append("\n\twords: [")
            _text.words.eachWithIndex { w, i ->
                if (i > 0) { str.append(", ") }
                if (i % 4 == 0) { str.append("\n\t\t") }
                str.append(w)
            }
            str.append("\n\t]\n]")
        }
        return str.toString();
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
    public TextFilter getText() { return _text; }

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
            parsed['age'] = [ hideAdultOnly: params.boolean('AgeFilter.hideAdultOnly') ]
        }
        if (params.boolean('TextFilter')) {
            parsed['text'] = [ value: params['TextFilter.value'] ]
        }

        return parsed
    }

}
