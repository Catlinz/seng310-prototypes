package com.loop.filters

import com.seng310.loop.MusicEvent
import groovy.time.TimeCategory

class DateFilter {

    ArrayList<Map<String, Date>> _dates;


    public DateFilter(def map = null) {
        if (map?.start && map?.end) {
            Date start = Date.parse("yyyy-MM-dd HH:mm:ss", "${map.start} 00:00:00");
            Date end = Date.parse("yyyy-MM-dd HH:mm:ss", "${map.end} 23:59:59");
            _dates = [[start: start, end: end]];
        }
        else if (map?.days && map.days.size() > 0) {
            _dates = new ArrayList<Map<String, Date>>(map.days.size() as int);
            Calendar nc = Calendar.getInstance();
            nc.setTime(new Date());
            nc.set(Calendar.HOUR_OF_DAY, 0);
            nc.set(Calendar.MINUTE, 0);
            nc.set(Calendar.SECOND, 0);
            nc.set(Calendar.MILLISECOND, 0);

            Date now = nc.getTime();
            map.days.each {int d ->
                use (TimeCategory) {
                    _dates.add([start: now + d.days, end: now + d.days + 23.hours + 59.minutes + 59.seconds])
                }
            }
        }
    }

    public ArrayList<Map<String, Date>> getDates() { return _dates; }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        return results.findAll { e ->
            boolean good = false
            _dates.each { d -> if ( (e.start >= d.start && e.start <= d.end)) { good = true; } }
            return good;
        }
    }
    public void postProcess(List<MusicEvent> results) {}
    public def getStats() { return null }
    public boolean getIsValid() { return _dates && _dates.size() > 0; }

}
