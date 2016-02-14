package com.seng310.loop

import com.seng310.loop.utils.Str
import grails.converters.JSON

class Venue {

    String name;
    String description;
    VenueType type;
    int capacity = 0;

    String province;
    String city;
    String address;
    String zip;

    double lng = 0.0;
    double lat = 0.0;

    static hasMany = [events: MusicEvent]

    static constraints = {
        name blank: false, nullable: false
        type nullable: false
        description nullable: true
        province nullable: true
        city nullable: true
        address nullable: true
        zip nullable: true
    }

    static mapping = {
        description type: 'text'
    }

    static void registerJSONMarshaller() {
        JSON.registerObjectMarshaller(Venue) { Venue v ->
            return [
                    id: v.id,
                    name: v.name,
                    description: v.description,
                    type: v.type.toString(),
                    capacity: v.capacity,

                    province: v.province,
                    city: v.city,
                    address: v.address,
                    zip: v.zip,

                    lat: v.lat,
                    lng: v.lng
            ]
        }
    }
}
