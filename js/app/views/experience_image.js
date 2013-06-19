var app = app || {};

(function($){

    app.ExperienceImageView = Backbone.View.extend({
        el: $('#large_img'),

        tpl: _.template($("#large_img_markup").html()),

        defaults: {
            url: null
        },

        events: {
            'click .close_btn' : 'show_map'
        },

        initialize: function() {
            this.$el.empty(); // Remove any dom elements and event listeners
            this.$close = this.$('.close_btn');
            this.$map = this.$("#map_canvas");
        },

        render: function(url, caption) {
            this.url = url;
            this.caption = caption;
            this.$close.show();
            this.resize();
        },

        show_map: function() {
            this.$close.hide();
            this.$el.empty(); // Remove any dom elements and event listeners
            $("#map_canvas").fadeIn();
            $("#search").fadeIn();
            this.$el.fadeOut('fast');
            this.url = null;
        },

        resize: function() {
            if (!this.url) {
                return;
            }

            var wh = $(window).height();
            this.$el.height(wh);
            this.$el.html(this.tpl({img_original: this.url, caption: this.caption}));
            if ($('#explore_panel').hasClass('closed')) {
                this.$('img').animate({'height' : wh}, {duration: 800});
            } else {
                this.$('img').animate({'height' : wh - $('#explore_panel').height()}, {duration: 800});
            }

            this.$map.fadeOut();
            this.$el.fadeIn();
        }
    });
})(jQuery);