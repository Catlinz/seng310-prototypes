package com.seng310.loop.json

import com.seng310.loop.MusicEvent
import com.seng310.loop.Venue


class CustomJSONMarshallers {

    static def register() {
        MusicEvent.registerJSONMarshaller()
        Venue.registerJSONMarshaller()
    }

}
