/**
 * Created by eastagile on 11/11/14.
 */

angularApp.controller('ProjectIndexController', function($scope, StaffApi, LanguageApi, ProjectApi, ProjectServiceLevel,
                                                         ProjectStatus, DateFormatter, CurrentUser, PayStatus,
                                                         ProjectField, ProjectType){

    $scope.CurrentUser = CurrentUser;
    $scope.DateFormatter = DateFormatter;
    $scope.ProjectApi = ProjectApi;
    $scope.ProjectServiceLevel = ProjectServiceLevel;
    $scope.ProjectStatus = ProjectStatus;
    $scope.PayStatus = PayStatus;
    $scope.ProjectField = ProjectField;
    $scope.StaffApi = StaffApi;
    $scope.ProjectType = ProjectType;

    /** This is for listing item controller **/
	 
	//console.log($scope.listgoing);
    $scope.ItemApi = ProjectApi;
	$scope.ItemApi.statusproject = 3;

    $scope.languages = {};
    $scope.pms = {};
    $scope.sales = {};

    $scope.goToDetail = function($project){
        location.href = "/" + LANG_CODE + "/admin/project/detail?id=" + $project.id;
    };

    $scope.goToEdit = function($project){
        location.href = "/" + LANG_CODE + "/admin/project/detail?id=" + $project.id;
    };

    StaffApi.list({
        type: 2
    }, function($pms){
        $scope.pms = $pms;
    });

    StaffApi.list({
        type: 1
    }, function($sales){
        $scope.sales = $sales;
    });

    LanguageApi.list({}, function($languages){
        $scope.languages = $languages;
    })
});