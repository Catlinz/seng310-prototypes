package com.loop.event

import com.loop.filters.EventFilters
import com.seng310.loop.AgeRestriction
import com.seng310.loop.MusicEvent
import grails.transaction.Transactional

@Transactional
class MusicEventFinderService {

    List<MusicEvent> searchForMusicEvents(String keywords, EventFilters filters, Map params = [:]) {
        int max = (params.max) ? params.max as int : 0
        int offset = (params.offset) ? params.offset as int : 0
        String sort = getSortByProperty(params.sort);
        String sortOrder = getSortOrder(params.order);

        String[] words = (keywords) ? keywords.split("\\s+") : []

        List<MusicEvent> results = (List<MusicEvent>)MusicEvent.createCriteria().list {
            and {
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
                if (filters?.distance?.isValid) {
                    venue {
                        and {
                            between('lat', filters.distance.bounds.min.lat, filters.distance.bounds.max.lat)
                            between('lng', filters.distance.bounds.min.lng, filters.distance.bounds.max.lng)
                        }
                    }
                }

                if (filters?.date?.isValid) {
                    or {
                        filters.date.dates.each { d ->
                            between('start', d.start, d.end)
                            between('end', d.start, d.end);
                        }
                    }
                }

                if (filters?.age?.hideAdultOnly ) {
                    eq('age', AgeRestriction.NO_RESTRICTION)
                }
            }

            if (max > 0) { maxResults(max) }
            if (offset > 0) { firstResult(offset) }
            if (sort && sortOrder) { order(sort, sortOrder) }
        }

        if (filters) { return filters.processAndFilterResults(results); }
        else { return results }
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
