var app = app || {};

(function(){
    'use strict';

    app.Experience = Backbone.Model.extend({

        initialize: function() {
        },

        clear: function() {
            this.destroy();
        }
    });
})();