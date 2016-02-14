package com.seng310.loop.venue

import com.seng310.loop.Venue
import grails.transaction.Transactional

@Transactional
class VenueCreationService {

    Venue createAndSaveVenue(Map params = [:]) {
        if (!params.province) { params['province'] = "BC" }
        if (!params.city) { params['city'] = "Victoria" }

        Venue v = new Venue(params);
        v.save(flush: true, failOnError: true);
        return v;
    }
}
