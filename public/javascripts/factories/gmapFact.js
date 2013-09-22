travelpalApp.factory("gMapFact", function() {
  
  var
    mapInstance,
    markers = [],
    infos = [],

    init = function(location, callback){
      
      var mapOptions = {
        zoom: 14,
        center: (new google.maps.LatLng(location[0], location[1])),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      mapInstance = new google.maps.Map(document.getElementById('gmap-container'), mapOptions);

      if(callback){ callback(); }
      
    },
    addMarker = function(location, title){
      markers.push(
        new google.maps.Marker({
          position: (new google.maps.LatLng(location[0], location[1])),
          map: mapInstance,
          title: title
        })
      );
      
    };

  return {
    init : init,
    addMarker : addMarker
  };
});
