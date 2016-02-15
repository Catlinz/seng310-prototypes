package com.seng310.loop

import grails.converters.JSON

class VenueController {

    def get() {
        Venue venue = Venue.get(params.long('id'));
        Map data

        if (venue) {
            data = [venue: venue, html: null]

            if (params.boolean('html')) {
                if (!params.boolean('details')) {
                    data.html = g.render(template: "/prototype/p${params.p}/venue", model: [venue: venue]);
                }
            }
        }
        else {
            data = [error: "Failed to find Venue"]
        }

        render data as JSON

    }
}
