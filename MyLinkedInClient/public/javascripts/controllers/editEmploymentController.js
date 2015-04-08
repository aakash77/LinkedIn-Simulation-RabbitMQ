'use strict';
myLinkedIn.controller("EditEmploymentCtrl", function($scope, $modalInstance,
		companies, isEdit, $rootScope, DataService) {

	/***********************/
	if (isEdit) {
		$scope.selectedCompany = isEdit.company;
		$scope.selectedFromMonth = isEdit.from.split('-')[0];
		$scope.selectedFromYear = isEdit.from.split('-')[1];
		$scope.selectedToMonth = isEdit.to.split('-')[0];
		$scope.selectedToYear = isEdit.to.split('-')[1];
		$scope.designation = isEdit.designation;
		$scope.deleteOption = true;
	} else {
		$scope.selectedCompany = "";
		$scope.selectedFromMonth = null;
		$scope.selectedFromYear = null;
		$scope.selectedToMonth = null;
		$scope.selectedToYear = null;
		$scope.designation = null;
		$scope.deleteOption = false;
	}

	$scope.companies = companies;
	$scope.years = new Array();
	$scope.months = dataConstants.MONTH_NAMES;
	var yr = new Date().getFullYear();
	for (var i = 1950; i <= yr; i++) {
		$scope.years.push(i);
	}
	/** ******************** */

	$scope.ok = function() {
		if ($scope.selectedCompany && $scope.selectedFromMonth
				&& $scope.selectedFromYear && $scope.selectedToMonth
				&& $scope.selectedToYear && $scope.designation) {
			
			var company = "";
			if ($scope.selectedCompany.name) {
				company = $scope.selectedCompany.name;
			} else {
				company = $scope.selectedCompany;
			}

			if (isEdit) {

				var params = {
					update : {
						emailId : $rootScope.userId,
						from : $scope.selectedFromMonth + "-"
								+ $scope.selectedFromYear,
						to : $scope.selectedToMonth + "-"
								+ $scope.selectedToYear,
						company : company,
						designation : $scope.designation
					},
					old : {
						emailId : $rootScope.userId,
						from : isEdit.from,
						to : isEdit.to,
						company : isEdit.company,
						designation : isEdit.designation
					}
				};

				DataService.putData(urlConstants.UPDATE_EXPERIENCE, params)
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
					company : company,
					designation : $scope.designation
				};
				DataService.postData(urlConstants.ADD_EXPERIENCE, params)
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
		var uri = urlConstants.DELETE_EMPLOYMENT+$rootScope.userId+"/"+isEdit.company+"/"+isEdit.from+"/"+isEdit.to+"/"+isEdit.designation;
		
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
