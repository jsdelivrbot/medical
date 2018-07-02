/* ==========================================================================
 * Template: Blankon Fullpack Admin Theme
 * ---------------------------------------------------------------------------
 * Author: Djava UI
 * Website: http://djavaui.com
 * Email: maildjavaui@gmail.com
 * ==========================================================================
*/

'use strict';
// =========================================================================
// BLANKON MODULE APP
// =========================================================================
var mediShareApp = angular.module('mediShare', [
    'ui.router',
    'oc.lazyLoad',
    'angular-loading-bar',
    'ngSanitize',
    'ngAnimate',
    'blankonConfig',
    'blankonDirective',
    'blankonController'
]);
mediShareApp.filter('getInnerData', function () {
  return function (items) {
    var filtered = [];
    if (items) {
        angular.forEach(Object.keys(items), function(obj, index) {
            var item = items[obj];
            item.Id = obj;
            filtered.push(item)
        });
    };
    return filtered;
  };
});
var diagnoseTypes = {
    New:"New",
    Assigned:"Assigned",
    Canceled:"Canceled",
    Completed:"Completed",
    Timeout:"Timeout",
    Accepted:"Accepted",
    Rejected:"Rejected"
};
var securityRefs = {
    nurse :"nurse-security",
    doctor : "doctor-security"
};
var tblRefs = {
	diagnosis :"Diagnosis",
	doctors :"Doctors",
	nurses :"Nurses",
    infectiontypes :"InfectionTypes",
};
mediShareApp.factory('DbConService', ['$http', '$window', function ($http, $window) {
    return {
        getTableCon: function (ref) {
            var dbRef = firebase.database().ref(ref);
		    var e = firebase.auth().signInAnonymously().catch(function(error) {
		      var errorCode = error.code;
		      var errorMessage = error.message;
		    });
		    return dbRef;
        },
    }
}]);
mediShareApp.controller("PoolListCtrl", PoolListCtrl);    
PoolListCtrl.$inject = ['$scope','DbConService','$rootScope','$state','$filter'];
function PoolListCtrl($scope,DbConService,$rootScope,$state,$filter) {
	    var dbRef = DbConService.getTableCon(tblRefs.diagnosis);
         $scope.getDiagnosis = function(type){
            $scope.isloadingDiagnosis = true;
            dbRef.on("value", function(data) {
                $scope.isloadingDiagnosis = false;
                dbRef.off();
                var reModeledArr = $filter("getInnerData")(data.val());
                $scope.diagnoses = $filter("filter")(reModeledArr, { Status : type }, true);
                $scope.$apply();
             }, function (error) {
               console.log("Error: " + error.code);
             });
         };
         function getType(){
            var stateName = $state.current.name ;
            switch(stateName) {
              case "pool-new-diagnosis":
                  return diagnoseTypes.New;
              case "pool-timeouts":
                  return diagnoseTypes.Timeout;
            };
         };
         $scope.getType = function(){
           return  getType(); 
         };
         $scope.getDiagnosis(getType());  
         $scope.setCurrentDiagnose = function(diagnose,index){
            $scope.diagnose = diagnose;
            $scope.index = index;
         };
         $scope.deleteDiagnose = function(){
            var object={}
            object[$scope.diagnose.Id] = null;
            dbRef.update(object);
            $(".deleted-diagnose").click();
            $scope.diagnoses.splice($scope.index, 1);
        
        };
        $scope.setCurrentDiagnose = function(diagnose,index){
            $scope.diagnose = diagnose;
            $scope.index = index;
        };
        $scope.moveDiagnose = function(diagnose,index){
            $scope.diagnose = diagnose;
            $scope.index = index;
            var object = {};
            $scope.diagnose.DoctorAssigned = $rootScope.currentUser.FullName;
            $scope.diagnose.DoctorAssignedId = $rootScope.currentUser.Id;
            $scope.diagnose.Status = diagnoseTypes.Assigned;
            $scope.diagnose.AssignedOn = GetDateFormatted(new Date());
            object[$scope.diagnose.Id] = $scope.diagnose;
            dbRef.update(object);
            $(".close-doctr-diag").click();
            $scope.diagnoses.splice($scope.index, 1);
            if ($rootScope.countNewDiagnoses > 0) {
                $rootScope.countNewDiagnoses = $rootScope.countNewDiagnoses -1;
            }
        };
};

mediShareApp.controller("DoctorDiagnosisCtrl", DoctorDiagnosisCtrl);
DoctorDiagnosisCtrl.$inject = ['$scope','DbConService','$rootScope','$state','$filter'];
function DoctorDiagnosisCtrl($scope,DbConService,$rootScope,$state,$filter) {
		var dbRef = DbConService.getTableCon(tblRefs.diagnosis);
        var dbRefInfTypes = DbConService.getTableCon(tblRefs.infectiontypes);
        $scope.infectionTypes = [];
        dbRefInfTypes.on("value", function(data) {
            $scope.isloadingDiagnosis = false;
            dbRefInfTypes.off();
            var reModeledArr = $filter("getInnerData")(data.val());
            $scope.infectionTypes = reModeledArr;
            $scope.$apply();
         }, function (error) {
           console.log("Error: " + error.code);
         });
         $scope.getDiagnosis = function(type){
            $scope.isloadingDiagnosis = true;
            dbRef.on("value", function(data) {
                $scope.isloadingDiagnosis = false;
                dbRef.off();
                var reModeledArr = $filter("getInnerData")(data.val());
                $scope.diagnoses = $filter("filter")(reModeledArr, { Status : type }, true);
                $scope.diagnoses = $filter("filter")(angular.copy($scope.diagnoses), { DoctorAssignedId : $rootScope.currentUser.Id }, true);
                $scope.$apply();
             }, function (error) {
               console.log("Error: " + error.code);
             });
         };
         function getType(){
            var stateName = $state.current.name ;
            switch(stateName) {
              case "list-assigned":
                  return diagnoseTypes.Assigned;
              case "list-completed":
                  return diagnoseTypes.Completed;
              case "list-timeout":
                  return diagnoseTypes.Timeout;
            };
         };
         $scope.getType = function(){
           return getType(); 
         };
         $scope.getDiagnosis(getType());  
         $scope.setFillDiagnose = function(diagnose,index){
            $scope.diagnose = diagnose;
            $scope.index = index;
            $scope.viewType = "fill";
        };
        $scope.viewType = "list";  
        $scope.backToList = function(){
          $scope.viewType = "list";  
        };
        $scope.UnAssignDiagnose = function(diagnose,index){
            $scope.diagnose = diagnose;
            var object = {};
            $scope.diagnose.DoctorAssigned = null;
            $scope.diagnose.DoctorAssignedId = null;
            $scope.diagnose.Status = diagnoseTypes.New;
            $scope.diagnose.AssignedOn = null;
            object[$scope.diagnose.Id] = $scope.diagnose;
            dbRef.update(object);
            $rootScope.countNewDiagnoses = $rootScope.countNewDiagnoses + 1;
            $scope.diagnoses.splice(index, 1);
        };
     $scope.diagnosisForm = {}; 
     $scope.currentActive = {diagnose1 :true  };
     $scope.diagnosisMod = {};
     $scope.submitDiagnose = function(){
        if($scope.diagnosisForm.form.$submitted) {
            $scope.diagnosisForm.form.$submitted = true;
        }
        if($scope.diagnosisForm.form.$valid) {
            var object = {};
            $scope.diagnosisMod.DoctorCompletedId = $rootScope.currentUser.Id;
            $scope.diagnosisMod.DoctorCompletedName = $rootScope.currentUser.FullName;
            $scope.diagnosisMod.Code = randomStr(4);
            $scope.diagnosisMod.CompletedOn = GetDateFormatted(new Date());
            $scope.diagnosisMod.Status = diagnoseTypes.Completed;
            var objAll = JSON.parse(JSON.stringify(Object.assign($scope.diagnosisMod,$scope.diagnose)));
            objAll.Status = diagnoseTypes.Completed;
            debugger
            object[$scope.diagnose.Id] = objAll;
            dbRef.update(object);
            $scope.diagnoses.splice($scope.index, 1);
            $scope.diagnoseSuccessMsg = "diagnose is filled successfully";
            $scope.viewType = "list";  
        }
     };
     $scope.setCurrentInfo = function(type){
        $scope.currentActive = {};
        $scope.currentActive[type] = true;
        $("." + "li-" + type).click();
     };


};
mediShareApp.controller("DoctorNotificationCtrl", DoctorNotificationCtrl);
DoctorNotificationCtrl.$inject = ['$scope','DbConService'];
function DoctorNotificationCtrl($scope,DbConService) {
		 
};
mediShareApp.controller("NurseNotificationCtrl", NurseNotificationCtrl);
NurseNotificationCtrl.$inject = ['$scope','DbConService','$rootScope','$state','$filter'];
function NurseNotificationCtrl($scope,DbConService,$rootScope,$state,$filter) {
	
};
mediShareApp.controller("NurseDiagnosisCtrl", NurseDiagnosisCtrl);
NurseDiagnosisCtrl.$inject = ['$scope','DbConService','$rootScope','$state','$filter'];
function NurseDiagnosisCtrl($scope,DbConService,$rootScope,$state,$filter) {
    var dbRef = DbConService.getTableCon(tblRefs.diagnosis);
    $scope.getDiagnosis = function(type){
        $scope.isloadingDiagnosis = true;
        dbRef.on("value", function(data) {
            $scope.isloadingDiagnosis = false;
            dbRef.off();
            var reModeledArr = $filter("getInnerData")(data.val());
            $scope.diagnoses = $filter("filter")(reModeledArr, { Status : type }, true);
            $scope.diagnoses = $filter("filter")(angular.copy($scope.diagnoses), { NurseCreatedId : $rootScope.currentUser.Id }, true);
            $scope.diagnoses = $filter('orderBy')($scope.diagnoses, '-CreatedOn');
            $scope.$apply();
         }, function (error) {
           console.log("Error: " + error.code);
         });
    };
    function getType(){
        var stateName = $state.current.name ;
        switch(stateName) {
          case "diagnosis-unassignednew":
              return diagnoseTypes.New;
          case "diagnosis-assigned":
              return diagnoseTypes.Assigned;
          case "diagnosis-completed":
              return diagnoseTypes.Completed;
          case "diagnosis-timeout":
              return diagnoseTypes.Timeout;
        };
    }
    $scope.getDiagnosis(getType());	 
    $scope.setCurrentDiagnose = function(diagnose,index){
        $scope.diagnose = diagnose;
        $scope.index = index;
    };
    $scope.deleteDiagnose = function(){
        var object={}
        object[$scope.diagnose.Id] = null;
        dbRef.update(object);
        $(".deleted-diagnose").click();
        $scope.diagnoses.splice($scope.index, 1);
    };
};

mediShareApp.controller("CreateDiagnoseCtrl", CreateDiagnoseCtrl);
CreateDiagnoseCtrl.$inject = ['$scope','DbConService','$rootScope','$filter','$state'];
function CreateDiagnoseCtrl($scope,DbConService,$rootScope,$filter,$state) {
     var dbRef = DbConService.getTableCon(tblRefs.diagnosis);
     var dbRefDoctors = DbConService.getTableCon(tblRefs.doctors);
     $scope.diagnosisForm = {};
     $scope.currentActive = {information :true  };
     $scope.diagnosisMod = {};
     $scope.submitDiagnose = function(){
        if($scope.diagnosisForm.form.$submitted) {
            $scope.diagnosisForm.form.$submitted = true;
        }
        if($scope.diagnosisForm.form.$valid) {
            $scope.diagnosisMod.NurseCreatedId = $rootScope.currentUser.Id;
            $scope.diagnosisMod.NurseCreatedName = $rootScope.currentUser.FullName;
            $scope.diagnosisMod.Code = randomStr(4);
            $scope.diagnosisMod.CreatedOn = GetDateFormatted(new Date());
            $scope.diagnosisMod.Status = diagnoseTypes.New;
            dbRef.push($scope.diagnosisMod);  
            $scope.diagnoseSuccessMsg = "diagnose is created successfully";
            $state.go('diagnosis-unassignednew');
        }
     };
     $scope.setCurrentInfo = function(type){
        $scope.currentActive = {};
        $scope.currentActive[type] = true;
        $("." + "li-" + type).click();
     };

};

mediShareApp.controller("DiagnoseNewCounterCtrl", DiagnoseNewCounterCtrl);
DiagnoseNewCounterCtrl.$inject = ['$scope','DbConService','$rootScope','$filter','$state'];
function DiagnoseNewCounterCtrl($scope,DbConService,$rootScope,$filter,$state) {
     var dbRef = DbConService.getTableCon(tblRefs.diagnosis);
     var dbRefInfTypes = DbConService.getTableCon(tblRefs.infectiontypes);
    dbRefInfTypes.on("value", function(data) {
        dbRefInfTypes.off();
        if (!data.val()) {
            var defaultInfTypes = [
            "Lower Respiratory Infections",
            "Diarrheal Diseases",
            "Protein-Energy Malnutrition",
            "Birth Asphyxia & Trauma ",
            "Stroke",
            "Preterm Birth Complications",
            "Malaria",
            "TB",
            "Ischemic Heart Disease"
            ];
            angular.forEach(defaultInfTypes, function(obj, index) {
                var objInf = {};
                objInf.InfectionType = obj;
                dbRefInfTypes.push(objInf);
            });
        }
        $scope.$apply();
     }, function (error) {
       console.log("Error: " + error.code);
     });
     dbRef.on("value", function(data) {
        dbRef.off();
        var reModeledArr = $filter("getInnerData")(data.val());
        $scope.diagnoses = $filter("filter")(reModeledArr, { Status : diagnoseTypes.New }, true);
        $rootScope.countNewDiagnoses = $scope.diagnoses.length;
        $scope.$apply();
     }, function (error) {
       console.log("Error: " + error.code);
     });   
    $scope.moveToNewDiagnoses = function(){
        $state.go("pool-new-diagnosis");
    };

};
function GetDateFormatted(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        var dd = date.getMonth() + 1;
        var mm = date.getDate();
        if (dd < 10) {
            dd = '0' + '' + dd;
        }
        if (mm < 10) {
            mm = '0' + '' + mm;
        }
        return dd + "/" + mm + "/" + date.getFullYear() + "  " + strTime;
}
function randomStr(count) {
  var text = "";
  var possible = "ABC2345ASDFG8787876JK12398734572iWQASK";
  for (var i = 0; i < count + 1; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}



