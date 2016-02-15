package com.seng310.loop

import com.loop.event.CoverCharge
import com.loop.utils.LatLng
import com.loop.utils.Str
import grails.converters.JSON

class MusicEvent {

    String name
    AgeRestriction age = AgeRestriction.NO_RESTRICTION

    Date start
    Date end

    boolean isFreeEvent = false
    String coverNote;

    static belongsTo = [venue: Venue]
    static hasMany = [coverCharges: CoverCharge]


    static constraints = {
        name blank: false, nullable: false
        start nullable: true
        end nullable: true
        coverNote nullable: true, blank: true
    }

    transient public LatLng location() { return new LatLng(venue.lat, venue.lng) }

    static void registerJSONMarshaller() {
        JSON.registerObjectMarshaller(MusicEvent) { MusicEvent e ->
            return [
                    id: e.id,
                    name: e.name,
                    age: e.age.toString(),
                    day: Str.shortDay(e.start),
                    start: Str.shortTime(e.start),
                    end: Str.shortTime(e.end),
                    free: e.isFreeEvent,
                    coverNote: e.coverNote,
                    venue: e.venueId
            ]
        }
    }
}
