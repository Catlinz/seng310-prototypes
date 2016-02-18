<g:set var="day" value="-2" />
<g:each var="event" in="${events}">
    <g:if test="${day != event.day}">
        <g:set var="day" value="${event.day}"/>
        <g:if test="${event.start}">
            <h4><g:formatDate date="${event.start}" format="EEEE MMM. dd"/></h4>
        </g:if>
        <g:else><h4>Coming Soon</h4></g:else>
    </g:if>
    <g:render template="/prototype/p2/event" model="[event: event]"/>
</g:each>