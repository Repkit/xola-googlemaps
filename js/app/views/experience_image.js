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
            this.$close = this.$('.close_btn');
            this.$map = this.$("#map_canvas");
        },

        render: function(url, caption) {
            this.url = url;
            this.caption = caption;
            this.$close.show();
            this.resize();
        },

        show_map: function(e) {
            this.$close.hide();
            $("#map_canvas").fadeIn();
            this.$el.fadeOut('fast');
            this.url = null;
        },

        resize: function() {
            if (!this.url) return;
            // console.log('resizing', $('#explore_panel').height(), this.url);

            var wh = $(window).height();
            this.$el.height(wh);
            this.$el.html(this.tpl({img_original: this.url, caption: this.caption}));
            this.$('img').animate({'height' : wh - $('#explore_panel').height()}, {duration: 800});
            
            this.$map.fadeOut();
            this.$el.fadeIn();
        }
    });
})(jQuery);