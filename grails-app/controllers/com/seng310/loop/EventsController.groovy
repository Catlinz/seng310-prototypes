package com.seng310.loop

import com.loop.filters.EventFilters
import grails.converters.JSON

class EventsController {

    def musicEventFinderService

    def filterDefaults() {
        int maxCoverBounds = musicEventFinderService.getCoverChargeMaxBound();
        def data = [
                'DistanceFilter' : [
                        minRadius: 0,
                        maxRadius: 100000,
                        range: [0, 100000],
                        center: [lat: 0, lng: 0]
                ],
                'CoverChargeFilter': [
                        min: 0, max: maxCoverBounds,
                        range: [min: 0, max: maxCoverBounds]
                ],
                'DateFilter': [
                        days: [0],
                        start: null, end: null
                ],
                'AgeFilter':[ hideAdultOnly: false ]
        ]

        render data as JSON;
    }

    def get() {
        MusicEvent event = MusicEvent.get(params.long('id'));
        Map data

        if (event) {
            data = [event: event, html: null]

            if (params.boolean('html')) {
                if (!params.boolean('details')) {
                    data.html = g.render(template: "/prototype/p${params.p}/event", model: [event: event]);
                }
            }
        }
        else {
            data = [error: "Failed to find event"]
        }

        render data as JSON

    }

    def list() {
        EventFilters ef = new EventFilters(params)
        List<MusicEvent> events = musicEventFinderService.searchForMusicEvents(ef, params);

        def data = [
                //events: events.collect { [id: it.id, lat: it.venue.lat, lng: it.venue.lng, venue: it.venue.id] },
                stats: ef.stats,
                html: g.render(template: "/prototype/p${params.p}/list", model:[events: events])
        ]
        render data as JSON
    }

    def map() {
        EventFilters ef = new EventFilters(params)
        List<MusicEvent> events = musicEventFinderService.searchForMusicEvents(ef, params);

        def venues = events.collect{ [id: it.venue.id, name: it.venue.name, lat: it.venue.lat, lng: it.venue.lng, events: []] }.unique{ it.id }
        venues.each{ v->
            events.each{ e-> if (e.venue.id == v.id) { v.events.add([id: e.id]) } }
        }
        def data = [stats: ef.stats, venues: venues]
        render data as JSON
    }
}
