<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="mobile-web-app-capable" content="yes">
    <title><g:layoutTitle default="LOOP Mockup"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Open+Sans+Condensed:300' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,300' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script>
    <g:if test="${useGoogleMaps}">
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDeMSONmS4ZePPnuhZwnjX6mYhyZPc8CWk"></script>
    </g:if>
    <asset:stylesheet src="mockups/common.css" />
    <asset:javascript src="mockups/common.js" />
    <asset:link rel="shortcut icon" href="icons/favicon.png" type="image/x-icon" />
    <asset:link rel="apple-touch-icon" href="icons/apple-touch-icon.png" />
    <asset:link rel="apple-touch-icon-precomposed" href="icons/apple-touch-icon@2x.png" sizes="120x120" />
    <asset:link rel="apple-touch-startup-image" href="startup.png" />

    <g:layoutHead/>
</head>
<body>
    <div id="screen-container">
        <div class="ios-standalone-bar"></div>
        <g:layoutBody/>
    </div>
    <asset:deferredScripts />
</body>
</html>
