angularApp.run( function ( $rootScope ) {
	
}) 

angularApp.controller('FreelancerUnpaidTask', function($scope, $http, $timeout, $q, StaffApi, TaskStatus, ProjectType, ProjectStatus,ProjectField, DateFormatter) {
	
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
		//var $params = $scope.searchParams;
		
  		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+'1'+"&freelancer_id="+FREELANCER_ID, {
            //params: $params
        }).success(function($data){
        	$scope.tasks_tmp = $data.tasks;
 			$scope.tasks = [];
 			angular.forEach($scope.tasks_tmp, function(element) {
 				  //$scope.tasks.push(element);
 				var task =  [];
 				task["status"] = TaskStatus.get(element.status);
 				task["id"] = element.id;
 				task["language"] = element.language;
 				task["project"] = element.project;
 				task["type"] = ProjectType.get(element.type);
 				task["dueDate"] = element.dueDate;
 				task["total"] = element.total;
				task["total_freelancer"] = element.total_freelancer;
 				//alert(task);
 				
 				$scope.tasks.push(task);
 			});
			console.log($scope.tasks);
            $scope.pages = $data.pages;
        });
  	}
  	
	
	$scope.View = function(task_id){
		location.href = "/" + LANG_CODE + "/admin/task/detail/?id=" + task_id;
	}
	
	$scope.Accept = function(task_id){
		$http.get("/" + LANG_CODE + "/admin/task/FreelancerAcceptTask?id="+ task_id, {
           // params: $params
        }).success(function($data){
        	angular.forEach($scope.tasks, function(element,key) {
				 if(element.id==task_id){
					 $scope.tasks[key]["status"] = TaskStatus.get(2);
				 } 

			});
        });
	}
	
	
	$scope.selectPage = function($page){
		var $params = $scope.searchParams;
		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+$page+"&freelancer_id="+FREELANCER_ID, {
            params: $params
        }).success(function($data){
        	$scope.tasks_tmp = $data.tasks;
 			$scope.tasks = [];
 			angular.forEach($scope.tasks_tmp, function(element) {
 				  //$scope.tasks.push(element);
 				var task =  [];
 				task["status"] = TaskStatus.get(element.status);
 				task["id"] = element.id;
 				task["language"] = element.language;
 				task["project"] = element.project;
 				task["type"] = ProjectType.get(element.type);
 				task["dueDate"] = element.dueDate;
 				task["total"] = element.total;
				task["total_freelancer"] = element.total_freelancer;
				task["currency"] = element.currency;
 				$scope.tasks.push(task);
 			});
console.log($scope.tasks);
            $scope.pages = $data.pages;
        });
    }
	
	$scope.onBtnPreviousClicked = function () {
		var $params = $scope.searchParams;
		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+$scope.pages.previous+"&freelancer_id="+FREELANCER_ID, {
            params: $params
        }).success(function($data){
        	$scope.tasks_tmp = $data.tasks;
 			$scope.tasks = [];
 			angular.forEach($scope.tasks_tmp, function(element) {
 				  //$scope.tasks.push(element);
 				var task =  [];
 				task["status"] = TaskStatus.get(element.status);
 				task["id"] = element.id;
 				task["language"] = element.language;
 				task["project"] = element.project;
 				task["type"] = ProjectType.get(element.type);
 				task["dueDate"] = element.dueDate;
 				task["total"] = element.total;
				task["total_freelancer"] = element.total_freelancer;
				task["currency"] = element.currency;
 				$scope.tasks.push(task);
 			});
console.log($scope.tasks);
            $scope.pages = $data.pages;
        });
	}
	
	$scope.onBtnGoto = function ( int_index ) {
		var $params = $scope.searchParams;
		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+ (int_index*1 + 1) +"&freelancer_id="+FREELANCER_ID, {
            params: $params
        }).success(function($data){
        	$scope.tasks_tmp = $data.tasks;
 			$scope.tasks = [];
 			angular.forEach($scope.tasks_tmp, function(element) {
 				  //$scope.tasks.push(element);
 				var task =  [];
 				task["status"] = TaskStatus.get(element.status);
 				task["id"] = element.id;
 				task["language"] = element.language;
 				task["project"] = element.project;
 				task["type"] = ProjectType.get(element.type);
 				task["dueDate"] = element.dueDate;
 				task["total"] = element.total;
				task["total_freelancer"] = element.total_freelancer;
				task["currency"] = element.currency;
 				$scope.tasks.push(task);
 			});
console.log($scope.tasks);
            $scope.pages = $data.pages;
        });
	}
	$scope.onBtnNextClicked = function () {
		var $params = $scope.searchParams;
		$http.get("/" + LANG_CODE + "/admin/task/getFreelancerTaskList?paystatus=1&page="+ $scope.pages.next +"&freelancer_id="+FREELANCER_ID, {
            params: $params
        }).success(function($data){
        	$scope.tasks_tmp = $data.tasks;
 			$scope.tasks = [];
 			angular.forEach($scope.tasks_tmp, function(element) {
 				  //$scope.tasks.push(element);
 				var task =  [];
 				task["status"] = TaskStatus.get(element.status);
 				task["id"] = element.id;
 				task["language"] = element.language;
 				task["project"] = element.project;
 				task["type"] = ProjectType.get(element.type);
 				task["dueDate"] = element.dueDate;
 				task["total"] = element.total;
				task["total_freelancer"] = element.total_freelancer;
				task["currency"] = element.currency;
 				$scope.tasks.push(task);
 			});
console.log($scope.tasks);
            $scope.pages = $data.pages;
        });
	}
	
	 $scope.search = function () {
	    	//alert($scope.filter.email);
		 $scope.searchParams = {
			        'search': 1,
			        'bsearch': $scope.filter.bsearch,
			        'task_id': null,
			        'reference': null,
			        'dueMonth': null,
		 };
		 
	        $scope.selectPage( 1 );
	 }
	 
	 $scope.advancedSearch = function () {
			 $scope.searchParams = {
				        'search': 1,
				        'bsearch': null,
				        'task_id': $scope.filter.taskId,
				        'reference': $scope.filter.reference,
				        'dueMonth': $scope.filter.dueMonth,
			 };
			 
	        $scope.selectPage(1);
	}
	
	 $scope.reset = function () {
	        $scope.searchParams = {
	            'search': null,
		        'bsearch': null,
		        'task_id': null,
		        'reference': null,
		        'dueMonth': null,
	        };
	        
	        if(typeof $scope.filter != "undefined"){
		        angular.forEach($scope.filter, function(key,value){
		        	$scope.filter.key = null;
		        });
		        
		        $scope.filter.bsearch = null;
		        $scope.filter.taskId = null;
		        $scope.filter.reference = null;	
		        $scope.filter.dueMonth = null;

	        }
	        
	        $scope.selectPage(1);
	    }
	
	$scope.formatDate = function(date){
		var dateString = date, //'17-09-2013 10:08'  	"2015-04-30 15:00:00"
	    dateParts = dateString.split(' '),
	    timeParts = dateParts[1].split(':'),
	    date;

	    dateParts = dateParts[0].split('-');
		date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
        return date.getTime();
	};
	
	
  	init();
	
});