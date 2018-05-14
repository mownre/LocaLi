// const gmaps = require('ngMap');
var app = angular.module('mapa', ['ngMap']);




app.controller('mapController', function ($http, $window, $q, NgMap, markersService) {
    var map;
    NgMap.getMap().then(function (evtMap) {
        map = evtMap;
    });

    var vm = this;

    vm.centro = [-5.705071, -35.289621];

    vm.markers = [];

    vm.mousePos = function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        var minhaCoordenada = { "nome": null, "lat": latitude, "lng": longitude };
        vm.markers.push(minhaCoordenada);

        console.log(vm.markers);
    }

    vm.salvarMarker = function (event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        var meuMarker = {
            "nome": null,
            "lat": lat,
            "lng": lng
        }

        vm.persistirMarker(meuMarker);

        $window.location.href = "/index.html";
    }

    vm.persistirMarker = function (marker) {
        markersService.persistirMarker(marker);
        vm.carregarMarkers();
    }

    vm.carregarMarkers = function () {

        markersService.listarMarkers().then(function (resposta) {
            console.log("resposta", resposta);
            angular.forEach(resposta.data.markers, function (valor) {
                vm.markers.push(JSON.parse(valor.propriedades));
            });
        });

        console.log("Markers carregados: ", vm.markers);
        console.log("markers", vm.markers[0])
    }




});

app.service("markersService", function ($q, $http) {
    this.listarMarkers = function () {
        var deferred = $q.defer();
        $http.get('http://localhost:3030/markers/listar').then(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    this.persistirMarker = function (marker) {
        $http({
            url: 'http://localhost:3030/markers/salvar',
            method: "POST",
            data: marker
        })
    }
});

