package com.seng310.loop.show

import com.seng310.loop.MusicEvent
import grails.transaction.Transactional

@Transactional
class MusicEventCreationService {

    MusicEvent createAndSaveMusicEvent(Map params = [:]) {
        MusicEvent s = new MusicEvent(params)
        s.save(flush: true, failOnError: true)
        return s;
    }
}
