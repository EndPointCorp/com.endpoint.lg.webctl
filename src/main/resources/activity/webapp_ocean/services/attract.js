LiquidGalaxyApp.service('AttractLoopService', function($rootScope, UIEvents, $timeout, PoiService) {
    var initialDelay = 4000;  // Delay between loading page and the first time it sets up the timer

    var attractLoopTimeout = 5 * 60 * 1000;  // How long to wait for some UI activity before starting the loop
    var attractPointDelay  = 30 * 1000;      // How long to wait between points in the loop
    var ignoreMsgInterval  = 500;            // How long to ignore incoming messages after we switch to a
                                             // new point in the attract loop. This prevents the attract loop
                                             // from thinking its own navigation is from a user, and
                                             // turning itself off. XXX HACK!!1 But it seems to work ok XXX
    var isRunning = false;

    function isAttractLoopRunning() {
        return isRunning;
    }

    if (IS.Configuration.hasOwnProperty('attractLoop.timeout')) {
        attractLoopTimeout = IS.Configuration['attractLoop.timeout'];
    }
    if (IS.Configuration.hasOwnProperty('attractLoop.pointDelay')) {
        attractLoopPointDelay = IS.Configuration['attractLoop.pointDelay'];
    }
    if (IS.Configuration.hasOwnProperty('attractLoop.ignoreMsgInterval')) {
        ignoreMsgInterval = IS.Configuration['attractLoop.ignoreMsgInterval'];
    }

    var attractTimer   = null;
    var nextPointTimer = null;
    var poiContent, poiPages;
    var prevPage = null, prevPoiIndex = null;
    var ignoreMsg = false;

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
        ignoreMsg = true;
        $timeout(function () { ignoreMsg = false; }, ignoreMsgInterval);
        poi.attractLoop = true;
        $rootScope.$broadcast(UIEvents.Poi.SelectPoi, poi);
        nextPointTimer = $timeout(nextPoint, attractPointDelay);
    }

    var startAttractLoop = function () {
        console.debug("Attract loop starting");
        if (typeof nextPointTimer !== 'undefined') {
            $timeout.cancel(nextPointTimer);
        };
        isRunning = true;
        nextPoint();
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

        $rootScope.$on(a, function(ev, arg) {
            // This conditional makes sure the attract loop timer doesn't reset
            // itself with its own messages
            if (! ignoreMsg) {
                console.debug("Attract loop resetting timer; received message " + m);
                startTimer();
                isRunning = false;

                // If I've just reset, I don't need to capture *every* new message for a little bit, to save cycles if messages are coming in quickly.
                ignoreMsg = true;
                $timeout(function () { ignoreMsg = false; }, 200);
            };
        });
    };

    var events = [
        'body-click',
        'spacenav'
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

    return {
        isAttractLoopRunning: isAttractLoopRunning
    };
});
