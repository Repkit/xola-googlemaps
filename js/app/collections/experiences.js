var app = app || {};

(function($) {

    app.ExperiencesCollection = Backbone.Collection.extend({

        model: app.Experience,

        initialize: function() {
            this.collection = []
        },

        // TODO: Cache data in localStorage
        fetch: function(params) {
            var endpoint = '/api/experiences?limit=100&' + jQuery.param(params);

            // Fetch the first batch of experiences
            return this.fetchOne(endpoint);
        },

        fetchOne: function(endpoint) {
            var self = this;
            endpoint = endpoint || '/api/experiences';

            var url = rootDomain + endpoint;
            //console.debug(endpoint);
            return $.ajax({
                type: 'GET',
                url : url,
                dataType : 'jsonp',
                cache: false,
                jsonpCallback: 'processExperiences',
                success : function(resp) {
                    //console.debug(resp.paging, resp.data.length);

                    var experienceList = resp.data;
                    _.each(experienceList, function(e) {
                        self.collection.push(new app.Experience(e));
                    });

                    self.trigger('change', self.all());
                    if (resp.paging && resp.paging.next) {
                        return self.fetchOne(resp.paging.next);
                    }
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
})(jQuery);