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
		placemarkChecked : false,
		events : {
			'click .goobjectSaveButton' : 'save',
			'click #placemarkCheckBtn' : 'checkPlacemark',
			'click #placemarkUncheckBtn' : 'uncheckPlacemark',
		},
		render : function ( src, callback ) {
			var view = this;
			if ( src.id != -1 ) {
				view.geoobject = new Geoobject({ id: src.id });
				view.geoobject.fetch({
					success : function ( result ) {
						var geoobjectVar = result.toJSON();
						console.log('geoobjectVar.latitude ' + geoobjectVar.latitude);
						console.log('geoobjectVar.longitude ' + geoobjectVar.longitude);
						if ( geoobjectVar.latitude && geoobjectVar.longitude ) {
							console.log('cheked!');
							view.placemarkChecked = true;
						}
						$(view.el).html(_.template(contentTemplate, { geoobject : geoobjectVar, placemarkChecked : view.placemarkChecked }));
						view.renderMap();
					}, 
					error : function ( err ) {
						console.log( err );
					}
				});
			} else {
				view.geoobject = new Geoobject();
				$(view.el).html(_.template(contentTemplate, { geoobject : {}, placemarkChecked : view.placemarkChecked }));
			}
		},

		save : function() {
			var view = this;
			view.geoobject.save({				
				label : $('#geoobjectLabel').val(),
				mark : $('#geoobjectMark').val(),
				address : $('#geoobjectAddres').val(),
				latitude : view.geoobject.latitude,
				longitude : view.geoobject.longitude
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
				zoom: 14
			});

			var geoobjectVar = view.geoobject.toJSON();
			if ( geoobjectVar.latitude && geoobjectVar.longitude ) {
				view.placemark = new ymaps.Placemark( [geoobjectVar.latitude, geoobjectVar.longitude], {}, {preset : 'islands#darkGreenDotIcon'} );
				view.map.geoObjects.add( view.placemark );
				view.map.setCenter( [geoobjectVar.latitude, geoobjectVar.longitude] );
			}

			view.map.events.add('click', function(e) {
				var coords = e.get('coords');
				var pointGeometry = new ymaps.geometry.Point(coords);
				if ( !view.placemark && view.placemarkChecked ) {
					view.placemark = new ymaps.Placemark( pointGeometry, {}, {preset : 'islands#darkGreenDotIcon'} );
					view.map.geoObjects.add( view.placemark );
					view.geoobject.latitude = coords[0];
					view.geoobject.longitude = coords[1];
				}
			});
		},

		checkPlacemark : function() {
			var view = this;
			$('#placemarkCheckBtn').addClass('hidden');
			$('#placemarkUncheckBtn').removeClass('hidden');
			view.placemarkChecked = true;
		},

		uncheckPlacemark : function() {
			var view = this;
			$('#placemarkUncheckBtn').addClass('hidden');
			$('#placemarkCheckBtn').removeClass('hidden');
			view.placemarkChecked = false;
			if ( view.map ) {
				view.map.geoObjects.remove( view.placemark );
				view.placemark = null;
			}
		}
	});
	return ContentView;
});