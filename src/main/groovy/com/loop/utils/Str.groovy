package com.loop.utils

import java.text.NumberFormat

/**
 * Created by Catlin on 2016-02-13.
 * Class to provide certain formatting
 */
class Str {

    static String shortTime(Date time) {
        if (time) { return (time[Calendar.MINUTE] == 0) ? time.format("ha") : time.format("h:ma") }
        else { return null }
    }

    static String shortDay(Date date) {
        return (date) ? date.format("EEE, MMM d, yyyy") : null
    }

    static String currency(def amt, Locale locale = null) {
        NumberFormat fmt = (locale) ? NumberFormat.getCurrencyInstance(locale) : NumberFormat.currencyInstance
        return fmt.format(amt);
    }

}
