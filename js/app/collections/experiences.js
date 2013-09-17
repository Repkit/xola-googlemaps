var app = app || {};

(function($) {

    app.ExperiencesCollection = Backbone.Collection.extend({

        model: app.Experience,

        initialize : function(opts) {
            _.bindAll(this);
            this.url = rootDomain + '/api/experiences?limit=100&' + $.param(opts.coords);
            this.nextUri = null;
            console.log('Fetching from', this.url);
            this.fetchPage();
        },

        fetchPage : function() {
            if (this.nextUri) {
                this.url = rootDomain + this.nextUri;
            }
            this.fetch({
                success : this.success,
                dataType: 'jsonp',
                remove : false
            });
        },

        parse : function(resp, options) {
            if(resp.paging && resp.data) {
                this.nextUri = resp.paging.next;
                return resp.data;
            }

            return resp;
        },

        success : function(collection, response, options) {
            if (this.nextUri) {
                this.fetchPage();
            } else {
                console.log('No more left');
            }
        },

        comparator: function(e) {
            return e.get('name'); // sort by name
        }
    });
})(jQuery);