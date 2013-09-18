var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        template : '#mainTpl',

        // Click events for the search button to be moved
        events: {
            "click #search_btn": "find_coordinates",
            "keypress #search_txt": "find_coordinates"
        },

        initialize: function() {
            console.debug('init');
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
                mapView.map.setZoom(7);
                mapView.map.setOptions(mapView.options);
                mapView.setMarkers();

                self.$el.find("#loading").fadeOut();
                self.$el.find("#search").fadeIn();
            });
        }
    });
})(jQuery);