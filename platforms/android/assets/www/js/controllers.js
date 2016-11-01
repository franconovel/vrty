angular.module('starter.controllers', ['ionic.native'])

.controller('SettingsCtrl', function($scope, $state, ClientService, Formas) {
    $scope.shapes = [{
        id: 'sphere',
        name: 'Esfera'
    }, {
        id: 'cube',
        name: 'Cubo'
    }, {
        id: 'cone',
        name: 'Cono'
    }, ];

    $scope.colors = [{
        id: 'red',
        name: 'Rojo'
    }, {
        id: 'yellow',
        name: 'Amarillo'
    }, {
        id: 'blue',
        name: 'Azul'
    }, {
        id: 'green',
        name: 'Verde'
    }];

    $scope.data = {
        ipAddress: '192.168.1.103',
        shape: 'sphere',
        color: 'red',
        location: {
            x: -5,
            y: 3,
            z: 10
        }
    };

    $scope.start = function() {
        ClientService.start($scope.data).then(function(res) {
            $state.go('tab.escenario');
        });
    };
})

.controller('EscenarioCtrl', function($scope, $ionicPlatform, $http, $cordovaDeviceMotion, $cordovaDeviceOrientation, ClientService, Formas) {
    var url = ClientService.hostIp + 'pos';

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new THREE.StereoEffect(renderer);
    effect.eyeSeparation = 1;
    effect.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("canvasContainer").appendChild(renderer.domElement);

    var axisHelper = new THREE.AxisHelper(10);

    // -5 , 3 , -10
    axisHelper.position.set(0, 0, 0);
    camera.position.set(ClientService.pos.x, ClientService.pos.y, ClientService.pos.z);

    scene.add(axisHelper);
    scene.add(camera);

    var intervalID = setInterval(function() {
        $http.get(url + '/' + Formas.clientId).then(function(res) {
            angular.forEach(res.data, function(cli) {
                var client = Formas.clientsConnected[cli.id];

                if (client) {
                    client.shape.rotation.x = cli.pos.x;
                    client.shape.rotation.y = cli.pos.y;
                    client.shape.rotation.z = cli.pos.z;
                } else {
                    var c = {
                        id: cli.id, //	effect.render(scene,camera);

                        pos: cli.pos,
                        shape: cli.shape,
                        color: cli.color
                    };
                    var shape = Formas.getShape({
                        shape: c.shape,
                        color: c.color
                    });
                    shape.position.set(c.pos.x, c.pos.y, c.pos.z);
                    scene.add(shape);
                    c.shape = shape;
                    Formas.clientsConnected[c.id] = c;
                }
            });

        });
    }, 100);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    render();

    $ionicPlatform.ready(function() {
        var pos = {
            x: 0,
            y: 0,
            z: 0
        };

        window.addEventListener("deviceorientation", function(event) {
            camera.rotation.y = -Math.round(event.alpha) * Math.PI / 180;
            camera.rotation.x = Math.round(event.beta) * Math.PI / 180;

            pos.x = Math.round(event.beta) * Math.PI / 180;
            pos.y = Math.round(event.alpha) * Math.PI / 180;
            pos.z = Math.round(event.gamma) * Math.PI / 180;

        });

        var intervalID2 = setInterval(function() {
            $http({
                method: 'POST',
                url: url,
                data: {
                    id: Formas.clientId,
                    pos: pos
                },
                headers: {
                    'Content-Type': 'application/json '
                }
            });

        }, 100);

    });
})

.controller('DebugCtrl', function($scope, $ionicPlatform, $http, $cordovaDeviceMotion, $cordovaDeviceOrientation) {
    $ionicPlatform.ready(function() {
        var pos = {
            x: 0,
            y: 0,
            z: 0
        };

        watch1 = $cordovaDeviceMotion.watchAcceleration({
            frequency: 1000
        }).subscribe(result => {
            document.getElementById("x1").innerHTML = JSON.stringify(result)
        });

        watch2 = $cordovaDeviceOrientation.watchHeading({
            frequency: 1000
        }).subscribe(result => {
            document.getElementById("x2").innerHTML = JSON.stringify(result);
        });


        window.addEventListener("deviceorientation", function(event) {
            document.getElementById("x3").innerHTML = "(" + event.alpha + "," + event.beta + "," + event.gamma + ")"
            pos.x = Math.round(event.beta);
            pos.y = Math.round(event.alpha);
            pos.z = Math.round(event.gamma);
        });

    });
});
