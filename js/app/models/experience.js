var app = app || {};

(function($){
    'use strict';

    app.Experience = Backbone.Model.extend({
        
        // localStorage: new Backbone.LocalStorage('xola-maps'),

        initialize: function() {
            // console.log('Initialized models.e', this.get('name'));
        },

        clear: function() {
            this.destroy();
        }
    });
})(jQuery);