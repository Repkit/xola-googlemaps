var app = app || {};

(function($) {

    var ExperiencesCollection = Backbone.Collection.extend({
        model: app.Experience,

        // localStorage: new Backbone.LocalStorage('xola-maps'),
       
        // TODO: Cache data in localStorage
        fetch: function() {
            var collection = this;
            return $.getJSON('experiences.json', function(data) {
                var valid_experiences = [];
                $.each(data, function(k, v) {
                    if (v.photo && v.geo) {
                        valid_experiences.push(new app.Experience(v));
                    }
                });

                collection.reset(valid_experiences);
            });
        },

        all: function() {
            // We're interested in places that have pictures and a geo location
            return this.filter(function(t) {
                return t.get('photo') && t.get('geo') && t.get('status') == 1;
            });
        },

        comparator: function(e) {
            return e.get('name'); // sort by name
        }
    });

    app.Experiences = new ExperiencesCollection();
})(jQuery);