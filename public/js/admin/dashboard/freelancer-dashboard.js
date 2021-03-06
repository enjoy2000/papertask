angularApp.run( function ( $rootScope ) {
	
}) 

angularApp.controller('DashboardFreelancerTaskControler', function($scope, $http, $timeout, $q, StaffApi, TaskStatus, ProjectType, 
											ProjectStatus,ProjectField, DateFormatter) {
	$scope.ProjectType = ProjectType;
	$scope.DateFormatter = DateFormatter;
	$scope.TaskStatus = TaskStatus;
	$scope.staskStatuses = TaskStatus.all();
	$scope.filter = {
			bsearch : null,
			taskId : null,
			reference : null,
			dueMonth : null,
	};

	$scope.searchParams = {
	        'search': null,
	        'bsearch': null,
	        'task_id': null,
	        'reference': null,
	        'dueMonth': null,
	    };
	
	function init(){	
		//get assinging task
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerAssigningTaskList?statustask=6&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.assigingtasks = $data.tasks;
        });
		
		//get ongoing task
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?statustask=2&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.ongoingtasks = $data.tasks;
        });
		
		//get reviewing task
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?statustask=7&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.reviewingtasks = $data.tasks;
        });
		
  		//get rejected task
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?statustask=8&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.rejectedtasks = $data.tasks;
        });
  		
  		//get rejected task
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?statustask=1&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
			console.log($data);
        	$scope.completedtasks = $data.tasks;
        });
		
		//get unpaid tasks
		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.unpaidtasks = $data.tasks;
        });
		var ajaxUserInfo = $http.get("/api/user/" + USER_FREELANCER_ID + "")
            .success ( function ( $data ) {
				$scope.currency = $data.user.currency;
			});
		
  	}
  	
	
	$scope.View = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/detail/?id=" + task_id;
	}
	
	$scope.gotoWaitingTask = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/freelancer-task-view";
	}
	$scope.gotoReviewTask = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/freelancer-task-view";
	}
	$scope.gotoOngoingTask = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/freelancer-task-view";
	}
	
	$scope.gotoRejectedTask = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/freelancer-task-view";
	}
	
	$scope.gotoCompletedTask = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/freelancer-task-view";
	}
	
	$scope.Accept = function(task_id){
		//bootbox.alert(  'Failed to save <br>'+ $data.email + ' has been exist');
		$http.get("/" + LANG_CODE + "/admin/task/FreelancerAcceptTask?id="+ task_id, {
           // params: $params
        }).success(function($data){
        	if($data.status=="have ongoing task"){
        		bootbox.alert(  'You are having an ongoing task. You cannot Accept any more');
        		return false;
        	} else if ($data.status=='ok'){
        		bootbox.alert(  'You accepted task successfully');
        		init();
        		//location.reload();
        	}
        	//location.reload();
        });
	}
	
	$scope.gotoUnpaidTask = function(){
        location.href = "/" + LANG_CODE + "/admin/finance/freelancer-unpaid-task/";
    };
	
	
	
	
  	init();
	
});