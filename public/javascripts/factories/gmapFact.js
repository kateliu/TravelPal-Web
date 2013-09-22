travelpalApp.factory("gMap", function() {
  
  var
    mapInstance,
    markers = [], infos = [],
    geolocation = [37.4102492, -122.0597582],

    initMap = function(){
      $('#gmap-container').css('height', $('body').height());
      var location = new intel.maps.Location();
      location.login({
        client_id: 'd7e566931cb46213cd5f139dd102fde4',
        secret_id: '1b9025f2a02095b5'
      }, function(e){ console.log(e); });
      
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          console.log(pos.coords);
          geolocation = [pos.coords.latitude, pos.coords.longitude];
        });
      }

      mapInstance = new intel.maps.Map(
        document.getElementById("intel-map"),
        { navigationControl: false,
          center: new intel.maps.LatLng(geolocation[0], geolocation[1]),
          zoom: 14 }
      );
      return mapInstance;
    },
    addMarker = function(id, name, geodata){
      markers[id] = new intel.maps.Circle({
        map: mapInstance,
        center: new intel.maps.LatLng(geodata[0], geodata[1]),
        radius: 50, strokeColor: 'blue', fillColor: 'red',
        cursor: 'pointer', zIndex: 2
      });
      infos[id] = new intel.maps.InfoWindow({
        content: "<a href='#/company/"+id+"'><b>"+name+"</b></a>",
        type:intel.maps.InfoWindowTypes.INFO1,
        suit:intel.maps.SuitType.SMALL_4,
        position: new intel.maps.LatLng(geodata[0], geodata[1])
      });
      infos[id].open(mapInstance);


      // intel.maps.event.addListener(markers[id], 'mouseover', function(){
      //   alert(name);
      // })
    };

  return {
    initialize : function(){
      initMap();
    },
    addMarker : addMarker
  };
});
