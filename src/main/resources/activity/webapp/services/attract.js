LiquidGalaxyApp.service('AttractLoopService', function($rootScope, UIEvents, $timeout, PoiService) {
    var initialDelay = 4000;  // Delay between loading page and the first time it sets up the timer

        // XXX Change these to something bigger for production
    var attractLoopTimeout = 5000;  // How long to wait for some UI activity before starting the loop
    var attractPointDelay  = 5000;  // How long to wait between points in the loop

    var attractTimer   = null;
    var nextPointTimer = null;
    var poiContent, poiPages;
    var prevPage = null, prevPoiIndex = null;

    var nextPoint = function () {
        // Select random POI, different from the one we're currently on, here.
        var poiPage = prevPage, poiIndex = prevPoiIndex;
       
        // If we've only got one point, choose it. If we have more than one, select a new one
        if (poiPages.length === 0 && poiContent[poiPages[0].name].pages.length === 0) {
            poiPage = 0;
            poiIndex = 0;
        }
        else {
            while (poiPage === prevPage && poiIndex === prevPoiIndex) {
                poiPage = Math.floor(Math.random() * poiPages.length);
                poiIndex = Math.floor(Math.random() * poiContent[poiPages[poiPage].name].points.length);
            }
        }
        prevPage = poiPage;
        prevPoiIndex = poiIndex;
        var poi = poiContent[poiPages[poiPage].name].points[poiIndex];

        console.log("Attract loop moving to new POI: " + JSON.stringify(poi));
        $rootScope.$broadcast(UIEvents.Poi.SelectPoi, poi);
        nextPointTimer = $timeout(nextPoint, attractPointDelay);
    }

    var startAttractLoop = function () {
        console.debug("Attract loop starting");
        if (typeof nextPointTimer !== 'undefined') {
            $timeout.cancel(nextPointTimer);
        };
        nextPointTimer = $timeout(nextPoint, attractPointDelay);
    };

    var startTimer = function() {
        if (typeof attractTimer !== 'undefined') {
            $timeout.cancel(attractTimer);
        };
        if (typeof nextPointTimer !== 'undefined') {
            $timeout.cancel(nextPointTimer);
        };
        attractTimer = $timeout(startAttractLoop, attractLoopTimeout);
    };

    var watchForMessage = function (a) {
        var m = a;
        $rootScope.$on(a, function() {
            console.debug("Attract loop received message " + m);
            startTimer();
        });
    };

    var events = [
        UIEvents.Keyboard.KeyPress,
        UIEvents.Map.ZoomChanged,
        UIEvents.Map.SelectPano,
        UIEvents.MapMode.SelectMode,
        UIEvents.Page.SelectPage,
        UIEvents.Poi.SelectPoi,
        UIEvents.Search.Query,
        UIEvents.Search.Activated,
        UIEvents.Search.Deactivated
    ];

    for (var i = 0; i < events.length; i++) {
        watchForMessage(events[i]);
    };

    $rootScope.$watch(
        function() { return PoiService.valid; },
        function () {
            poiContent = PoiService.content;
            poiPages = PoiService.pages;
        }
    );

    $timeout(function() { startTimer() }, initialDelay);
});
