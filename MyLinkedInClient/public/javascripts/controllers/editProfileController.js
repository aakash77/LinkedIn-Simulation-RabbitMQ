'use strict';
myLinkedIn.controller("EditProfileCtrl", function($scope, $modalInstance,isEdit,$rootScope,DataService,$window) {

	$scope.firstName = isEdit.firstName;
	$scope.lastName = isEdit.lastName;
	$scope.gender = isEdit.gender;
	$scope.dob = isEdit.dob;
	$scope.summary = isEdit.summary;
	
	$scope.today = new Date();
	
	$scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		  };
	
	
	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };
	
	
	$scope.okay = function() {
		if($scope.firstName === "" || $scope.lastName=== "" || $scope.gender=== "" || $scope.dob=== "" || $scope.gender=== "--" || $scope.dob=== "--"){
			$scope.formError = "Form Invalid !!!";
		}else{
			
			var newDate = new Date($scope.dob);
			var formattedDOB = newDate.getDate()+"-"+dataConstants.MONTH_NAMES[newDate.getMonth()]+"-"+newDate.getFullYear();
			
			$window.sessionStorage.userName = $scope.firstName + " " + $scope.lastName;
			$rootScope.userName = $scope.firstName + " " + $scope.lastName;
			
			var params = {
					email : $rootScope.userId,
					firstName : $scope.firstName,
					lastName : $scope.lastName,
					gender : $scope.gender,
					dob : formattedDOB,
					summary : $scope.summary
			};
			
			DataService.putData(urlConstants.UPDATE_USER_PROFILE,params).success(function(response){
				$modalInstance.close(true);
			}).error(function(err){
				$modalInstance.dismiss(false);
			});
		}
	};

	$scope.cancel = function() {
		$modalInstance.dismiss(false);
	};
});
