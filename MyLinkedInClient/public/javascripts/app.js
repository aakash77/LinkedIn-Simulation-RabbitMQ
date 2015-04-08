'use strict';
var myLinkedIn = angular.module("myLinkedIn", [ 'ngRoute', 'ui.bootstrap' ])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : 'templates/login.ejs',
		controller : 'LoginController'
	}).when('/home', {
		templateUrl : 'templates/home.ejs',
		controller : 'UserHomeController'
	}).when('/logout', {
		templateUrl : 'templates/login.ejs',
		controller : 'UserHomeController'
	}).otherwise({
		redirectTo : '/'
	});
	/**
	 * to remove hash in the URL
	 */
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});

}).run(['$rootScope','$window' ,'$location', 'DataService',function($rootScope,$window, $location,DataService) {
	$rootScope.$on('$routeChangeStart', function(event) {

		DataService.postData(urlConstants.IS_LOGGED_IN,[]).success(function(response){

			if($window.sessionStorage.userId){
				$rootScope.userId = $window.sessionStorage.userId;
				$rootScope.userName = $window.sessionStorage.userName;
				$rootScope.userLastLogin = $window.sessionStorage.userLastLogin;
				$location.path('/home');
			}
			else{
				$location.path('/');
			}

		}).error(function(err){
			if($window.sessionStorage.userId){
				var params = {
						email : $window.sessionStorage.userId
				};
				DataService.postData(urlConstants.LOGOUT, params).success(
						function(response) {
							$location.path('/');
							$window.sessionStorage.userId = undefined;
							$window.sessionStorage.userName = undefined;
							$window.sessionStorage.userLastLogin = undefined;
						}).error(function(err) {
							console.log("Error while session validity");
						});
			}else{
				$location.path('/');
			}
		});
	});
}]);