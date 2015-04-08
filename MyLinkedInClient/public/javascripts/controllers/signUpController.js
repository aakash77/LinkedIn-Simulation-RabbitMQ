'use strict';
myLinkedIn.controller("SignUpController", function($scope,$rootScope, $location,$window,
		DataService) {
	$scope.signUpFormError = "";

	$scope.signUp = function() {
		if ($scope.signUpForm.firstName.$invalid
				|| $scope.signUpForm.lastName.$invalid
				|| $scope.signUpForm.email.$invalid
				|| $scope.signUpForm.pwd.$invalid) {
			$scope.signUpFormError = "Form invalid. Please fill it again.";
		} else {
			$scope.signInFormError = "";
			var params = {
				firstName : $scope.firstName,
				lastName : $scope.lastName,
				email : $scope.email,
				password : $scope.pwd
			}
			DataService.postData(urlConstants.SIGNUP, params).success(
					function(response) {
						$window.sessionStorage.userId = response.email;
						$window.sessionStorage.userName = response.name;
						$window.sessionStorage.userLastLogin = response.lastLogin;
						$rootScope.userId = response.email;
						$rootScope.userName = response.name;
						$rootScope.userLastLogin = response.lastLogin;
						$location.path('/home');
					}).error(function(err) {
						console.log(err);
						$scope.signUpFormError = err.message;
					});
		}
	}
});