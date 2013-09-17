var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        el: $("#search"),

        events: {
            "click #search_btn": "find_coordinates",
            "keypress #search_txt": "find_coordinates"
        },

        initialize: function() {

            $("#explore_btn").hide();
            $("#explore_panel").hide();
            $("#search").hide();

            var self = this;

            // Let's setup the map
            var styles = [{
                elementType: "geometry",
                stylers: [{ lightness: 23 }, { saturation: -10 }]
            }];

            var options = {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(38.472024, -96.183594), // Center of the US
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

            // By default set fixed Geo-cordinates of Mountain View, CA
            // long, lat
            var coords = { geo: "37.413114,-122.070336" };
            if (navigator.geolocation) {
                // We have the user's Geo Location - let's center the map around that area
                navigator.geolocation.getCurrentPosition(
                    function(pos) {
                        console.debug(pos);
                        //coords = { geo: pos.coords.longitude + "," + pos.coords.latitude  };
                    },
                    function(e) {
                        console.warn(e);
                    }
                );
            }

            var experiencesCollection = new app.ExperiencesCollection();
            var fetch = experiencesCollection.fetch(coords);

            fetch.then(function() {
                self.map = new google.maps.Map(document.getElementById('map_canvas'), options); // use of $ doesnt work

                $("#loading").slideUp();
                var geo = coords.geo.split(',');
                self.map.setCenter(new google.maps.LatLng(geo[0], geo[1]));
                self.map.setZoom(7);

                // For our experiences, let's plot them on the map
                google.maps.event.addListenerOnce(self.map, 'idle', function(){
                    var elView = new app.ExperienceListView({collection: experiencesCollection, map: self.map});
                    elView.listenTo(experiencesCollection, 'change', elView.renderAll);
                });

                $("#search").slideDown();

                $.get('last_updated.txt', function(data) {
                    var last_updated = data.replace(/Date:\s+/, 'Last Updated: ');
                    $('div.last_updated').html(last_updated);
                });
            });
        },

        find_coordinates: function(e) {
            if (e.which !== 1 && e.which !== 13) {
                return;
            }

            var txt = encodeURIComponent($("#search_txt").val());
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + txt + "&sensor=false";

            ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'click','eventLabel': txt});

            var self = this;
            $.getJSON(url, function(data) {
                // console.info(data);
                var loc = data.results[0].geometry.location;
                var formatted_address = data.results[0].formatted_address;
                ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'success','eventLabel': formatted_address});
                // console.info(loc, formatted_address);
                self.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
                self.map.setZoom(9);
            });
        }
    });
})(jQuery);