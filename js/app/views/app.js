var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        template : '#mainTpl',

        // Click events for the search button to be moved
        events: {
            "click #search-btn": "findCoordinates",
            "keypress #search-txt": "findCoordinates"
        },

        initialize: function() {
            this.$el.append(_.template($(this.template).html()));
            $('body').append(this.el);

            this.render();
        },

        render : function() {
            var self = this;

            var mapView = new app.MapView();
            mapView.render();

            mapView.on('load:first', function() {
                var geo = mapView.coords.geo.split(',');
                mapView.map = new google.maps.Map(document.getElementById("map-canvas"));
                mapView.map.setCenter(new google.maps.LatLng(geo[0], geo[1]));
                mapView.map.setZoom(10);
                mapView.map.setOptions(mapView.options);
                mapView.setMarkers();

                self.$el.find("#loading").fadeOut();
                self.$el.find("#search").fadeIn();
                self.map = mapView.map;
            });
        },

        findCoordinates : function(e) {
            if (e.which !== 1 && e.which !== 13) {
                return;
            }

            var txt = encodeURIComponent($("#search-txt").val());
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + txt + "&sensor=false";

            ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'click','eventLabel': txt});

            var self = this;
            $.getJSON(url, function(data) {
                var loc = data.results[0].geometry.location;
                var formatted_address = data.results[0].formatted_address;
                ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'success','eventLabel': formatted_address});

                var bounds = data.results[0].geometry.viewport;

                var boundsSW = new google.maps.LatLng(bounds.southwest.lat, bounds.southwest.lng);
                var boundsNE = new google.maps.LatLng(bounds.northeast.lat, bounds.northeast.lng);

                var latBounds = new google.maps.LatLngBounds(boundsSW, boundsNE);

                self.map.fitBounds(latBounds);
                self.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
            });

        }
    });
})(jQuery);
