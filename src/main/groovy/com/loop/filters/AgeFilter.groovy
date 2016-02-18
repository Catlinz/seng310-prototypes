package com.loop.filters

import com.seng310.loop.AgeRestriction
import com.seng310.loop.MusicEvent

class AgeFilter {

    boolean _hideAdultOnly;

    public AgeFilter(def map = null) {
        _hideAdultOnly = map?.hideAdultOnly ?: false
    }

    public boolean getHideAdultOnly() { return _hideAdultOnly; }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        return results.findAll { e -> return (_hideAdultOnly && e.age == AgeRestriction.NO_RESTRICTION) || (!_hideAdultOnly) }
    }
    public void postProcess(List<MusicEvent> results) {}
    public def getStats() { return null }
    public boolean getIsValid() { return true; }
}
