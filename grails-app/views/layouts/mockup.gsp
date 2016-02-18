<%@ page contentType="text/html;charset=UTF-8" %>
<!doctype html>
<html>
<head>
    <title><g:layoutTitle default="LOOP Mockup"/></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="mobile-web-app-capable" content="yes">

    <!-- iPad retina portrait startup image -->
    <link href="http://loop.kttz.in/assets/startup1536x2008.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPad retina landscape startup image -->
    <link href="http://loop.kttz.in/assets/startup1496x2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPad non-retina portrait startup image -->
    <link href="http://loop.kttz.in/assets/startup768x1004.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 1) and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPad non-retina landscape startup image -->
    <link href="http://loop.kttz.in/assets/startup748x1024.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 1) and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 Plus portrait startup image -->
    <link href="http://loop.kttz.in/assets/startup1242x2148.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 Plus landscape startup image -->
    <link href="http://loop.kttz.in/assets/startup1182x2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image">

    <!-- iPhone 6 startup image -->
    <link href="http://loop.kttz.in/assets/startup750x1294.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone 5 startup image -->
    <link href="http://loop.kttz.in/assets/startup640x1096.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone < 5 retina startup image -->
    <link href="http://loop.kttz.in/assets/startup640x920.png"
          media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iPhone < 5 non-retina startup image -->
    <link href="http://loop.kttz.in/assets/startup320x460.png"
          media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)"
          rel="apple-touch-startup-image">
    
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
