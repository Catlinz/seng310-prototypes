package com.loop.event

import com.seng310.loop.MusicEvent
import grails.converters.JSON

class CoverCharge {

    Double min;
    Double max;

    String note;
    CoverChargeType type = CoverChargeType.MONEY

    static belongsTo = [event: MusicEvent]

    static constraints = {
        min nullable: true
        max nullable: true
        note nullable: true, blank: true
    }

    transient public Double getCost() { return min; }
    transient public boolean getIsRange() { return max != null }
    transient public boolean getIsByDonation() { return type == CoverChargeType.BY_DONATION }


    static void registerJSONMarshaller() {
        JSON.registerObjectMarshaller(CoverCharge) { CoverCharge c ->
            return [
                    id: c.id,
                    event: c.eventId,
                    min: c.min,
                    max: c.max,
                    note: c.note,
                    type: c.type.toString()
            ]
        }
    }
}
