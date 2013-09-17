var app = app || {};

(function($) {

    var ExperiencesCollection = Backbone.Collection.extend({

        model: app.Experience,

        init: function() {
            this.collection = []
        },

        // TODO: Cache data in localStorage
        fetch: function() {
            this.init();
            var self = this;

            return $.ajax({
                type: 'GET',
                url : rootDomain + '/experiences',
                dataType : 'jsonp',
                jsonpCallback: 'processExperiences',
                success : function(data) {
                    _.each(data, function(e) {
                        self.collection.push(new app.Experience(e));
                    })
                },
                error: function(e) {
                    console.warn(e, e.message);
                }
            });
        },

        all: function() {
            // We're interested in completed experiences that have pictures and a geo location
            return this.collection.filter(function(t) {
                return t.get('photo') && t.get('geo') && t.get('complete') == true;
            });
        },

        comparator: function(e) {
            return e.get('name'); // sort by name
        }
    });

    app.Experiences = new ExperiencesCollection();
})(jQuery);