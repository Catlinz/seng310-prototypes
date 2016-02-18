package com.seng310.prototypes

class PrototypeController {

    def index() {
        def model = [
                useGoogleMaps: params.g ?: false
        ]
        render(view: "/prototype/p2/index", model: model)
    }

    def view() {
        def model = [
                useGoogleMaps: params.g ?: false
        ]
        render(view: "/prototype/p${params.id}/index", model: model)
    }
}
