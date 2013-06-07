var app = app || {};

(function($){

    app.ExperienceListView = Backbone.View.extend({

        marker_img : {
            'River Rafting' : 'waterpark.png',
            'Trekking / Hiking' : 'hiking.png',
            'Kayaking & Canoeing' : 'kayaking.png',
            'Fly Fishing' : 'fishing.png',
            'Food & Wine' : 'restaurant.png',
            "Sailing" : 'sailing.png',
            'Cycling & Mountain Biking' : 'cycling.png',
            "Deep Sea Fishing": 'deepseafishing.png', 
            "Guide School": 'walkingtour.png', 
            "River Tubing ": '', 
            "Safety Training": '', 
            "Team Building": '', 
            "Bungee Jumping": '', 
            "Caving / Spelunking": 'spelunking.png', 
            "River Cruises": 'cruiseship.png', 
            "Skydiving": 'diving.png', 
            "Surfing": 'surfing.png', 
            "Website Creation": '', 
            "Lake Fishing": 'fishing.png', 
            "Parachuting": 'paragliding.png', 
            "Paragliding": 'paragliding.png', 
            "Mountaineering": 'mountains.png', 
            "Aerial Tours": 'helicopter.png', 
            "Creative Classes": '', 
            "Snowshoeing": 'snowshoeing.png', 
            "Windsurfing & Kitesurfing": 'kitesurfing.png', 
            "Art & Architecture": '', 
            "Birdwatching": 'birds-2.png', 
            "Hang Gliding ": 'hanggliding.png', 
            "Wilderness Training": '', 
            "Ballooning": 'hotairbaloon.png', 
            "Walking Tours": 'walkingtour.png', 
            "Backpacking/Camping": 'camping-2.png', 
            "Culture & History": '', 
            "Eco-Tour/Hike": '', 
            "Marine Wildlife": '', 
            "Snowmobiling": 'snowmobiling.png', 
            "Wakeboarding": 'boardercross.png', 
            "Zip-lining": '', 
            "Beer Tour": 'beergarden.png', 
            "Photography": 'photography.png', 
            "Snowkiting": 'snowboarding.png', 
            "Stand Up Paddle (SUP)": 'surfpaddle.png', 
            "Off-road": 'atv.png', 
            "Helicopter Tours": 'helicopter.png', 
            "Horseback Riding": 'horseriding.png', 
            "Rock Climbing": 'climbing.png'
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

            var current_marker_img = this.marker_img[obj.get('category')] ? 'images/markers/' + this.marker_img[obj.get('category')] : '';
            console.log(current_marker_img);
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
            marker.InfoWindow = new google.maps.InfoWindow({
                content: _tpl(obj.toJSON())
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