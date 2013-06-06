var app = app || {};

(function($){

    app.ExperienceListView = Backbone.View.extend({

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
            var _this = this;
            this.marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(obj.get('geo').lat, obj.get('geo').lng),
                title: obj.get('name'),
                descr : obj.get('excerpt'),
                id : obj.get('id')
            });

            var _tpl = _.template($("#marker_info").html());
            this.marker.InfoWindow = new google.maps.InfoWindow({
                content: _tpl(obj.toJSON())
            });

            // google.maps.event.addListener(this.marker, 'mouseover', this.show_info);
            // google.maps.event.addListener(this.marker, 'mouseout', this.hide_info);
            // google.maps.event.addListener(this.marker, 'click', this.show_detail);

            this.oms.addMarker(this.marker);
        },

        show_info: function() {
            this.InfoWindow.open(this.map, this);
        },

        hide_info: function() {
            this.InfoWindow.close();
        },

        show_detail: function() {
        }
    });

})(jQuery);