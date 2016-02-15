package com.loop.event

import com.seng310.loop.MusicEvent
import grails.transaction.Transactional

@Transactional
class MusicEventCreationService {

    def coverChargeHelperService;

    MusicEvent createAndSaveMusicEvent(Map params = [:]) {
        MusicEvent s = new MusicEvent(params)
        s.save(flush: true, failOnError: true)
        return s;
    }

    void createAndSaveMusicEventCoverCharges(Map params = [:]) {
        if (params.byDonation) {
            params.byDonation.each { Map it ->
                coverChargeHelperService.createByDonation(it + [event: params.event]).save(flush: true, failOnError: true)
            }
        }

        if (params.ticket) {
            params.ticket.each { Map it ->
                coverChargeHelperService.createTicketCover(it + [event: params.event]).save(flush: true, failOnError: true)
            }
        }

        if (params.door) {
            params.door.each { Map it ->
                coverChargeHelperService.createDoorCover(it + [event: params.event]).save(flush: true, failOnError: true)
            }
        }

        if (params.general) {
            params.general.each { Map it ->
                coverChargeHelperService.createGeneralCover(it + [event: params.event]).save(flush: true, failOnError: true)
            }
        }
    }
}
