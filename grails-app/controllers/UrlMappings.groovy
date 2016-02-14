class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/prototype/$id?"(controller: 'prototype', action: 'view')

        "/"(controller: 'prototype', view:'index')
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
