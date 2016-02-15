package com.loop.display

import com.loop.event.CoverCharge
import com.loop.event.CoverChargeType
import com.seng310.loop.MusicEvent
import com.loop.utils.Str

class EventTagLib {
    static namespace = "loop"
    static defaultEncodeAs = [taglib:'html']
    static encodeAsForTags = [eventCoverCharge: [taglib:'raw']]

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

    def eventCoverCharge = {attrs, body ->
        MusicEvent e = attrs.event
        if (e.isFreeEvent) { out << '<span class="free-event">Free</span>';  return }

        def c = e.coverCharges;

        List<CoverCharge> door = [];
        List<CoverCharge> ticket = [];
        List<CoverCharge> donation = [];
        List<CoverCharge> general = [];

        StringBuilder str = new StringBuilder(128);
        int i = 0;
        if (c.size() > 0) {
            c.each {
                if (it.type == CoverChargeType.DOOR) { door.add(it) }
                else if (it.type == CoverChargeType.TICKET) { ticket.add(it) }
                else if (it.type == CoverChargeType.BY_DONATION) { donation.add(it) }
                else { general.add(it) }
            }

            if (ticket.size() > 0) { ticket.sort(true) { a, b -> (a.min <=> b.min)*-1 } }
            if (door.size() > 0) { door.sort(true) { a, b -> (a.min <=> b.min)*-1 } }
            if (general.size() > 0) { general.sort(true) { a, b -> (a.min <=> b.min)*-1 } }
            if (donation.size() > 0) { donation.sort(true) { a, b -> (a.min <=> b.min)*-1 } }

            if (donation.size() > 0 && (door.size() + ticket.size() + general.size()) == 0) {
                str.append('<span class="by-donation">By Donation</span>')
            }

            ticket.each { putCoverCharge(it, str, i++) }
            door.each { putCoverCharge(it, str, i++) }
            general.each { putCoverCharge(it, str, i++) }
            donation.each {
                if (it.isRange) { putAmount(it.max, putAmount(it.min, str.append("(Suggested donation")).append(" - ")).append(")") }
                else if (it.min) { putAmount(it.min, str.append("(Suggested donation ")).append(")") }
                if (it.note) { str.append(" ").append(it.note) }
            }
        }


        if (e.coverNote) {
            if (i > 0) {str.append(" - ") }
            str.append(e.coverNote)
        }

        if (door.size() > 0 && (ticket.size() + donation.size() + general.size()) == 0) {
            if (i > 0 || e.coverNote) { str.append(".&nbsp;&nbsp;") }
            str.append("At the door only.")
        }

        out << str.toString();
    }

    private static void putCoverCharge(CoverCharge c, StringBuilder str, int i) {
        if (i > 0) { str.append(" / ") }
        if (c.isRange) { putAmount(c.max, putAmount(c.min, str).append(" - ")) }
        else if (c.cost) { putAmount(c.cost, str) }
        if (c.note) { str.append(" ").append(c.note) }
    }

    private static StringBuilder putAmount(Double amt, StringBuilder str) {
        return str.append('<span class="cover-amt">').append(Str.currency(amt)).append('</span>')
    }
}
