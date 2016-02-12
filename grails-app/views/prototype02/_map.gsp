<div class="screen map">
    <div id="map"></div>
    <div id="map-search" class="top-bar search-bar">
        <a class="icon menu-icon"></a>
        <form>
            <div class="gm-input">
                <input type="text" name="map-search-input" required="required" value=""/>
                <label>Search for an event</label>
            </div>
        </form>
        <a class="icon search-icon"></a>
    </div>
    <div class="bottom-nav-bar">
        <div class="default-nav">
            <a class="view-list left ctrl-link" data-link="search">View List</a>
            <a class="show-filters right ctrl-link" data-link="filters">Filters</a>
        </div>
        <div class="result-nav hidden"><a class="back left ctrl-link">Back</a></div>
        <div id="selected-event">
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