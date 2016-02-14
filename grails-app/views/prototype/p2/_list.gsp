<g:each var="event" in="${events}">
    <g:render template="/prototype/p2/event" model="[event: event]"/>
</g:each>