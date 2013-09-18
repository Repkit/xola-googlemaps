var app = app || {};

(function(){
    'use strict';

    app.Experience = Backbone.Model.extend({
        isMappable : function() {
            return this.get('photo') && this.get('geo') && this.get('complete') == true;
        }
    });
})();