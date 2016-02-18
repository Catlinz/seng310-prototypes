class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/prototype/$id?"(controller: 'prototype', action: 'view')

        "/"(controller: 'prototype', action:'index')
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
