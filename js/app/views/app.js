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

            var _this = this;

            // Let's setup the map
            var styles = [{
                elementType: "geometry",
                stylers: [{ lightness: 23 }, { saturation: -10 }]
            }];

            var options = {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(38.472024, -96.183594), // Top/Bottom, Left/Right
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

            var fetch = app.Experiences.fetch();
            fetch.then(function() {
                $("#loading").slideUp();
                _this.map = new google.maps.Map(document.getElementById('map_canvas'), options); // use of $ doesnt work

                // For our experiences, let's plot them on the map
                google.maps.event.addListenerOnce(_this.map, 'idle', function(){
                    var experience_view = new app.ExperienceListView({model: app.Experiences, map: _this.map});
                });

                $("#search").slideDown();
            });
        },

        find_coordinates: function(e) {
            if (e.which != 1 && e.which != 13) return;

            var txt = encodeURIComponent($("#search_txt").val());
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + txt + "&sensor=false";

            ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'click','eventLabel': txt});

            var _this = this;
            $.getJSON(url, function(data) {
                // console.info(data);
                var loc = data.results[0].geometry.location;
                var formatted_address = data.results[0].formatted_address;
                ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'success','eventLabel': formatted_address});
                // console.info(loc, formatted_address);
                _this.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
                _this.map.setZoom(9);
            });
        }
    });
})(jQuery);