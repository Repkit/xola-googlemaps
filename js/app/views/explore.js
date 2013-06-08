var app = app || {};

(function($){

    app.ExploreView = Backbone.View.extend({
        wrapper: _.template($("#explore_markup").html()),

        events: {
            'click .explore_btn.closed' : 'open_panel',
            'click .explore_btn.open' : 'close_panel'
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

        open_panel: function(e) {
            var _this = this;
            
            this.$explore_panel.animate({height: "240px"});
            this.$explore.hide();

            this.$explore.addClass('open').removeClass('closed');
            this.$explore_panel.addClass('open').removeClass('closed');

            this.$explore.css('bottom', 240);
            this.$explore.fadeIn();

            this.show_photos();
        },

        close_panel: function(e) {
            this.$explore.removeClass('open').addClass('closed');
            this.$explore_panel.removeClass('open').addClass('closed');
            this.$explore_panel.animate({height: "0px"});
            this.$explore.css("bottom", "");
        },

        load_photos: function() {
            var compiled_template = _.template($("#panel_img").html());
            var that = this;
            _.each(this.medias, function(k,v) {
                if (k.type == "photo") {
                    var extn = k.src.match(/\.\w+$/);
                    var cache_img = 'http://xola.com/experiences/' + that.className + '/medias/' + k.id + "?width=260&height=200";
                    var panel_html = compiled_template({panel_img: cache_img});
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

            if (this.$explore_panel.height() > 0)
                this.$explore.css("bottom", this.$explore_panel.height());
        }
    });
})(jQuery);
