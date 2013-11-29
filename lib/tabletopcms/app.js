
var TABLETOPCMS_DEFAULT_CONFIG = {
    ng_app: "myWebsite",
    module_paths: ['../lib/tabletopcms/modules/website.js'],
    module_names: ['tabletopcms.website']
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
                case "ng_app" :
                    tabletopcms_default_config[key] = tabletopcms_config[key];
                    break;
                case "module_paths" :
                case "module_names" :
                    if (tabletopcms_default_config.hasOwnProperty(key)) {
                        tabletopcms_default_config[key] = uniqueFilter(tabletopcms_default_config[key].concat(tabletopcms_config[key]));
                    } else {
                        tabletopcms_default_config[key] = tabletopcms_config[key];
                    }
            }
        }
    }

    return tabletopcms_default_config;
})(TABLETOPCMS_CONFIG,TABLETOPCMS_DEFAULT_CONFIG);

$script(TABLETOPCMS_DEFAULT_CONFIG.module_paths, function() {
    // when all is done, start the angular application
    angular.module(TABLETOPCMS_DEFAULT_CONFIG.ng_app,TABLETOPCMS_DEFAULT_CONFIG.module_names);
});