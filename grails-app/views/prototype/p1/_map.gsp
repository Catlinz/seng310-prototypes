<div class="screen map">
    <div id="map"></div>
    <div id="search-bar" class="search-bar">
        <div class="search-icon"></div>
        <form id="gm-global-search">
            <div class="gm-input">
                <input type="text" name="gm-search-game" required="required" value=""/>
                <label>Search for an event</label>
            </div>
        </form>
        <a class="clear-search">&times;</a>
    </div>
    <a class="show-filters ctrl-link" data-link="filters">
        <span class="icon"></span>
    </a>

    <div id="event-list">
        <a class="toggle"></a>
        <div class="gm-scrollable" id="events-content" data-gmAutoHide="true">
            <!--<a class="event">
                <div class="event-id">B</div>
                <h3>Event Title 2 <span class="locale">Locale 2</span></h3>
                <div class="location">4322 Other Rd, Saanich BC</div>
                <div class="time">11pm - 2am</div>
                <a class="directions">Directions</a>
            </a>-->
        </div>
        <div id="selected-event">
            <div class="back-button">
                <a class="back">< Back</a>
            </div>
            <div class="event">
                <div class="event-id"></div>
                <h3 class="title"></h3>
                <div class="location"></div>
                <div class="time"></div>
                <a class="directions">Directions</a>
            </div>
        </div>
    </div>
</div>