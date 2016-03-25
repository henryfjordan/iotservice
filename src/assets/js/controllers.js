var DeviceApp = angular.module('DeviceApp', ['ngMaterial'])
    .controller("DeviceController", ['$scope', '$http', '$filter', function($scope, $http, $filter) {
            $scope.hello = "beyyotch";
            $scope.bedroom_lamp = {};

            $http.get('/device').success(function(data) {
                $scope.device = data;

                $scope.bedroom_lamp = $filter('filter')(data, {
                    name: "bedroom_lamp"
                }, true)[0];

            });

            // TODO: Add a debouncer
            $scope.$watch("bedroom_lamp", function(newValue, oldValue) {
                if ($scope.bedroom_lamp.state){
                    console.log("watch!");
                    $http.post('/device/ge_link/bedroom_lamp', $scope.bedroom_lamp.state);
                }
            }, true);

        }
    ]);
