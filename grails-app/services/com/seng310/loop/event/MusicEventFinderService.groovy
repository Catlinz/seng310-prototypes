package com.seng310.loop.event

import com.seng310.loop.MusicEvent
import grails.transaction.Transactional

@Transactional
class MusicEventFinderService {

    List<MusicEvent> searchForMusicEvents(String keywords, def filters, Map params = [:]) {
        int max = (params.max) ? params.max as int : 0
        int offset = (params.offset) ? params.offset as int : 0
        String sort = getSortByProperty(params.sort);
        String sortOrder = getSortOrder(params.order);

        String[] words = (keywords) ? keywords.split("\\s+") : []

        return (List<MusicEvent>)MusicEvent.createCriteria().list {
            if (words.size() > 0) {
                or {
                    words.each { ilike("name", "%${it}%") }
                    venue {
                        words.each {
                            ilike("name", "%${it}%")
                        }
                    }
                }
            }
            if (max > 0) { maxResults(max) }
            if (offset > 0) { firstResult(offset) }
            if (sort && sortOrder) { order(sort, sortOrder) }
        }
    }



    private static String getSortOrder(def order) {
        if (!order) { return "asc" }
        else if (order.toLowerCase().charAt(0) == (char)'d') { return "desc" }
        else { return 'asc'}
    }

    private static String getSortByProperty(def sort) {
        if (!sort) { return "id" }

        switch(sort) {
            case "name": return "name"
            default: return "id"
        }
    }
}
