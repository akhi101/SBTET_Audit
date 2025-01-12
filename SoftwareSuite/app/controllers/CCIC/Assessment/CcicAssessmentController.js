﻿define(['app'], function (app) {
    app.controller("CcicAssessmentController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings,CcicSystemUserService) {
        var authData = $localStorage.authorizationData;
        $scope.UserTypeID = authData.UserTypeID;
        $scope.UserName = authData.UserName;


        AppSettings.UserName = authData.UserName;
        var UserTypeID = authData.UserTypeID;
        var ModuleID = parseInt($localStorage.selectedModule.ModuleID);
        var getAssessmentsubmod = CcicSystemUserService.GetCcicUserSubModules(UserTypeID, ModuleID);
        getAssessmentsubmod.then(function (Usersdata) {
            var modulesList = [];
            if (Usersdata.length > 0) {
                for (var i = 0; i < Usersdata.length; i++) {
                    var obj = {};
                    obj.SysModName = Usersdata[i].SubModuleName;
                    obj.SysModID = Usersdata[i].ModuleID;
                    obj.ModuleRouteName = Usersdata[i].SubModuleRouteName;
                    obj.ModuleImageClass = Usersdata[i].ModuleCardClassName;
                    modulesList.push(obj);
                }
                $scope.AssessmentModules = modulesList;
            } else {
                $scope.AssessmentModules = [];
            }
        }, function (err) {
            console.log(err);
        });
        var SubmodulesList = [];

        var obj = {};
        obj.SysModName = 'Syllabus Coverage';
        obj.SysModID = '4';
        obj.ModuleRouteName = 'SyllabusCoverage';
        obj.ModuleImageClass = 'small-box bg-maroon';
        SubmodulesList.push(obj);

        var obj = {};
        obj.SysModName = 'Student Feedback';
        obj.SysModID = '4';
        obj.ModuleRouteName = 'StudentFeedback';
        obj.ModuleImageClass = 'small-box bg-blue';
        SubmodulesList.push(obj);

        var obj = {};
        obj.SysModName = 'Electives Selection';
        obj.SysModID = '3';
        obj.ModuleRouteName = 'ElectiveSelection';
        obj.ModuleImageClass = 'small-box bg-yellow';
        SubmodulesList.push(obj);
        $scope.SubmodulesList = SubmodulesList;

        $scope.OpenCcicDashboard = function () {
            $scope.homeDashBoard = true;
            $state.go("CcicDashboard");
        }
        $scope.OpenSubModule = function (Module) {
            $localStorage.Assessment = {};
            var assessment = {


            }
            $localStorage.Assessment = assessment;
            $state.go("CcicDashboard.Assessment" + Module.SubModuleRouteName);
        }
        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetCcicUserLogout = CcicSystemUserService.PostCcicUserLogout($scope.UserName, $scope.SessionID);

            delete $localStorage.authorizationData;
            delete $localStorage.authToken;
            delete $scope.SessionID;

            $scope.authentication = {
                isAuth: false,
                UserID: 0,
                UserName: ""
            };
            $state.go('CcicLogin');
        }

    });
});