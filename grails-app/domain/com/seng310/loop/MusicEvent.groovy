package com.seng310.loop

import com.loop.utils.LatLng
import com.loop.utils.Str
import grails.converters.JSON

class MusicEvent {

    String name
    AgeRestriction age = AgeRestriction.NO_RESTRICTION

    Date start
    Date end

    EntryMethod entry = EntryMethod.NO_COVER
    String cost

    static belongsTo = [venue: Venue]


    static constraints = {
        name blank: false, nullable: false
        start nullable: true
        end nullable: true
        cost nullable: true
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
                    entry: e.entry.toString(),
                    cost: e.cost,
                    venue: e.venueId
            ]
        }
    }
}
