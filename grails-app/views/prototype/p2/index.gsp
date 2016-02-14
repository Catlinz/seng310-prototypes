<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="mockup"/>
    <title>LOOP Prototype 02</title>
    <asset:stylesheet src="mockups/prototype02.css" />
    <asset:javascript src="mockups/prototype02.js" />

</head>
<body>
    <div id="nav-bar">
        <ul>
            <li><a class="close-nav"></a></li>
            <li><a class="home ctrl-link" data-link="home">HOME</a></li>
            <li><a class="map ctrl-link" data-link="map">NEAR ME</a></li>
            <li><a class="search ctrl-link" data-link="search">SEARCH</a></li>
            <li><a class="settings">SETTINGS</a></li>
        </ul>
    </div>
    <g:render template="/prototype/p2/home" />
    <g:render template="/prototype/p2/map" />
    <g:render template="/prototype/p2/filters" />
    <g:render template="/prototype/p2/search" />
</body>
</html>
