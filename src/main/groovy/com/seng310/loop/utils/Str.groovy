package com.seng310.loop.utils

/**
 * Created by Catlin on 2016-02-13.
 * Class to provide certain formatting
 */
class Str {

    static String shortTime(Date time) {
        if (time) { return (time[Calendar.MINUTE] == 0) ? time.format("Ka") : time.format("K:ma") }
        else { return null }
    }

    static String shortDay(Date date) {
        return (date) ? date.format("EEE, MMM d, yyyy") : null
    }

}
