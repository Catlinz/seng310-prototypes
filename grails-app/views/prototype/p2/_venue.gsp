<div class="venue">
    <h2>${venue.name}</h2>
    <g:each var="event" in="${venue.events}">
        <div class="event clicky" data-id="${event.id}">
            <h3 class="title"><loop:eventTitle event="${event}" /></h3>
            <a class="venue" data-id="${event.venue.id}">${event.venue.name}</a>
            <span class="time"><loop:eventTime event="${event}" /></span>
        </div>
    </g:each>

</div>
