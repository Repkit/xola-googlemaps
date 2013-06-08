var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        el: $("#controls_container"),

        initialize: function() {

            $("#explore_btn").hide();
            $("#explore_panel").hide();

            var _this = this;

            // Let's setup the map
            var styles = [{
                elementType: "geometry",
                stylers: [{ lightness: 23 }, { saturation: -10 }]
            }];

            var options = {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(37.472024, -96.183594),
                styles: styles
            };

            var fetch = app.Experiences.fetch();
            fetch.then(function() {

                _this.map = new google.maps.Map(document.getElementById('map_canvas'), options); // use of $ doesnt work

                // For our experiences, let's plot them on the map
                google.maps.event.addListenerOnce(_this.map, 'idle', function(){
                    var experience_view = new app.ExperienceListView({model: app.Experiences, map: _this.map});
                });
                $("#loading").slideUp();
            });
        }
    });
})(jQuery);