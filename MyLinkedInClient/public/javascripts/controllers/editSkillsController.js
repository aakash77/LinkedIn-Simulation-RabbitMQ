'use strict';
myLinkedIn.controller("EditSkillsCtrl", function($scope, $modalInstance, skills,$rootScope,DataService) {
	
	/***********************/
	$scope.selectedSkill = "";
	$scope.skills = skills;
	/***********************/

	
$scope.okay = function() {
		
		if ($scope.selectedSkill) {
			var params = {
				emailId : $rootScope.userId,
				name : $scope.selectedSkill.name
			}
			DataService.postData(urlConstants.ADD_SKILLS, params)
					.success(function(response) {
						$modalInstance.close(true);
					}).error(function(err) {
						$modalInstance.close(false);
					});
		} else {
			$scope.formError = "Form Invalid !!!";
		}
		/*$modalInstance.close('Hello');*/
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});