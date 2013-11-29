
var TABLETOPCMS_DEFAULT_CONFIG = {
    ng_app: "myWebsite",
    module_paths: ['../lib/tabletopcms/modules/website/website.js'],
    module_names: ['tabletopcms.website'],
    sitemap_id: ''
};

//custom merge the two objects
TABLETOPCMS_DEFAULT_CONFIG = (function(tabletopcms_config,tabletopcms_default_config){
    if (tabletopcms_config) {
        function uniqueFilter(array) {
            var a = array.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        }

        for (var key in tabletopcms_config) {
            switch(key) {
                case "module_paths" :
                case "module_names" :
                    if (tabletopcms_default_config.hasOwnProperty(key)) {
                        tabletopcms_default_config[key] = uniqueFilter(tabletopcms_default_config[key].concat(tabletopcms_config[key]));
                    } else {
                        tabletopcms_default_config[key] = tabletopcms_config[key];
                    }
                    break;
                default:
                    tabletopcms_default_config[key] = tabletopcms_config[key];
            }
        }
    }

    return tabletopcms_default_config;
})(TABLETOPCMS_CONFIG,TABLETOPCMS_DEFAULT_CONFIG);


$script(TABLETOPCMS_DEFAULT_CONFIG.module_paths, function() {
    // when all is done, start the angular application
    var tabletopcms_app = angular.module(TABLETOPCMS_DEFAULT_CONFIG.ng_app,TABLETOPCMS_DEFAULT_CONFIG.module_names);

    //attach any defined routes
    if (TABLETOPCMS_DEFAULT_CONFIG.hasOwnProperty("sitemap_id")) {
        //generate the routes array based on sitemap html data
        var routes = (function(sitemap_id){
            function createRoutesArray($list) {
                var child_routes = [];
                $list.each(function() {
                    var object = {};
                    var $a_tag = jQuery(this).children("a");
                    object.when = $a_tag.attr("href");
                    object.templateUrl = $a_tag.attr("data-template-url");
                    if ($a_tag.attr("data-controller")!='') {
                        object.controller = $a_tag.attr("data-controller");
                    }
                    child_routes.push(object);
                });
                return child_routes;
            }

            var routes = [];
            var $sitemap_tree = jQuery(sitemap_id).children("ul");
            $sitemap_tree.each(function() {
                routes = routes.concat( createRoutesArray(jQuery(this).children("li")) );
            });

            return routes;
        })(TABLETOPCMS_DEFAULT_CONFIG.sitemap_id);

        //register them in angular
        tabletopcms_app.config(['$routeProvider', function($routeProvider) {
            for (var i=0; i<routes.length; i++) {
                $routeProvider.when(routes[i].when,
                {
                    templateUrl: routes[i].templateUrl,
                    controller:  routes[i].hasOwnProperty("controller") ? routes[i].controller : 'WebpageController'
                });
            }
        }]);
    }
});