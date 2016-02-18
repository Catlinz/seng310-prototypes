package com.loop.filters

import com.seng310.loop.MusicEvent

class TextFilter {

    String[] _words = null;

    public TextFilter(def map = null) {
        String val = map?.value ?: null
        String [] w = (val) ? val.split("\\s+") : []
        _words = w.collect { it.toLowerCase() }
    }

    public String[] getWords() { return _words; }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        return results.findAll { e ->
            boolean good = false
            _words.each { w ->
                if (e.name.toLowerCase().indexOf(w) > -1 || e.venue.name.toLowerCase().indexOf(w) > -1) { good = true }
            }
            return good;
        }
    }
    public void postProcess(List<MusicEvent> results) {}
    public def getStats() { return null }
    public boolean getIsValid() { return _words && _words.size() > 0; }
}
