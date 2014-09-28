/**
 * Created by antiprovn on 9/27/14.
 */
angularApp.run(function($rootScope){
    $("#form").steps({
        bodyTag: "fieldset",
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
angularApp.controller('UpdateInfoController', function($scope, $http){
    $scope.userInfo = {};
    $scope.countries = [];

    $http.get("/api/user-info")
        .success(function($data){
            $scope.userInfo = $data['user'];
            if($scope.countries.length){
                $scope.userInfo.country = findOption($scope.countries, $scope.userInfo.country);
            }
        });

    $http.get("/api/common-country")
        .success(function($data){
            $scope.countries = $data['countries'];
            if($scope.userInfo.country){
                $scope.userInfo.country = findOption($scope.countries, $scope.userInfo.country);
            }
        });

    /**
     * Submit the form
     */
    $scope.submit = function(){
        $http.put("/api/user-info/" + $scope.userInfo.id, $scope.userInfo)
            .success(function($data){
                alert($data);
            });
    }

    /**
     * Display activate class
     */
    $scope.active_class = function(a, b){
        return a == b ? 'active' : '';
    }
});