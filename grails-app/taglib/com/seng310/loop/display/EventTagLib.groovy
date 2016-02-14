package com.seng310.loop.display

import com.seng310.loop.MusicEvent
import com.seng310.loop.utils.Str

class EventTagLib {
    static namespace = "loop"
    static defaultEncodeAs = [taglib:'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]

    def eventTitle = {attrs, body ->
        MusicEvent e = attrs.event
        out << e.name
    }

    def eventTime = {attrs, body ->
        MusicEvent e = attrs.event
        String start = Str.shortTime(e.start);
        String end = Str.shortTime(e.end);
        if (start) {
            if (end) { out << start << " - " << end }
            else { out << start }
        }
    }
}
