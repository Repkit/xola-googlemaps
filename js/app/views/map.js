var app = app || {};

(function($){
    app.MapView = Backbone.View.extend({
        rendered : false,
        markerImg : {
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

        initialize : function(opts) {
            console.debug('init mapview');
            this.markers = [];
        },

        render : function() {
            var self = this;
            // Let's setup the map
            var styles = [{
                elementType: "geometry",
                stylers: [{ lightness: 23 }, { saturation: -10 }]
            }];

            // By default set fixed Geo-cordinates of Mountain View, CA
            // long, lat
            var defaultCoords = [37.413114,-122.070336];
            this.coords = { geo: defaultCoords.join(',') };
            if (navigator.geolocation) {
                // We have the user's Geo Location - let's center the map around that area
                navigator.geolocation.getCurrentPosition(
                    function(pos) {
                        //self.coords = { geo: pos.coords.latitude + "," + pos.coords.longitude };
                    },
                    function(e) {
                        console.warn(e);
                    }
                );
            }

            var geo = this.coords.geo.split(',');
            this.options = {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(geo[0], geo[1]), // Center of the US
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                styles: styles
            };

            this.collection = new app.ExperiencesCollection({coords : this.coords});

            // Fire an event when we receive the first batch of data
            this.listenToOnce(this.collection, 'add', function(e) {
                self.trigger('load:first');
            });
        },

        setMarkers : function() {
            var self = this;

            this.oms = new OverlappingMarkerSpiderfier(this.map);

            // For every point received, put it on the map
            this.listenTo(this.collection, 'add', function(experience) {
                var markerView = new app.MarkerView({map: self.map});
                var marker = markerView.plotExperience(experience);
                if (marker) {
                    self.markers.push(marker);
                    self.oms.addMarker(marker);
                }
            });

            this.oms.addListener('click', function(marker) {
                self.showInfo.call(marker, self.$el);
            });

            this.oms.addListener('spiderfy', function(markers) {
                _.invoke(markers, self.hideInfo);
            });
        },

        showInfo : function($el) {
            // We are in scope of the marker
            this.InfoWindow.open(this.map, this);
            this.exploreView = new app.ExploreView({experience: this.experience});
            $("#explore").append(this.exploreView.el);
            this.exploreView.render();
        },

        hideInfo : function() {

        },

        clear: function() {
            _.each(this.markers, function(marker) {
                marker.setMap(null);
            })
        },

        exists: function(id) {
            var exists = false;
            _.each(this.markers, function(marker) {
                if (marker.experience.get('id') == id) {
                    exists = true;
                }
            });

            return exists;
        }
    });
})(jQuery);