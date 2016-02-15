package com.loop.filters

import com.loop.event.CoverCharge
import com.seng310.loop.MusicEvent

class CoverChargeFilter {

    double _min
    double _max

    Map<Long, Map<String, Double>> values;

    public CoverChargeFilter(def params = null) {
        if (!params) { params = [:] }
        _min = params.min ?: 0;
        _max = params.max ?: 0;
    }

    public List<MusicEvent> processAndFilterResults(List<MusicEvent> results) {
        values = [:]

        if (isValid) {
            return results.findAll {
                Set<CoverCharge> cc = it.coverCharges
                CoverCharge cmax = cc.max { (it.max ?: it.min) ?: 0 }
                CoverCharge cmin = cc.min { it.min ?: 0 }
                double max = (cmax?.max ?: cmax?.min) ?: 0
                double min = cmin?.min ?: 0

                if ( (max >= _min && max <= _max) || (min >= _min && min <= _max) ) {
                    values[(it.id)] = [min: min, max: max]
                    return true
                }
                else { return false }
            }
        }
        else {
            results.each {
                Set<CoverCharge> cc = it.coverCharges
                CoverCharge cmax = cc.max { (it.max ?: it.min) ?: 0 }
                CoverCharge cmin = cc.min { it.min ?: 0 }
                double max = (cmax?.max ?: cmax?.min) ?: 0
                double min = cmin?.min ?: 0
                values[(it.id)] = [min: min, max: max]
            }
            return results
        }

    }

    public void postProcess(List<MusicEvent> results) {
        Map map = [:]
        results.each { map[(it.id)] = values[(it.id)] }
        values = map
    }

    public def getStats() {
        double max = _min
        double min = _max
        values.each { k, v ->
            if (v.max > max) { max = v.max }
            if (v.min < min) { min = v.min }
        }

        if (isValid) {
            if (max > _max) { max = _max }
            if (min < _min) { min = _min }
        }

        double max_r = max
        max = Math.ceil(max + 0.01)
        min = Math.floor(min)


        def buckets = []
        int numBuckets = 8
        double bw = (max - min) / numBuckets;

        for (int i = 0; i < numBuckets; ++i) {
            double s = i*bw + min
            double e = ((i + 1)*bw) + min
            buckets.add([start: s, end: e, count: values.count { k, v ->
                (v.max >= s && v.max < e) || (v.min >= s && v.min <= s) }]
            )
        }

        return [min: min, max: max_r, buckets: buckets]
    }

    public boolean getIsValid() { return _min < _max; }
}
