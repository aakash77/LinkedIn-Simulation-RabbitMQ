'use strict';
myLinkedIn.controller("EducationCtrl", function($scope, $rootScope, DataService) {

	$scope.getAllConnections = function(){
		
		var uri = urlConstants.GET_EDUCATION_DETAILS + $rootScope.userId;
		
		DataService.getData(uri,[]).success(function(response){
			$scope.educationList = response.data;
		}).error(function(err){
			console.log(err.message);
		});
	}

});
