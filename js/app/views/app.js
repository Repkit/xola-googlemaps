var app = app || {};

(function($){

    // var Experiences = new app.Experiences();
    app.AppView = Backbone.View.extend({
        el: $("#controls_container"),

        initialize: function() {
            var styles = [{
                elementType: "geometry",
                stylers: [{ lightness: 33 }, { saturation: -30 }]
            }];

            var options = {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(37.472024, -96.183594),
                styles: styles
            };

            this.map = new google.maps.Map(document.getElementById('map_canvas'), options); // use of $ doesnt work

            // Need to wait for the map to load before we plot our experiences
            var _this = this;
            app.Experiences.fetch();

            // For our experiences, let's plot them on the map
            setTimeout(function() {
                var experience_view = new app.ExperienceListView({model: app.Experiences, map: _this.map});
            }, 1000);
        }
    });
})(jQuery);