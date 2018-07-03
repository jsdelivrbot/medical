"use strict";
(function(){
    angular.module('blankonApp.account.signin', [])
        .controller('SecurityCtrl', function(settings,$scope,DbConService,$filter,$rootScope,$state) {
            var dbRef = null;
            var type = "";
            if ($state.is(securityRefs.doctor)) {
                type = 1;
                dbRef = DbConService.getTableCon(tblRefs.doctors)
            }
            else if($state.is(securityRefs.nurse)){
                type = 2;
                dbRef = DbConService.getTableCon(tblRefs.nurses)
            }
            $scope.signIn = {};
            $scope.signInMod = {};
            $scope.signInBtn = "Sign In";
            $scope.signUp = {};
            $scope.signUpMod = {};
            $scope.signUpBtn = "Sign Up";
            $scope.login = function(){
                if ($scope.signIn.form.$valid) {
                    $scope.signInBtn = "Processing, please wait";
                    dbRef.on("value", function(data) {
                        dbRef.off();
                        var reModeledArr = $filter("getInnerData")(data.val());
                        var isExists = $filter("filter")(reModeledArr, { Email : $scope.signInMod.Email }, true)[0];
                        if (isExists && isExists.Password == $scope.signInMod.Password) {
                            isExists.type = type;
                            window.localStorage.currentUser = angular.toJson(isExists);
                            $rootScope.currentUser = isExists;  
                            $rootScope.isThereFullPage = $state.is(securityRefs.nurse) || $state.is(securityRefs.doctor); 
                            if ($rootScope.currentUser.type == 1) {
                                $state.go('pool-new-diagnosis');    
                            }
                            else{
                                $state.go('diagnosis-unassignednew');    
                            }
                        }
                        else{
                            $scope.loginMessageError = "Email or password are wrong,Please try again with correct credentials";
                        };
                        $scope.signInBtn = "Sign In";
                        if(!$scope.$$phase) {
                          $scope.$apply();
                        };
                     }, function (error) {
                       console.log("Error: " + error.code);
                     });
                    }
            };
            $scope.signUp = function(){
                if ($scope.signUp.form.$valid) {
                    $scope.signUpBtn = "Processing, please wait";
                    dbRef.on("value", function(data) {
                        dbRef.off();
                        var reModeledArr = $filter("getInnerData")(data.val());
                        var isExists = $filter("filter")(reModeledArr, { Email : $scope.signUpMod.Email }, true)[0];
                        if (isExists) {
                            $scope.creationMessageError = "The Email is already taken,please try with a different email address";
                            $scope.creationMessageSuccess = "";
                        }
                        else{
                            $scope.creationMessageSuccess = "Congratulations, You are registered successfully";
                            $scope.creationMessageError = "";
                            var refKey = dbRef.push($scope.signUpMod);  
                            var obj = angular.copy($scope.signUpMod);
                            obj.Id = refKey.getKey();
                            obj.type = type;
                            window.localStorage.currentUser = angular.toJson(obj);
                            $rootScope.currentUser = obj;  
                            $rootScope.isThereFullPage = $state.is(securityRefs.nurse) || $state.is(securityRefs.doctor); 
                            if ($rootScope.currentUser.type == 1) {
                                $state.go('pool-new-diagnosis');    
                            }
                            else{
                                $state.go('diagnosis-unassignednew');    
                            }
                        }
                        $scope.signUpBtn = "Sign Up";
                        if(!$scope.$$phase) {
                          $scope.$apply();
                        }
                     }, function (error) {
                       console.log("Error: " + error.code);
                     });
                }
            };

            // =========================================================================
            // SETTING HEIGHT
            // =========================================================================
            $('#sign-wrapper').css('min-height',$(window).outerHeight());
        })

})();