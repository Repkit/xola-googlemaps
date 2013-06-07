var app = app || {};

(function($){

    app.ExploreView = Backbone.View.extend({
        wrapper: _.template($("#explore_markup").html()),

        events: {
            'click .explore_btn.closed' : 'explore_open',
            'click .explore_btn.open' : 'explore_closed'
        },

        initialize: function() {
            // console.log('init ExploreView', this.$el);

            this.experience = this.options.e;
            this.medias = this.experience.get('medias');
            this.className = this.experience.get('id');
            
            return this.render();
        },

        render: function() {
            this.$el.html(this.wrapper({className: this.className}));
            
            var _tmp_class = "." + this.className;
            this.$explore = this.$(_tmp_class + ' .explore_btn');
            this.$explore_panel = this.$(_tmp_class+ ' .explore_panel');
            this.load_photos(); // Start pre-loading photos
            
            return this;
        },

        explore_open: function(e) {
            this.$explore.addClass('open').removeClass('closed');
            this.$explore_panel.addClass('open').removeClass('closed');
            this.$explore_panel.fadeIn('800');
            this.show_photos();
        },

        explore_closed: function(e) {
            this.$explore.removeClass('open').addClass('closed');
            this.$explore_panel.removeClass('open').addClass('closed');
            this.$explore_panel.fadeOut();
            this.$explore.css("bottom", "");
        },

        load_photos: function() {
            var compiled_template = _.template($("#panel_img").html());
            _.each(this.medias, function(k,v) {
                if (k.type == "photo") {
                    var panel_html = compiled_template({panel_img: 'http://xola.com' + k.src});
                    $('.img-container').append(panel_html);
                }
            });
        },

        show_photos: function() {
            var totalWidth = 0;
            _.each($('.img-container img'), function(k) {
                totalWidth += k.clientWidth + 1;
            });

            if (totalWidth > $("#explore").width()) {
                $("#explore-panel .explore-panel-container .img-container").width(totalWidth * 1.5);
            }

            this.$explore.css("bottom", $("#explore-panel").height());
        }
    });
})(jQuery);
