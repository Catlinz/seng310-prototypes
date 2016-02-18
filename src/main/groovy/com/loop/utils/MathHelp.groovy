package com.loop.utils

class MathHelp {

    public static int nextIntegerMultiple(double val, int base) {
        return ((((int)val) - (((int)val) % base)) + 10);
    }
}
