/**
 * Created by eastagile on 11/11/14.
 */
angularApp.run(function($rootScope){
    jQuery("#edit_project form").validate();
    jQuery("#tasks form").validate();
});
angularApp.filter('dateFormat', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input), 'MMMM dd, yyyy');
 
  return _date.toUpperCase();

 };
});
angularApp.controller('ProjectDetailController', function($scope, $http, $location, ProjectApi, DateFormatter, ProjectStatus,
                                                          ProjectServiceLevel, ProjectPriority, StaffApi, ClientApi,
                                                          FieldApi, ProjectType, TaskApi, TaskStatus, $q){

    $scope.DateFormatter = DateFormatter;
    $scope.ProjectStatus = ProjectStatus;
    $scope.ProjectServiceLevel = ProjectServiceLevel;
    $scope.ProjectPriority = ProjectPriority;
    $scope.FieldApi = FieldApi;
	
    $scope.tempProject = {};
    $scope.clients = [];
    $scope.sales = [];
    $scope.pms = [];
    $scope.fields = [];
    $scope.project = {
        task: []
    }
	$scope.telephone = [];
	
	$scope.itermtm = [];
	$scope.subtotal = 0;
    function search_by_id($array, $id){
        for(var i = 0; i < $array.length; i++){
            if($array[i].id == $id){
                return $array[i];
            }
        }
    }

    var projectId = PROJECT_ID;
    function init(){
        var project_listener = ProjectApi.get(projectId, function($project){
            $project.priority = ProjectPriority.get($project.priority);
            $project.serviceLevel = ProjectServiceLevel.get($project.serviceLevel);
            $project.status = ProjectStatus.get($project.status);
            $project.tasks = [];
			
            $scope.project = $project;
			console.log("scope.project");
			console.log($scope.project);

            jQuery.extend($scope.tempProject, $scope.project);
        });
		
		
        /*var pm_listener = StaffApi.list({
            type: 2
        }, function($pms){
            $scope.pms = $pms;
        });
		
        var sales_listener = StaffApi.list({
            type: 1
        }, function($sales){
            $scope.sales = $sales;
        });
		*/
		var pm_listener = $http.get("/" + LANG_CODE + "/admin/staff/getPmList")
            .success( function ( $data ) {
                $scope.pms = $data.pmlist;
            });

        var sales_listener = $http.get("/" + LANG_CODE + "/admin/staff/getSalesList")
            .success( function ( $data ) {
                $scope.sales = $data.saleslist;
            });
		//get company info
		 var companyinfo = $http.get("/api/papertask/companyinfo").success(function($data){
            $scope.companyinfo = $data['companyinfo'];
			$scope.companyinfo1 = $scope.companyinfo[0];
			console.log("companyinfo");
			console.log($scope.companyinfo1);
        }).error(function($e){
            alert('error');
        });	
			
        var client_listener = ClientApi.list({}, function($clients){
            $scope.clients = $clients;
        });

        var field_listener = FieldApi.list({}, function($fields){
            $scope.fields = $fields;
        });

        $q.all([project_listener, field_listener, pm_listener, sales_listener, client_listener, companyinfo])
            .then(function(){
                $scope.project.field = search_by_id($scope.fields, $scope.project.field.id);
				console.log("project.pm");	
				console.log($scope.project.pm);	
				console.log($scope.pms);	
                $scope.project.pm = search_by_id($scope.pms, $scope.project.pm.id);
				if($scope.project.sale)
					$scope.project.sale = search_by_id($scope.sales, $scope.project.sale.id);
				
                $scope.project.client = search_by_id($scope.clients, $scope.project.client.id);
				console.log("$scope.project.client");	
				console.log($scope.project.client);	
                $http.get('/api/admin/projectitermnotm?projectId='+ projectId).success(function($data) {
					$scope.itermnotms = $data['Itermnotms'];
					
					// arrange itermnotms based language
					
					$scope.itermnotmsnews = arrangeItem($data['Itermnotms']);
					console.log("scope.itermnotms");
					console.log($scope.itermnotms);	
					
					console.log("scope.itermnotmsnews");
					console.log($scope.itermnotmsnews);			
				});
				$http.get('/api/admin/projectitermtm?projectId='+ projectId).success(function($data) {
					$scope.itemtm = $data['Itermtms'][0];
					$scope.subtotal = $scope.subtotal + parseFloat($scope.itemtm.total);	
					console.log("scope.itemtm");
					console.log($scope.itemtm);		
				});
				
				$http.get('/api/admin/projectitermdtpmac?projectId='+ projectId).success(function($data) {
					$scope.itermdtpmacs = arrangeItem($data['Itermdtpmacs']);
					console.log("scope.itermdtpmacs");
					console.log($scope.itermdtpmacs);		
				});
				
				$http.get('/api/admin/projectitermdtppc?projectId='+ projectId).success(function($data) {
					$scope.itermdtppcs = arrangeItem($data['Itermdtppcs']);
					console.log("scope.itermdtppcs");
					console.log($scope.itermdtppcs);			
				});
				
				$http.get('/api/admin/projectitermengineering?projectId='+ projectId).success(function($data) {
					$scope.itermengineerings = arrangeItem($data['Itermengineerings']);
					console.log("scope.itermengineerings");
					console.log($scope.itermengineerings);			
				});
				
				$http.get('/api/admin/projectiterminterpreting?projectId='+ projectId).success(function($data) {
					$scope.iterminterpretings = arrangeItem($data['Iterminterpretings']);
					console.log("scope.iterminterpretings");
					console.log($scope.iterminterpretings);			
				});
				
				$scope.project.types = ProjectType.find($scope.project.types.sort())
				
				/** order information condition **/
				$scope.hasTypeTranslationNoTM = function(){
					return existsIdInArray($scope.project.types, 1);
				};
				$scope.hasTypeTranslationUseTM = function(){
					return existsIdInArray($scope.project.types, 2);
				};
				$scope.hasTypeTranslationShow = function(){
					return $scope.hasTypeTranslationUseTM() || $scope.hasTypeTranslationNoTM();
				};
				$scope.hasTypeDesktopPublishingMacOrWin = function(){
					return $scope.hasTypeDesktopPublishingMac() || $scope.hasTypeDesktopPublishingWin();
				};
				$scope.hasTypeDesktopPublishingMac = function(){
					return existsIdInArray($scope.project.types, 4)
				};
				$scope.hasTypeDesktopPublishingWin = function(){
					return existsIdInArray($scope.project.types, 5)
				};
				$scope.hasTypeDesktopPublishingEngineer = function(){
					return existsIdInArray($scope.project.types, 6);
				};
				
                jQuery.extend($scope.tempProject, $scope.project);
            });
    }
	function existsIdInArray(arr, id){
        for(var i = 0; i < arr.length; i++){
            if(arr[i].id == id){
                return true;
            }
        }
        return false;
    }
	
	function arrangeItem(Itemr) {
		$scope.itermtmnew = [];
		for(var i = 0; i < $scope.project.targetLanguages.length; i++)
		{
			$scope.itermtmnew[$scope.project.targetLanguages[i].id] = [];
			for(var j = 0; j < Itemr.length; j++){
				if(Itemr[j].language.id == $scope.project.targetLanguages[i].id){
					$scope.itermtmnew[$scope.project.targetLanguages[i].id].push(Itemr[j]);
					$scope.subtotal = $scope.subtotal + parseFloat(Itemr[j].total);	
				}	
			}
		}
        return $scope.itermtmnew;
    }

    

    function showEdit(){
        jQuery("#edit_project").collapse("toggle");
    }

    function getOnlyFields($object, $fields){
        var data = {};
        for(var i = 0; i < $fields.length; i++){
            var field = $fields[i];
            data[field] = $object[field];
        }
        return data;
    }

    function update(){
        if(jQuery("#edit_project form").valid()) {
            var fields = ['client', 'pm', 'sale', 'priority', 'reference', 'field'];
            var data = getOnlyFields($scope.tempProject, fields);

            ProjectApi.update($scope.project.id, data, function () {
                jQuery.extend($scope.project, $scope.tempProject);
                jQuery("#edit_project").collapse("toggle");
            });
        }
    }
    $scope.showEdit = showEdit;
    $scope.update = update;

    init();
});


angularApp.controller("ProjectTasksController", function($scope, TaskStatus, ProjectType, TaskApi){
    $scope.newTask = {};

    $scope.setItemApi(TaskApi);

    function attachData($task){
        $task.type = ProjectType.get($task.type);
        $task.status = TaskStatus.get($task.status);
    }

    function createTask(){
        if(jQuery("#tasks form").valid()){
            var newTask = $scope.newTask;
            newTask.project_id = $scope.project.id;
            newTask.status = TaskStatus.unassigned;

            TaskApi.create(newTask, function($newTask){
                attachData($newTask);
                $scope.newTask = {};
                $scope.items.push($newTask);
            });
        }
    }

    function afterLoadItems($tasks){
        for(var i = 0; i < $tasks.length; i++){
            attachData($tasks[i]);
        }
    }
    $scope.custom.afterLoadItems = afterLoadItems;

    $scope.createTask = createTask;

    function update($task, $data){
        TaskApi.update($task.id, $data, function($updateTask){
            attachData($updateTask);
            jQuery.extend($task, $updateTask);
        });
    }

    function sendToSpecialismPool($task){
        update($task, {is_specialism_pool: 1});
    }
    $scope.sendToSpecialismPool = sendToSpecialismPool;

    function sendToClientPool($task){
        update($task, {is_client_pool: 1});
    }
    $scope.sendToClientPool = sendToClientPool;

    $scope.$watch(function(){
        return $scope.project;
    }, function(){
        if(typeof($scope.project.id) != 'undefined'){
            $scope.filter.project_id = $scope.project.id;
            $scope.refresh();
        }
    });
});