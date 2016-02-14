package com.seng310.prototypes

class PrototypeController {

    def index() {

    }

    def view() {
        def model = [
                useGoogleMaps: params.g ?: false
        ]
        render(view: "/prototype/p${params.id}/index", model: model)
    }
}
