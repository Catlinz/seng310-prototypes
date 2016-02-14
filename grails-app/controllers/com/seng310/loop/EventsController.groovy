package com.seng310.loop

import grails.converters.JSON

class EventsController {

    def musicEventFinderService

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
        String search = params.value;
        List<MusicEvent> events = musicEventFinderService.searchForMusicEvents(search, null, params);

        def data = [
                events: events.collect { [id: it.id, lat: it.venue.lat, lng: it.venue.lng, venue: it.venue.id] },
                html: (params.boolean('html')) ? g.render(template: "/prototype/p${params.p}/list", model:[events: events]) : null
        ]
        render data as JSON
    }
}
