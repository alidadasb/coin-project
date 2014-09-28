/**
 * Created by alidad on 9/27/14.
 */

angular.module('myApp').controller('registerController', ['$scope', 'registerService', function ($scope, registerService) {
    $scope.register = {
        paymentAmount: 2,
        purchasedPrice: 1.84,
        calculatorDisplay: '',
        display: '',
        change:'',
        data:{}
    };


    $scope.$watch("register",function(){
        $scope.register.change = (+$scope.register.paymentAmount * 100) - (+$scope.register.purchasedPrice * 100 );
        $scope.register.calculatorDisplay =  $scope.register.change / 100;
    },true);

    $scope.update = function(){
        $scope.register.data = registerService.getData();
    };

    $scope.update();

    $scope.cashOut = function () {
        console.log($scope.register);
        $scope.register.display = registerService.makeChange($scope.register.change).map(function(elem){
            return elem.name;
        }).join(",");
        $scope.update();
    }
}])
;