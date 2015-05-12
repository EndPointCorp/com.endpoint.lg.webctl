LiquidGalaxyApp.service('PanoViewerService', function($rootScope, MessageService, MasterService, ActivityGroups) {
    var change_pano = function (url, pano_type) {
        console.log("Changing pano to " + url);
        MessageService.emit('pano_change', {
            "src": "touchscreen",
            "extra": {
                "type": "pano",
                "fileurl": url,
                "filetype": pano_type
            }
        });
    };

    /**
     * Starts up the pano viewer activity group.
     */
    function startup() {
        console.debug("Startup pano viewer");
        MasterService.startupLiveActivityGroupByName(ActivityGroups.PanoViewer);
    }
  
    /**
     * Shuts down the pano viewer activity group.
     */
    function shutdown() {
        console.debug("Shutdown pano viewer");
        MasterService.shutdownLiveActivityGroupByName(ActivityGroups.PanoViewer);
    }
  
    /**
     * Activates the pano viewer activity group.
     */
    function activate() {
        console.debug("Activate pano viewer");
        MasterService.activateLiveActivityGroupByName(ActivityGroups.PanoViewer);
    }
  
    /**
     * Deactivates the pano viewer activity group.
     */
    function deactivate() {
        console.debug("Deactivate pano viewer");
        MasterService.deactivateLiveActivityGroupByName(ActivityGroups.PanoViewer);
    }

    return {
        startup: startup,
        shutdown: shutdown,
        activate: activate,
        deactivate: deactivate,
        change_pano: change_pano
    };
});

