'use strict';
myLinkedIn.controller("EditEducationCtrl", function($scope, $modalInstance,
		institutions, isEdit, $rootScope, DataService) {

	/** ******************** */
	if (isEdit) {
		$scope.selectedInstitution = isEdit.institution;
		$scope.selectedFromMonth = isEdit.from.split('-')[0];
		$scope.selectedFromYear = isEdit.from.split('-')[1];
		$scope.selectedToMonth = isEdit.to.split('-')[0];
		$scope.selectedToYear = isEdit.to.split('-')[1];
		$scope.degree = isEdit.degree;
		$scope.deleteOption = true;
	} else {
		$scope.selectedInstitution = "";
		$scope.selectedFromMonth = null;
		$scope.selectedFromYear = null;
		$scope.selectedToMonth = null;
		$scope.selectedToYear = null;
		$scope.degree = null;
		$scope.deleteOption = false;
	}

	$scope.institutions = institutions;
	$scope.years = new Array();
	$scope.months = dataConstants.MONTH_NAMES;
	var yr = new Date().getFullYear();
	for (var i = 1950; i <= yr + 5; i++) {
		$scope.years.push(i);
	}
	/** ******************** */

	$scope.okay = function() {

		if ($scope.selectedInstitution && $scope.selectedFromMonth
				&& $scope.selectedFromYear && $scope.selectedToMonth
				&& $scope.selectedToYear && $scope.degree) {

			var institution = "";
			if ($scope.selectedInstitution.name) {
				institution = $scope.selectedInstitution.name;
			} else {
				institution = $scope.selectedInstitution;
			}

			if (isEdit) {

				var params = {
					update : {
						emailId : $rootScope.userId,
						from : $scope.selectedFromMonth + "-"
								+ $scope.selectedFromYear,
						to : $scope.selectedToMonth + "-"
								+ $scope.selectedToYear,
						institution : institution,
						degree : $scope.degree
					},
					old : {
						emailId : $rootScope.userId,
						from : isEdit.from,
						to : isEdit.to,
						institution : isEdit.institution,
						degree : isEdit.degree
					}
				};

				DataService.putData(urlConstants.UPDATE_EDUCATION, params)
						.success(function(response) {
							$modalInstance.close(true);
						}).error(function(err) {
							$modalInstance.close(false);
						});

			} else {
				var params = {
					emailId : $rootScope.userId,
					from : $scope.selectedFromMonth + "-"
							+ $scope.selectedFromYear,
					to : $scope.selectedToMonth + "-" + $scope.selectedToYear,
					institution : $scope.selectedInstitution.name,
					degree : $scope.degree
				}
				DataService.postData(urlConstants.ADD_EDUCATION, params)
						.success(function(response) {
							$modalInstance.close(true);
						}).error(function(err) {
							$modalInstance.close(false);
						});
			}
		} else {
			$scope.formError = "Form Invalid !!!";
		}
	};
	
	$scope.deleteCall = function(){
		var uri = urlConstants.DELETE_EDUCATION+$rootScope.userId+"/"+isEdit.institution+"/"+isEdit.from+"/"+isEdit.to+"/"+isEdit.degree;
		
		DataService.deleteData(uri,[]).success(function(response){
			$modalInstance.close(true);
		}).error(function(err){
			$modalInstance.close(false);
		});
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

});
