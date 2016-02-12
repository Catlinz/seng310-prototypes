package com.seng310.prototypes

class Prototype02Controller {

    def index() {

        return [useGoogleMaps: params.g ?: false];
    }
}
