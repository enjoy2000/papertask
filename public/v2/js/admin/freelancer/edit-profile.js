angularApp.run( function ($rootScope) {    
    $(".summernote").summernote();
    $("#form").validate({
        errorPlacement: function (error, element) {
            element.before(error);
        },
        rules: {
            confirmpwd: {
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            }
        },
        submitHandler: function( form ) {
            angular.element('#EditProfileFreelancerController').scope().submit();
        }
    });
});
angularApp.service('sharedInstance', function() {
	var cvfiles = new Array();
    var stafftypes = new Array();
	return {
		addcvfile: function ( fileItem ) {
			cvfiles.push( fileItem );
		},
		removecvfile: function ( id ) {
			for ( var i = 0; i < cvfiles.length; i ++ ) {
				if ( cvfiles[i].id == id) {
					cvfiles.splice( i, 1 );
					break;
				}
			}
		},        
		getcvfiles: function () {
			return cvfiles;
		}
	};
});

angularApp.controller('EditProfileFreelancerController', function($scope, $http, $timeout, $q){

	$scope.pagetype = 'edit';
	$scope.newrating = 0;
    $scope.countries = [];
    $scope.ratings = [];
    $scope.languages = [];
    $scope.resources = [];
	$scope.resource_active = {};
    $scope.softwares = [];
    $scope.companies = [];
	
    $scope.userInfo = {
		isActive: null,
		isAdmin: false,
		alias: null,
        profileUpdated: null,
        email: null,
        firstName: null,
        lastName: null,
		username: null,
		gender: null,
        city: null,
        phone: null,
        country: null,
        company: null,
        currency: null,
		tmRatios: null
	};
	$scope.freelancer ={
		Resources:[],
		rating:[]	
	
	};

	$scope.translationPrices = [];
	$scope.desktopPrices = [];
	$scope.interpretingPrices = [];

	$scope.resume = {};
	$scope.cvfiles = [];
	$scope.bankInfo = {};
	
	$scope.editTranslation = -1;
    $scope.editDtp = -1;
    $scope.editInterpreting = -1;
    $scope.editEngineering = -1;
	
    $scope.resume = {
        'user_id': USER_ID
    };

    
	function rebuildMultiSelect(){
        $timeout(function(){
            $(".multiselect").multiselect("destroy");
        }).then(function(){
            $(".multiselect").multiselect();
        });
    }
	
    function getCountriesList(){
        $http.get('/api/common/country').success(function($data){
            $scope.countries = $data['countries'];
        });
    }
	function getRatingsList(){
        $http.get('/api/common/rating').success(function($data){
            $scope.ratings = $data['ratings'];

        });
    }
	
	function getFreelancerData(){
        $http.get('/api/user/freelancer-data').success(function($data){
            $scope.freelancerData = $data;

            // get resource group
            $.each($scope.freelancerData.resources, function(){
                var that = this;
                $.each(this.resources, function(){
                    if($scope.freelancer.Resources.indexOf(this.id) >= 0){
                        $scope.resourcesType[that.group.name] = 1;
                    }
                });
            });
            // get translation specialism
            $scope.TranslationSpecialisms = findOptions($scope.freelancerData.specialisms,
                $scope.freelancer.TranslationSpecialisms);
            // get desktop translation cat tools
            $scope.TranslationCatTools = findOptions($scope.freelancerData.catTools,
                $scope.freelancer.TranslationCatTools);
            // get operating systems
            $scope.operatingSystems = findOptions($scope.freelancerData.operatingSystems,
                $scope.freelancer.DesktopOperatingSystems);
            // get desktop cat tools
            $scope.DesktopCatTools = findOptions($scope.freelancerData.catTools,
                $scope.freelancer.DesktopCatTools);
            // get interpreting specialism
            $scope.InterpretingSpecialisms = findOptions($scope.freelancerData.specialisms,
                $scope.freelancer.InterpretingSpecialisms);
			// get rating
            $scope.Ratings = findOptions($scope.freelancerData.ratings,
                $scope.freelancer.Ratings);	


        });
    }
	/**
     * Translation Prices
     */
    $scope.translationPricePlaceholder = function () {
    	return {
            sourceLanguage: {},
            targetLanguage: {},
            price: 0
        };
    }
	$scope.saveTranslationPrice = function( translationPrice ){
    	if ( $scope.editTranslation == -1 ) {

			var checkexist = true;
			for(i=0 ; i < $scope.translationPrices.length; i++)
			{
				if(translationPrice.sourceLanguage.id == $scope.translationPrices[i].sourceLanguage.id && translationPrice.targetLanguage.id == $scope.translationPrices[i].targetLanguage.id )
					checkexist = false;
			}
			if(checkexist){
				$http.post("/api/user/translationprice", 
					{
						userId: USER_ID,
						sourceLanguageId: translationPrice.sourceLanguage.id, 
						targetLanguageId: translationPrice.targetLanguage.id, 
						price: translationPrice.price
					}).success(function( data ) {
						
						$scope.translationPrices.push( {sourceLanguage: data.translationPrice.sourceLanguage, targetLanguage: data.translationPrice.targetLanguage, price: data.translationPrice.price, id: data.translationPrice.id});

					});
			}
			else{
				bootbox.alert( EXITS_CONFIRM_TEXT);
			}		
    	} else {
		
    		$http.put("/api/user/" + translationPrice.id + "/translationprice", 
				{
    				userId: USER_ID,
					sourceLanguageId: translationPrice.sourceLanguage.id, 
					targetLanguageId: translationPrice.targetLanguage.id, 
					price: translationPrice.price
				}).success(function( data ) {
					$scope.translationPrices[$scope.editTranslation] = {sourceLanguage: data.sourceLanguage, targetLanguage: data.targetLanguage, price: data.price, id: data.id}
    			});
    		
    	}
    	jQuery("#modal-translation").modal("hide");
    	setModalControllerData('translationPrice', $scope.translationPricePlaceholder);
    	$scope.editTranslation = -1;
    };
	$scope.editTranslationPrice = function ( index, tid ) {
    	$scope.editTranslation = index;
		$scope.translationPrices[index].price = Number($scope.translationPrices[index].price);
    	setModalControllerData('translationPrice', $scope.translationPrices[index]);
    	jQuery("#modal-translation").modal("show");
    }
	$scope.addTranslationPrice = function(){
		setModalControllerData('translationPrice', []);
		$scope.editTranslation = -1;
		jQuery("#modal-translation").modal("show");
	}
	$scope.deleteTranslationPrice = function ( index, tid ) {    	
        bootbox.confirm( DELETE_CONFIRM_TEXT, function( bflag ) {
            if ( bflag == true ) {
                $http.delete("/api/user/" + tid + "/translationprice", {
                    userId: USER_ID            
                }).success(function( data ) {                
                    $scope.translationPrices.splice(index, 1);
                });                
            }
        });       
    }
	/**
     * Desktop Price
     */
    $scope.dtpPricePlaceholder = function () {
    	return {
    		language: {},
    		priceHourMac: 0,
    		priceHourPc: 0,
    		priceMac: 0,
    		pricePc: 0,
    		software: {}
        };
    }
    $scope.saveDesktopPrice = function (desktopPrice ) {
    	if ( $scope.editDtp == -1) {
			var checkexist = true;
			for(i=0 ; i < $scope.desktopPrices.length; i++)
			{
				if(desktopPrice.language.id == $scope.desktopPrices[i].language.id && desktopPrice.software.id == $scope.desktopPrices[i].software.id )
					checkexist = false;
			}
			if(checkexist){
				$http.post("/api/user/desktopprice", {
					userId: USER_ID,
					languageId: desktopPrice.language.id,
					softwareId: desktopPrice.software.id,
					priceHourMac: desktopPrice.priceHourMac,
					priceMac: desktopPrice.priceMac,
					pricePc: desktopPrice.pricePc,
					priceHourPc: desktopPrice.priceHourPc
				}).success(function (data){
					$scope.desktopPrices.push ( data.desktopPrice );
				});
			}
			else{
				bootbox.alert( EXITS_CONFIRM_TEXT);
			}
    	} else {
    		$http.put("/api/user/" + desktopPrice.id + "/desktopprice", {
    			userId: USER_ID,
    			languageId: desktopPrice.language.id,
    			softwareId: desktopPrice.software.id,
    			priceHourMac: desktopPrice.priceHourMac,
    			priceMac: desktopPrice.priceMac,
    			pricePc: desktopPrice.pricePc,
    			priceHourPc: desktopPrice.priceHourPc
    		}).success( function (data) {
    			$scope.desktopPrices[ $scope.editDtp ] = data.desktopPrice;
    		});
    	}
    	
    	jQuery("#modal-dtp").modal("hide");
    	setModalControllerData('desktopPrice', $scope.dtpPricePlaceholder);
    	$scope.editDtp = -1;
    }
    $scope.editDesktopPrice = function ( ind ) {
    	$scope.editDtp = ind;

		$scope.desktopPrices[ind].priceMac = Number($scope.desktopPrices[ind].priceMac);
		$scope.desktopPrices[ind].pricePc = Number($scope.desktopPrices[ind].pricePc);
		$scope.desktopPrices[ind].priceHourMac = Number($scope.desktopPrices[ind].priceHourMac);
		$scope.desktopPrices[ind].priceHourPc = Number($scope.desktopPrices[ind].priceHourPc);
		
    	setModalControllerData('desktopPrice', $scope.desktopPrices[ind]);
    	jQuery("#modal-dtp").modal("show");
    }
	$scope.addDesktopPrice = function(){
		setModalControllerData('desktopPrice', []);
		$scope.editDtp = -1;
		jQuery("#modal-dtp").modal("show");
	}
    $scope.deleteDesktopPrice = function ( ind, did ) {
        bootbox.confirm( DELETE_CONFIRM_TEXT, function (bflag) {
            if ( bflag )
                $http.delete("/api/user/" + did + "/desktopprice", {
                    userId: USER_ID            
                }).success(function( data ) {                
                    $scope.desktopPrices.splice( ind, 1 );
                });    
        });
    	
    }
	/**
     * Interpreting price
     */
    $scope.interpretingPricePlaceholder = function () {
    	return {
    		priceDay: 0,
    		priceHalfDay: 0,
    		service: {},
    		sourceLanguage: {},
    		targetLanguage: {}
    	};
    }
    $scope.saveInterpretingPrice = function ( interpretingPrice ) {

    	if ( $scope.editInterpreting == -1) {
			var checkexist = true;
			for(i=0 ; i < $scope.interpretingPrices.length; i++)
			{
				if(interpretingPrice.sourceLanguage.id == $scope.interpretingPrices[i].sourceLanguage.id && interpretingPrice.targetLanguage.id == $scope.interpretingPrices[i].targetLanguage.id 
				&& interpretingPrice.service.id == $scope.interpretingPrices[i].service.id)
					checkexist = false;
			}
			if(checkexist){
				$http.post("/api/user/interpretingprice", {
					userId: USER_ID,
					priceDay: interpretingPrice.priceDay,
					priceHalfDay: interpretingPrice.priceHalfDay,
					sourceLanguageId: interpretingPrice.sourceLanguage.id,
					targetLanguageId: interpretingPrice.targetLanguage.id,
					serviceId: interpretingPrice.service.id
				}).success(function( data ){
					$scope.interpretingPrices.push ( data.interpretingPrice );
				});
			}
			else{
				bootbox.alert( EXITS_CONFIRM_TEXT);
			}			
    	} else {
    		$http.put("/api/user/" + interpretingPrice.id + "/interpretingprice", {
    			userId: USER_ID,
    			priceDay: interpretingPrice.priceDay,
    			priceHalfDay: interpretingPrice.priceHalfDay,
    			sourceLanguageId: interpretingPrice.sourceLanguage.id,
    			targetLanguageId: interpretingPrice.targetLanguage.id,
    			serviceId: interpretingPrice.service.id
    		}).success(function( data ) {
    			$scope.interpretingPrices[ $scope.editInterpreting ] = data.interpretingPrice;
    		});
    	}
    	
    	jQuery("#modal-interpreting").modal("hide");
    	setModalControllerData('interpretingPrice', $scope.interpretingPricePlaceholder);
    	$scope.editInterpreting = -1;
    }
    $scope.editInterpretingPrice = function (ind) {
    	$scope.editInterpreting = ind;
		$scope.interpretingPrices[ind].priceDay = Number($scope.interpretingPrices[ind].priceDay);
		$scope.interpretingPrices[ind].priceHalfDay = Number($scope.interpretingPrices[ind].priceHalfDay);
    	setModalControllerData('interpretingPrice', $scope.interpretingPrices[ind]);
    	jQuery("#modal-interpreting").modal("show");
    }
	$scope.addInterpretingPrice = function(){
		setModalControllerData('interpretingPrice', []);
		$scope.editTranslation = -1;
		jQuery("#modal-interpreting").modal("show");
	}
    $scope.deleteInterpretingPrice = function (ind, iid) {
        bootbox.confirm( DELETE_CONFIRM_TEXT, function ( bflag ) {
            if ( bflag ) 
               $http.delete("/api/user/" + iid + "/interpretingprice", {
                    userId: USER_ID            
                }).success(function( data ) {                
                    $scope.interpretingPrices.splice( ind, 1 );
                }); 
        });
    }
	/**
     * Mark resource active params
     */
    function initModal(){
        setModalControllerData('languages', $scope.languages);
        setModalControllerData('services', $scope.services);
        setModalControllerData('softwares', $scope.softwares);
        setModalControllerData('engineeringCategories', $scope.engineeringCategories);       
    }
    
    $scope.deleteFileArr = [];

    
    
    $scope.deleteCVFiles = function(FileArr){

    	for(var i=0; i<FileArr.length; i++){
    		$http.get("/" + LANG_CODE +"/admin/staff/deleteFile?fid=" + FileArr[i]);
    	}
    }
    
    function init(){
		// submit
		$scope.editProfile = function(){
            
            
			$('form[name=editProfileForm]').validate();
            var validate = $('form[name=editProfileForm]').valid();
            if(validate == true){
            	
            	$scope.deleteCVFiles($scope.deleteFileArr);
            	//return false;
            	
 			if ( $scope.userInfo.tmRatios && $scope.userInfo.tmRatios.id ) {
 				//alert('hihi'); return false;
				var requesttm =  $http.put("/api/user/" + $scope.userInfo.tmRatios.id + "/tmratio", {
					userId: USER_ID,
					repetitions: $scope.userInfo.tmRatios.repetitions,
					yibai: $scope.userInfo.tmRatios.yibai,
					jiuwu: $scope.userInfo.tmRatios.jiuwu,
					bawu: $scope.userInfo.tmRatios.bawu,
					qiwu: $scope.userInfo.tmRatios.qiwu,
					wushi: $scope.userInfo.tmRatios.wushi,
					nomatch: $scope.userInfo.tmRatios.nomatch
				}).success( function($data) {

					var requestUser = $http.put("/api/user/" + USER_ID, $scope.userInfo)
						.success(function($data){
						
							//$http.put("/api/user/"+$scope.freelancer.freelancerId+"/freelancer?user_id=" + USER_ID, $scope.freelancer).success(function(){
								//location.href="/admin/freelancer/detail?id=" + USER_ID;
							//});
						});
				} ) ;
			} else {
				var requesttm = $http.post("/api/user/tmratio", {
					userId: USER_ID,
					repetitions: $scope.userInfo.tmRatios.repetitions,
					yibai: $scope.userInfo.tmRatios.yibai,
					jiuwu: $scope.userInfo.tmRatios.jiuwu,
					bawu: $scope.userInfo.tmRatios.bawu,
					qiwu: $scope.userInfo.tmRatios.qiwu,
					wushi: $scope.userInfo.tmRatios.wushi,
					nomatch: $scope.userInfo.tmRatios.nomatch
				}).success( function($data) {
					var requestUser = $http.put("/api/user/" + USER_ID, $scope.userInfo)
						.success(function($data){
							//$http.put("/api/user/"+$scope.freelancer.freelancerId+"/employer?user_id=" + USER_ID, $scope.freelancer).success(function(){
								//location.href="/admin/freelancer/detail?id=" + USER_ID;
							//});
						});
				} ) ;
			}
			//update freelancer 
			// update bank info
                if($scope.bankInfo.id){
                    
					var requestBankinfo = $scope.userInfo.isAdmin ?
                        $http.put('/api/user/'+USER_ID+'/bankinfo', $scope.bankInfo).success(function($data){

                        }) : null;
                }else{
					// create
                    // Update
					$scope.bankInfo.user_id = USER_ID;
                    var requestBankinfo =  $http.post('/api/user/bankinfo', $scope.bankInfo).success(function($data){

                    });
                }
				// update resume
                if($scope.resume.id){
                     // Update
					var requestResume =  $http.put('/api/user/'+USER_ID+'/resume', $scope.resume).success(function($data){

                    });
					
                }else{
                    // create
                   $scope.resume.user_id = USER_ID;
                    var requestResume =  $http.post('/api/user/resume', $scope.resume).success(function($data){

                    });
                }
				var rt = [$scope.freelancer.rating];
				
				 var requestResources = $scope.userInfo.isAdmin ? $http.put("/api/user/" + USER_ID + "/freelancer/" + $scope.freelancer.freelancerId, {
					'Resources': getIds($scope.freelancer.Resources),
					'DesktopCatTools': getIds($scope.freelancer.DesktopCatTools),
					'DesktopOperatingSystems': getIds($scope.freelancer.DesktopOperatingSystems),
					'InterpretingSpecialisms': getIds($scope.freelancer.InterpretingSpecialisms),
					'TranslationCatTools': getIds($scope.freelancer.TranslationCatTools),
					'TranslationSpecialisms': getIds($scope.freelancer.TranslationSpecialisms),	
					'Rating': getIds(rt),
					'isSenior' :$scope.freelancer.isSenior
				}).success(function($data){

                 }).error(function(data, status, headers, config) {

                 }) : null;
			
				// wait all done
				if($scope.userInfo.isAdmin)
				$q.all([ requestResources, requestResume, requestBankinfo])
				.then(function(result){
					location.href = "/" + LANG_CODE + "/admin/freelancer/detail?id=" + USER_ID;
				});
                else
                    $q.all([ requestResume ])
                    .then(function(result){
                        location.href = "/" + LANG_CODE + "/admin/freelancer/detail?id=" + USER_ID;
                    });
			}
		}
		var priceDataRequest = $http.get("/api/user/priceData")
            .success(function($data){
                $scope.languages = $data['languages'];
                $scope.services = $data['services'];
                $scope.softwares = $data['softwares'];
                $scope.engineeringCategories = $data['engcategory'];
                
                initModal();
            });
		getCountriesList();
		
		$http.get('/api/user/translationprice?userId='+ USER_ID).success(function($data) {
            $scope.translationPrices = $data['translationPrices'];
        });
		$http.get('/api/user/desktopprice?userId='+USER_ID).success(function($data) {
            $scope.desktopPrices = $data['desktopPrices'];
        });
		$http.get('/api/user/interpretingprice?userId=' + USER_ID).success(function($data) {
            $scope.interpretingPrices = $data['interpretingPrices'];
        });
		$http.get('/api/user/' + USER_ID + '/resume').success(function($data){
            if($data['resume']){
                $scope.resume = $data['resume'];

            }
        });
        $http.get('/api/user/' + USER_ID + '/bankinfo').success(function($data){
            if($data['bankInfo']){
                $scope.bankInfo = $data['bankInfo'];

            }
        });
		var ajaxFreelancerInfo = $http.get("/api/user/" + USER_ID + "/freelancer")
        	.success( function ( $data ) {
				$scope.freelancer = $data["freelancer"];

        		$scope.freelancer = {
					Resources : $data.freelancer.Resources,
					TranslationCatTools : $data.freelancer.TranslationCatTools,
					TranslationSpecialisms : $data.freelancer.TranslationSpecialisms,
					DesktopCatTools: $data.freelancer.DesktopCatTools,
					DesktopOperatingSystems: $data.freelancer.DesktopOperatingSystems,
					InterpretingSpecialisms: $data.freelancer.InterpretingSpecialisms,
					
    				freelancerId: $data.freelancer.id,
					rating : $data.freelancer.Rating,
					isSenior : $data.freelancer.isSenior
    			};

				if($scope.freelancer.rating)
					$scope.newrating = 0;
				else $scope.newrating = 1;	
				generateActiveResources();
                var priceDataRequest = $http.get("/api/user/freelancerData")
                    .success(function($data){
                        /** map data **/
                        $scope.catTools = $data['catTools'];
                        $scope.operatingSystems = $data['operatingSystems'];
                        $scope.specialisms = $data['specialisms'];
                        $scope.resources = $data['resources'];
						$scope.freelancer.Resources = findResources($scope.resources, $scope.freelancer.Resources);
						rebuildMultiSelect();
                        updateFreelancerSkillData();
                    });
        		$("#editFrelancerController").fadeIn();
        	});
		var ajaxUserInfo = $http.get("/api/user/" + USER_ID + "")
            .success ( function ( $data ) {
                $scope.userInfo = {
                    isActive: $data.user.isActive,
                    isAdmin: $data.user.isAdmin,
					alias : $data.user.alias,
                    profileUpdated: $data.user.profileUpdated,
                    email: $data.user.email,
                    firstName: $data.user.firstName,
                    lastName: $data.user.lastName,
					username: $data.user.username,
                    gender: $data.user.gender,
                    city: $data.user.city,
                    phone: $data.user.phone,
                    country: $data.user.country,
                    currency: $data.user.currency,
                    tmRatios: $data.tmRatios
                };
            });
			
		var ajaxCountryInfo = $http.get("/api/common/country")
            .success(function($data){
                $scope.countries = $data['countries'];
                setModalControllerData('countries', $scope.countries);
        });
		
		$q.all([ajaxUserInfo, ajaxCountryInfo])
            .then(function(){


				$scope.userInfo.country = findOptionByName($scope.countries, $scope.userInfo.country);

            });
			
		
		var ajaxRatingInfo = $http.get('/api/common/rating').success(function($data){
            $scope.ratings = $data['ratings'];
			setModalControllerData('ratings', $scope.ratings);

        });
		$q.all([ajaxFreelancerInfo, ajaxRatingInfo])
            .then(function(){

				$scope.freelancer.rating = findOptionById($scope.ratings, $scope.freelancer.rating);

            });	
		
    }
	$scope.openFileDialog = function () {
        $("#objFile").click();
    }
	/**
     * Toggle resource
     */
    $scope.toggleResource = function($id){

        var $index = $scope.freelancer.Resources.indexOf($id);
        if($index == -1){
            $scope.freelancer.Resources.push($id);
        } else {
            $scope.freelancer.Resources.splice($index, 1);
        }

    };
	$scope.upload = function(){
        $http.post('/admin/freelancer/uploadFile').success(function($data){
           // console.log($data);
        });
    };
	$scope.remove = function(){
        $http.post('/admin/freelancer/removeFile').success(function($data){
            //console.log("Post OK");
        });
    };
	function getFreelancerResume(){
        $http.get('/api/user/' + USER_ID + '/resume').success(function($data){
            if($data['resume']){
                $scope.resume = $data['resume'];
               // console.log($scope.resume);
            }
        });
    }
	function getBankInfo(){
        $http.get('/api/user/' + USER_ID + '/bank-info').success(function($data){
            if($data['bankInfo']){
                $scope.bankInfo = $data['bankInfo'];
               // console.log($scope.bankInfo);
            }
        });
    }
	// get user
    function getUser(){
        $http.get('/api/user/' + USER_ID).success(function($data){
            $scope.userInfo = $data['user'];
           // console.log($scope.userInfo);
        });
		
		var ajaxEmployerInfo = $http.get("/api/user/" + USER_ID + "/freelancer")
        	.success( function ( $data ) {
        		$scope.freelancer = {
    				username: $data.freelancer.name,
		            comments: $data.freelancer.comments,
    				freelancerId: $data.freelancer.id,
    			};
                $(".summernote").code( $data.freelancer.comments );
        		$("#editFrelancerController").fadeIn();
        });
    }

	/**
     * Mark resource active params
     */
    function generateActiveResources(){

        $scope.freelancer.Resources = $scope.freelancer.Resources;
        for(var i = 0; i < $scope.freelancer.Resources.length; i++){
            $scope.resource_active[$scope.freelancer.Resources[i]] = 'active';
        }
    }
	function rebuildMultiSelect(){
        $timeout(function(){
            $(".multiselect").multiselect("destroy");
        }).then(function(){
            $(".multiselect").multiselect();
        });
    }
	function updateFreelancerSkillData(){
        var $info = $scope.freelancer;
        $info.TranslationCatTools = findOptions($scope.catTools, $info.TranslationCatTools);
        $info.TranslationSpecialisms = findOptions($scope.specialisms, $info.TranslationSpecialisms);
        $info.DesktopCatTools = findOptions($scope.catTools, $info.DesktopCatTools);
        $info.DesktopOperatingSystems = findOptions($scope.operatingSystems, $info.DesktopOperatingSystems);
        $info.InterpretingSpecialisms = findOptions($scope.specialisms, $info.InterpretingSpecialisms);

    }
	function findResources($resourceGroups, $ids){
        var resources = [];
        for(var i = 0; i < $resourceGroups.length; i++){
            for(var j = 0; j < $resourceGroups[i].resources.length; j++){
                var resource = $resourceGroups[i].resources[j];
                if($ids.indexOf(resource.id) != -1){

                    resources.push(resource);
                }
            }
        }
        return resources;
    }
	/**
     * Display activate class
     */
	 $scope.setSenior = function(a){

		if($scope.freelancer.isSenior)
			$scope.freelancer.isSenior = false;
		else $scope.freelancer.isSenior = true;

    };
    $scope.active_class = function(a, b){
        return a == b ? 'active' : '';
    };
    
    $scope.setActive = function ( str_flag ) {
    	$scope.userInfo.isActive = str_flag;
    }
    $scope.setGender = function ( str_gender ) {
    	$scope.userInfo.gender = str_gender;
    }
    $scope.setCurrency = function ( str_currency ) {
    	$scope.userInfo.currency = str_currency;
    } 
    $scope.setProfileUploaded = function ( str_flag ) {
    	$scope.userInfo.profileUploaded = str_flag;
    }
    init();
});

angularApp.controller('AppController', ['$scope', 'FileUploader', '$http', '$timeout', 'sharedInstance', function($scope, FileUploader, $http, $timeout, sharedInstance) {
    var uploader = $scope.uploader = new FileUploader({
        url: "/" + LANG_CODE + '/admin/freelancer/uploadFile'
    });
    $scope.cvfiles = new Array();
    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    $scope.getStaffCVFiles = function() {
        $http.get('/api/user/' + USER_ID + '/cv-files').success(function ($data) {
            if ( $data['cvfiles'] ) {
                for ( var i = 0; i < $data['cvfiles'].length; i ++ ) {
                    $scope.cvfiles.push({
                        id: $data['cvfiles'][i].id,
                        name: $data['cvfiles'][i].name,
                        path: $data['cvfiles'][i].path
                    });
                    sharedInstance.addcvfile ( {
                        id: $data['cvfiles'][i].id,
                        name: $data['cvfiles'][i].name,
                        path: $data['cvfiles'][i].path
                    });
                }
                
            }
        });
    }
    $scope.init = function () {
        $scope.getStaffCVFiles();
    }
    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        
    };
    
    uploader.onAfterAddingFile = function(fileItem) {
        fileItem.upload();
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        ///console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        //console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        //console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(!response.success){
            fileItem.file.name += " - Uploading error";
            $timeout(function(){
                fileItem.remove();
            }, 1000);
            return;
        }
        fileItem.cvFile = {
            name: fileItem.file.name,
            id: response.file.id,
            path: fileItem.file.path
        };
        $scope.cvfiles.push( fileItem.cvFile );
        
        sharedInstance.addcvfile( fileItem.cvFile );
        $http.put('/api/user/'+USER_ID+'/cv-files', new Array({id: fileItem.cvFile.id, userid: USER_ID})).success(function(){ });
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        //console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
    };
    uploader.onCompleteAll = function() {
        //console.info($scope.cvfiles);
    };
    
    
    
    $scope.deleteFile = function ( cid ) 
    {
        bootbox.confirm('Are you sure!', function ( bFlag ) {
            if ( bFlag ) {
                $timeout(function(){                
                    sharedInstance.removecvfile( cid );       
                    for ( var i = 0; i < $scope.cvfiles.length; i ++ ) 
                    {
                        if ( $scope.cvfiles[i].id == cid) 
                        {
                            $scope.cvfiles.splice(i, 1);                        
                            break;
                        }
                    }
                    $scope.deleteFileArr.push(cid);
                    // $http.get("/" + LANG_CODE +"/admin/staff/deleteFile?fid=" + cid);
                    // $http.delete("/api/user/" + cid + "/cv-files");
                }, 100);                    
            }
        });
            
    };

    // -------------------------------

    var controller = $scope.controller = {
        isImage: function(item) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|png|jpg|jpeg|gif|'.indexOf(type) !== -1;
        },
        isDocument: function ( item ) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|doc|docx|odt|pdf|'.indexOf(type) !== -1;
        }
    };

    $scope.removeItem = function(item){
        if(item.isSuccess){
            var id = item.projectFile.id;
            for(var i = 0; i < $scope.project.files.length; i++){
                if($scope.project.files[i].id == id){
                    $scope.project.files.splice(i, 1);
                    break;
                }
            }
        };
        item.remove();
    };
}]);