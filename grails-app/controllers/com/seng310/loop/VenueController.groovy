package com.seng310.loop

import com.loop.filters.EventFilters
import grails.converters.JSON

class VenueController {

    def get() {
        Venue venue = Venue.get(params.long('id'));
        Map data

        if (venue) {
            EventFilters ef = new EventFilters(params);
            List<MusicEvent> events = ef.filter(venue.events.toList());
            data = [venue: venue, html: null]

            if (params.boolean('html')) {
                if (!params.boolean('details')) {
                    data.html = g.render(template: "/prototype/p${params.p}/venue", model: [venue: venue, events: events]);
                }
            }
        }
        else {
            data = [error: "Failed to find Venue"]
        }

        render data as JSON

    }
}
