package com.loop.event

import com.seng310.loop.MusicEvent
import grails.transaction.Transactional

@Transactional
class CoverChargeHelperService {

    CoverCharge createByDonation(Map params = [:]) {
        return doCreate(eventFromParams(params), (params.min ?: (params.recommended ?: params.suggested)) as Double, (params.max ?: null), params.note ?: null, CoverChargeType.BY_DONATION);
    }

    CoverCharge createDoorCover(Map params = [:]) {
        return doCreate(eventFromParams(params), (params.min ?: params.cost) as Double, (params.max ?: null), params.note ?: null, CoverChargeType.DOOR);
    }

    CoverCharge createTicketCover(Map params = [:]) {
        return doCreate(eventFromParams(params), (params.min ?: params.cost) as Double, (params.max ?: null), params.note ?: null, CoverChargeType.TICKET);
    }

    CoverCharge createGeneralCover(Map params = [:]) {
        return doCreate(eventFromParams(params), (params.min ?: params.cost) as Double, (params.max ?: null), params.note ?: null, CoverChargeType.MONEY);
    }

    private static MusicEvent eventFromParams(Map params = [:]) {
        return (params.eventId) ? MusicEvent.get(params.eventId as long) : (params.event ?: null);
    }

    private static CoverCharge doCreate(MusicEvent event, Double min, Double max, String note, CoverChargeType type) {
        if (!event) { println("Cannot create cover charge with no event"); return null; }
        return new CoverCharge(event: event, min: min, max: max, note: note, type: type);
    }
}
