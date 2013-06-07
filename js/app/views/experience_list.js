var app = app || {};

(function($){

    app.ExperienceListView = Backbone.View.extend({

        marker_img : {
            'River Rafting' : 'waterpark',
            'Trekking / Hiking' : 'hiking',
            'Kayaking & Canoeing' : 'kayaking',
            'Fly Fishing' : 'fishing',
            'Food & Wine' : 'restaurant',
            "Sailing" : 'sailing',
            'Cycling & Mountain Biking' : 'cycling',
            "Deep Sea Fishing": 'deepseafishing', 
            "Guide School": 'walkingtour', 
            "River Tubing ": '', 
            "Safety Training": '', 
            "Team Building": '', 
            "Bungee Jumping": '', 
            "Caving / Spelunking": 'spelunking', 
            "River Cruises": 'cruiseship', 
            "Skydiving": 'diving', 
            "Surfing": 'surfing', 
            "Website Creation": '', 
            "Lake Fishing": 'fishing', 
            "Parachuting": 'paragliding', 
            "Paragliding": 'paragliding', 
            "Mountaineering": 'mountains', 
            "Aerial Tours": 'helicopter', 
            "Creative Classes": '', 
            "Snowshoeing": 'snowshoeing', 
            "Windsurfing & Kitesurfing": 'kitesurfing', 
            "Art & Architecture": '', 
            "Birdwatching": 'birds-2', 
            "Hang Gliding ": 'hanggliding', 
            "Wilderness Training": '', 
            "Ballooning": 'hotairbaloon', 
            "Walking Tours": 'walkingtour', 
            "Backpacking/Camping": 'camping-2', 
            "Culture & History": '', 
            "Eco-Tour/Hike": '', 
            "Marine Wildlife": '', 
            "Snowmobiling": 'snowmobiling', 
            "Wakeboarding": 'boardercross', 
            "Zip-lining": 'ziplining', 
            "Beer Tour": 'beergarden', 
            "Photography": 'photography', 
            "Snowkiting": 'snowboarding', 
            "Stand Up Paddle (SUP)": 'surfpaddle', 
            "Off-road": 'atv', 
            "Helicopter Tours": 'helicopter', 
            "Horseback Riding": 'horseriding', 
            "Rock Climbing": 'climbing'
        },

        initialize: function(opts) {
            this.map = opts.map;
            this.model = opts.model;
            this.oms = new OverlappingMarkerSpiderfier(this.map);
            this.renderAll();
        },

        renderAll: function() {
            var _this = this;
            _.map(this.model.all(), this.renderMarker, this);

            this.oms.addListener('click', function(marker, event) {
                _this.show_info.call(marker)
            });

            this.oms.addListener('spiderfy', function(markers) {
                _.invoke(markers, _this.hide_info);
            });
        },

        renderMarker: function(obj) {
            var that = this;

            var current_marker_img = this.marker_img[obj.get('category')] ? this.marker_img[obj.get('category')] : 'blank';
            current_marker_img = 'images/markers/' + current_marker_img + ".png?r=3";
            var marker = new google.maps.Marker({
                map: that.map,
                experience: obj,
                experienceView: '',
                icon: current_marker_img,
                position: new google.maps.LatLng(obj.get('geo').lat, obj.get('geo').lng),
                title: obj.get('name'),
                descr : obj.get('excerpt'),
                id : obj.get('id')
            });

            var _tpl = _.template($("#marker_info").html());
            var cache_img = 'http://xola.com/experiences/' + obj.get('id') + '/medias/' + obj.get('photo').id + '?width=260&height=200';
            var jsonObj = obj.toJSON();
            jsonObj['cache_img'] = cache_img;
            marker.InfoWindow = new google.maps.InfoWindow({
                content: _tpl(jsonObj)
            });

            // google.maps.event.addListener(this.marker, 'mouseover', this.show_info);
            // google.maps.event.addListener(this.marker, 'mouseout', this.hide_info);
            // google.maps.event.addListener(this.marker, 'click', this.show_detail);
            google.maps.event.addListener(marker.InfoWindow, 'closeclick', function() {
                that.hide_info.call(marker)
            });

            that.oms.addMarker(marker);
        },

        show_info: function() {
            $("#explore_btn").hide();
            $("#explore-panel").hide();

            this.InfoWindow.open(this.map, this);
            this.experienceView = new app.ExploreView({el: $('#explore'), e: this.experience});
        },

        hide_info: function() {
            $("#explore_btn").fadeOut();
            if (this.experienceView) {
                this.experienceView.explore_closed(this);
                this.experienceView.undelegateEvents();
            }
        },


        show_detail: function() {
        }
    });

})(jQuery);