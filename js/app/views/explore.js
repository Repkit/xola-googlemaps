var app = app || {};

(function($){

    app.ExploreView = Backbone.View.extend({
        el: $("#explore"),

        events: {
            'click #explore_btn' : 'explore_btn_click'
        },

        initialize: function() {
            console.log('init ExploreView');
            this.$explore = this.$('#explore_btn');
            this.$explore_panel = this.$('#explore-panel');

            this.$explore.fadeIn();
        },

        explore_btn_click : function(e) {
            console.log(e);
            this.$explore.toggleClass('open').toggleClass('closed');
            this.$explore_panel.toggleClass('open').toggleClass('closed');
            this.$explore_panel.fadeIn();
        }
    });
})(jQuery);
