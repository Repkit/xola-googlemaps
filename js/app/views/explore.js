var app = app || {};

(function($){

    app.ExploreView = Backbone.View.extend({
        wrapper: _.template($("#explore_markup").html()),

        events: {
            'click .explore_btn.closed' : 'open_panel',
            'click .explore_btn.open' : 'close_panel',
            'click .img-container img' : 'img_click',
        },

        initialize: function() {
            // console.log('init ExploreView', this.$el);

            this.experience = this.options.e;
            this.medias = this.experience.get('medias');
            this.className = this.experience.get('id');
            this.eiv = new app.ExperienceImageView({el: $('#large_img')}); // initialize
            
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
            setTimeout(function() {
                _this.eiv.resize();
            }, 1000);
            
            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'open', 'eventLabel': this.experience.get('name') });
        },

        close_panel: function(e) {
            this.$explore.removeClass('open').addClass('closed');
            this.$explore_panel.removeClass('open').addClass('closed');
            this.$explore_panel.animate({height: "0px"});
            this.$explore.css("bottom", "");

            var _this = this;
            setTimeout(function() {
                _this.eiv.resize();
            }, 1000);
            
            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'close', 'eventLabel': this.experience.get('name') });
        },

        load_photos: function() {
            var compiled_template = _.template($("#panel_img").html());
            var that = this;
            _.each(this.medias, function(k,v) {
                if (k.type == "photo") {
                    var extn = k.src.match(/\.\w+$/);
                    var cache_img = 'http://xola.com/experiences/' + that.className + '/medias/' + k.id + "?width=260&height=200";
                    var panel_html = compiled_template({
                        exp_id: that.className, 
                        img_id: k.id, 
                        original_url: k.src,
                        panel_img: cache_img,
                        caption: k.caption || ''
                    });
                    $('.img-container').append(panel_html);
                }
            });
            
            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'load_photos', 'eventLabel': this.experience.get('name') });
        },

        show_photos: function() {
            var totalWidth = 0;
            _.each($('.img-container img'), function(k) {
                totalWidth += k.clientWidth + 1;
            });

            if (totalWidth > $("#explore").width()) {
                $("#explore_panel .explore_panel_container .img-container").width(totalWidth * 1.5);
            }

            if (this.$explore_panel.height() > 0) {
                this.$explore.css("bottom", this.$explore_panel.height());
            }

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'show_photos', 'eventLabel': this.experience.get('name') });
        },

        img_click: function(e) {
            // console.info(e.currentTarget.src, e.currentTarget.id);
            
            var elem = $("#" + e.currentTarget.id);
            var large_img = "http://xola.com" + elem.attr('data-original-url');
            var large_img_caption = elem.attr('title');
            $("#search").fadeOut();
            this.eiv.render(large_img, large_img_caption);

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'show_photos', 'eventLabel': this.experience.get('name') });
        },
    });
})(jQuery);
