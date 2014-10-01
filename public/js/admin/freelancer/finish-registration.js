/**
 * Created by antiprovn on 9/27/14.
 */
var angularApp = angularApp || angular.module('project', []);

angularApp.run(function($rootScope){
    $("#form").steps({
        bodyTag: "fieldset",
        showFinishButtonAlways: true,
        paginationPosition: "both",
        onStepChanging: function (event, currentIndex, newIndex) {
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex) {
                return true;
            }

            // Forbid suppressing "Warning" step if the user is to young
            if (newIndex === 3 && Number($("#age").val()) < 18) {
                return false;
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex) {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            // Suppress (skip) "Warning" step if the user is old enough.
            if (currentIndex === 2 && Number($("#age").val()) >= 18) {
                $(this).steps("next");
            }

            // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
            if (currentIndex === 2 && priorIndex === 3) {
                $(this).steps("previous");
            }
        },
        onFinishing: function (event, currentIndex) {
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function (event, currentIndex) {
            var form = $(this);

            angular.element('#UpdateInfoController').scope().submit();
        }
    }).validate({
        errorPlacement: function (error, element) {
            element.before(error);
        },
        rules: {
            confirm: {
                equalTo: "#password"
            }
        }
    });
});

angularApp.controller("BasicUserInfoUpdateController", function($scope, $http){
    $scope.countries = [];
    $scope.userInfo = {
        "city": null,
        "country": {
            "select": null
        },
        "currency": null,
        "createdTime": null,
        "email": null,
        "firstName": null,
        "gender": false,
        "group": null,
        "id": null,
        "isActive": null,
        "lastLogin": null,
        "lastName": null,
        "phone": null,
        "profileUpdated": null,
        "resources": null,
        "DesktopCatTools": null,
        "DesktopOperatingSystems": null,
        "InterpretingSpecialisms": null,
        "TranslationCatTools": null,
        "TranslationSpecialisms": null
    };

    $scope.init = function(listeners){
        $http.get("/api/user/" + USER_ID + "/info")
            .success(function($data){
                $scope.userInfo = $data['user'];
                if($scope.countries.length){
                    $scope.userInfo.country = findOption($scope.countries, $scope.userInfo.country);
                }

                angular.element(listeners).each(function(){
                    angular.element(this).scope().initWithUserInfo($scope.userInfo);
                });
            });

        $http.get("/api/common/country")
            .success(function($data){
                $scope.countries = $data['countries'];
                if($scope.userInfo.country){
                    $scope.userInfo.country = findOption($scope.countries, $scope.userInfo.country);
                }
            });
    };

    $scope.submit = function(){
        return requestInfo = $http.put("/api/user/" + $scope.userInfo.id + "/info/", $scope.userInfo);
    };
});

angularApp.controller('FreelancerResourceUpdateController', function($scope, $http, $timeout, $q){
    $scope.resource_active = {};
    $scope.resources = [];

    /**
     * Mark resource active params
     */
    function generateActiveResources(){
        $scope.freelancerInfo.Resources = $scope.freelancerInfo.Resources;
        for(var i = 0; i < $scope.freelancerInfo.Resources.length; i++){
            $scope.resource_active[$scope.freelancerInfo.Resources[i]] = 'active';
        }
    }

    $scope.initWithUserInfo = function($userInfo){
        $scope.userInfo = $userInfo;
        $http.get("/api/user/" + $userInfo.id + "/freelancer")
            .success(function($data){
                $scope.freelancerInfo = $data['freelancer'];
                generateActiveResources();

                $http.get("/api/user/resource")
                    .success(function($data){
                        $scope.resources = $data['resources'];
                    });
            });
    };

    $scope.init = function(){
        $http.get("/api/user/" + USER_ID + "/info")
            .success(function($data){
                $scope.initWithUserInfo($data['user']);
            });
    };

    $scope.submit = function(){
        angular.element("#")
    };
});

angularApp.controller('UpdateInfoController', function($scope, $http, $timeout, $q){
    $scope.catTools = [];
    $scope.countries = [];
    $scope.freelancerInfo = {};
    $scope.languages = [];
    $scope.operatingSystems = [];
    $scope.resource_active = {};
    $scope.resources = [];
    $scope.specialisms = [];
    $scope.translationPrice = {};
    $scope.translationPrices = [];
    $scope.userInfo = {};


    function updateUserInfoPriceData(){
        var $info = $scope.freelancerInfo;
        $info.TranslationCatTools = findOptions($scope.catTools, $info.TranslationCatTools);
        $info.TranslationSpecialisms = findOptions($scope.specialisms, $info.TranslationSpecialisms);
        $info.DesktopCatTools = findOptions($scope.catTools, $info.DesktopCatTools);
        $info.DesktopOperatingSystems = findOptions($scope.operatingSystems, $info.DesktopOperatingSystems);
        $info.InterpretingSpecialisms = findOptions($scope.specialisms, $info.InterpretingSpecialisms);
    }

    function initModal(){
        setModalControllerData('desktopPrice', {
            language: $scope.languages[0],
            software: $scope.softwares[0]
        });
        setModalControllerData('interpretingPrice', {
            sourceLanguage: $scope.languages[0],
            targetLanguage: $scope.languages[0],
            service: $scope.services[0]
        });
        setModalControllerData('translationPrice', {
            sourceLanguage: $scope.languages[0],
            targetLanguage: $scope.languages[0]
        });

        setModalControllerData('languages', $scope.languages);
        setModalControllerData('services', $scope.services);
        setModalControllerData('softwares', $scope.softwares);
    }

    function rebuildMultiSelect(){
        $timeout(function(){
            $(".multiselect").multiselect("destroy");
        }).then(function(){
            $(".multiselect").multiselect();
        });
    }

    /** end mapping function **/

    $http.get("/api/user/" + USER_ID + "/freelancer")
        .success(function($data){
            $scope.freelancerInfo = $data['freelancer'];


            $http.get("/api/user/priceData")
                .success(function($data){
                    /** map data **/
                    $scope.catTools = $data['catTools'];
                    $scope.languages = $data['languages'];
                    $scope.operatingSystems = $data['operatingSystems'];
                    $scope.specialisms = $data['specialisms'];
                    $scope.services = $data['services'];
                    $scope.softwares = $data['softwares'];

                    initModal();
                    updateUserInfoPriceData();

                    rebuildMultiSelect();
                });
        });

    /**
     * Submit the form
     */
    $scope.submit = function(){

        var requestInfo = $http.put("/api/user/" + $scope.userInfo.id + "/info/", $scope.userInfo);
        var requestFreelancer = $http.put("/api/user/" + $scope.userInfo.id + "/freelancer/", {
            'DesktopCatTools': getIds($scope.freelancerInfo.DesktopCatTools),
            'DesktopOperatingSystems': getIds($scope.freelancerInfo.DesktopOperatingSystems),
            'InterpretingSpecialisms': getIds($scope.freelancerInfo.InterpretingSpecialisms),
            'Resources': getIds($scope.freelancerInfo.Resources),
            'TranslationCatTools': getIds($scope.freelancerInfo.TranslationCatTools),
            'TranslationSpecialisms': getIds($scope.freelancerInfo.TranslationSpecialisms)
        });

        // wait all done
        $q.all([requestFreelancer, requestInfo])
            .then(function(result){
                // TODO: change this callback
                alert("Success update all");
            });
    };

    /**
     * Toggle resource
     */
    $scope.toggleResource = function($id){
        var $index = $scope.freelancerInfo.Resources.indexOf($id);
        if($index == -1){
            $scope.freelancerInfo.Resources.push($id);
        } else {
            $scope.freelancerInfo.Resources.splice($index, 1);
        }
    };

    /**
     * Display activate class
     */
    $scope.active_class = function(a, b){
        return a == b ? 'active' : '';
    };

    /**
     * Save translation price from modal
     * @param translationPrice
     */
    $scope.saveTranslationPrice = function(translationPrice){
        console.log(translationPrice);
    };

    /**
     * Save desktop price from modal
     * @param desktopPrice
     */
    $scope.saveDesktopPrice = function(desktopPrice){
        console.log(desktopPrice);
    };

    /**
     * Save interpreting price from modal
     * @param interpretingPrice
     */
    $scope.saveInterpretingPrice = function(interpretingPrice){
        console.log(interpretingPrice);
    };
});