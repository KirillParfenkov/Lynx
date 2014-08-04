define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/geoobject',
  'text!custom/templates/geoobject/edit.html'
], function ($, _, Backbone, Events, Async, Geoobject, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		geoobject : null,
		map : null,
		placemark : null,
		events : {
			'click .goobjectSaveButton' : 'save'
		},
		render : function ( src, callback ) {
			var view = this;
			if ( src.id != -1 ) {
				view.geoobject = new Geoobject({ id: src.id });
				view.geoobject.fetch({
					success : function ( result ) {
						var geoobjectVar = result.toJSON();
						$(view.el).html(_.template(contentTemplate, { geoobject : geoobjectVar }));
						view.renderMap();
					}, 
					error : function ( err ) {
						console.log( err );
					}
				});
			} else {
				view.geoobject = new Geoobject();
				$(view.el).html(_.template(contentTemplate, { geoobject : {} }));	
			}
		},

		save : function() {
			var view = this;
			view.geoobject.save({				
				label : $('#geoobjectLabel').val(),
				mark : $('#geoobjectMark').val(),
				address : $('#geoobjectAddres').val()
			}, {
				success : function( geoobject ) {
					window.location.hash = '/view/geoobject.list';
				}
			});
		},

		renderMap : function() {
			var view = this;
			view.map = new ymaps.Map("geoobjectMap", {
				center: [55.76, 37.64], 
				zoom: 7
			});

			view.map.events.add('click', function(e) {
				console.log('coords');
				console.log(e.get('coords'));
				var pointGeometry  = new ymaps.geometry.Point(e.get('coords'));
				if ( !view.placemark ) {
					view.placemark = new ymaps.Placemark( pointGeometry );
					view.map.geoObjects.add( view.placemark );
				} else {
					view.placemark.geometry.setCoordinates(e.get('coords'));
				}
				
			});
		}
	});
	return ContentView;
});