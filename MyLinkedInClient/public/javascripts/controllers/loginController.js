'use strict';
myLinkedIn.controller("LoginController", function($scope, $rootScope,
		$location, $window, DataService) {
	$scope.signInFormError = "";

	$scope.signIn = function() {
		if ($scope.loginForm.email.$invalid || $scope.loginForm.pwd.$invalid) {
			$scope.signInFormError = "Invalid Credentials";
		} else {
			var params = {
				email : $scope.email,
				password : $scope.pwd
			};
			DataService.postData(urlConstants.LOGIN, params).success(
					function(response) {
						/**
						 * For encrypting password at client side as well
						 * $scope.pwd =
						 * CryptoJS.SHA256($scope.pwd).toString(CryptoJS.enc.hex);
						 */
						$window.sessionStorage.userId = response.email;
						$window.sessionStorage.userName = response.name;
						$window.sessionStorage.userLastLogin = response.lastLogin;
						$rootScope.userId = response.email;
						$rootScope.userName = response.name;
						$rootScope.userLastLogin = response.lastLogin;
						$location.path('/home');
					}).error(function(err) {
				$scope.signInFormError = err.message;
			});
		}
	}
});