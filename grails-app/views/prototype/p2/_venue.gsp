<div class="venue">
    <h2>${venue.name}</h2>
    <g:each var="event" in="${venue.events}">
        <g:render template="/prototype/p2/event" model="[event: event]"/>
    </g:each>

</div>
