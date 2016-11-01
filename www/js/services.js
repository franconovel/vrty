angular.module('starter.services', [])

.service('ClientService', function($http, $q, Formas) {
  // mario: 'http://200.85.110.201:8000/',
    var deffered = $q.defer();
    this.hostIp = '';
    this.clientId = undefined;

  	this.start = function(data) {
      this.hostIp = 'http://' + data.ipAddress + ':8004/';
      this.shape = data.shape;
      this.color = data.color;
      this.location = data.location;
      this.pos = data.location;

      $http({
        method: 'POST',
        url: this.hostIp + 'connect',
        data: {
          shape: this.shape,
          color: this.color,
          pos: this.location
        },
        headers: {
          'Content-Type': 'application/json '
        }
      }).then(function(res) {
          Formas.clientId = res.data.id;
          deffered.resolve();
      }, function(err) {
        deffered.reject({error: 'ERROR'});
      });

      return deffered.promise;
  	};
})

.factory('Formas', function(){
	var result = {};
  result.clientId = undefined;
  result.clientsConnected = {};

	result.getShape = function(option) {
    var geometry;
    var material;

    var shapes = {
      cube: function() {
        geometry = new THREE.BoxGeometry(2,1,3,1,1,1);
        material = new THREE.MeshBasicMaterial({ color: option.color, wireframe:true});
        return new THREE.Mesh(geometry, material);
      },

      cone: function() {
        geometry = new THREE.CylinderGeometry(0, 3, 8, 4, 1, true);
        material = new THREE.MeshBasicMaterial({ color: option.color, wireframe:true});
        return new THREE.Mesh(geometry, material);
      },

      ring: function() {
        geometry = new THREE.RingGeometry( 1, 5, 32 );
        material = new THREE.MeshBasicMaterial({ color: option.color, wireframe:true});
        return new THREE.Mesh(geometry, material);
      }
    };

    return shapes[option.shape]();
  };

	return result;

});
