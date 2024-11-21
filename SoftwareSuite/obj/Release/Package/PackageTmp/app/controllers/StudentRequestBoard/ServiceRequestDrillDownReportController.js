﻿define(['app'], function (app) {
    app.controller("ServiceRequestDrillDownReportController", function ($scope, $state, $localStorage, AppSettings, ServiceRequestDrillDownReportService) {
        var authData = $localStorage.authorizationData;
        $scope.userName = authData.userName;
        AppSettings.LoggedUserId = authData.SysUserID;
        AppSettings.DistrictIDs = authData.DistrictIDs;
        AppSettings.AcdYrID = authData.AcdYrID;

        $scope.DrillDownList = {}
        $scope.CompanyName = AppSettings.CompanyName;
        $scope.LoginYear = AppSettings.SelectedYear;
        $scope.DistrictIDs = AppSettings.DistrictIDs;
        $scope.SelectedAcdYrID = AppSettings.AcdYrID;
        $scope.LoginTime = true;

        var PageNm = $state.current.name.split(".")[1];
        var RightForCurrentPage = [];
        var UsersRightsdata = [];
        UsersRightsdata = AppSettings.UserRights;
        for (var i = 0; i < UsersRightsdata.length; i++) {
            if (UsersRightsdata[i].ListFormName == PageNm) {
                var obj = {};
                obj.isaddable = UsersRightsdata[i].isaddable;
                RightForCurrentPage.push(obj);
            }
        }
        

        var AcademicYearList = ServiceRequestDrillDownReportService.GetAcademicYear();
        AcademicYearList.then(function (data) {
            $scope.AcademicYearList = data;
            return AcademicYearList;
        }, function (error) {
            alert(error);
            });
        $scope.GetTotalRecord = function (obj, intColumnNo) {
            $scope.TotalRecordList = [];
            if (obj != null) {

                if ((intColumnNo == 2) && (obj.PendingAtSupt == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 3) && (obj.ApprovedAtSupt == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                
                if ((intColumnNo == 4) && (obj.RejectedAtSupt == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 5) && (obj.ReappliedApplications == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 6) && (obj.ApplicationsApproved == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 7) && (obj.DigitallySigned == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 8) && (obj.PendingDigitalSignature == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                if ((intColumnNo == 9) && (obj.TotalNoofApplicationsRejected == 0)) {
                    alert('Number of Records are Zero.');
                    return;
                }
                $state.go('StudentRequestBoard.StudSerList', { 'ServiceName': obj.ServiceName, 'ServiceID': obj.ServiceID, 'SelectedAcdYrID': $scope.SelectedAcdYrID, 'ColumnNo': intColumnNo, 'CallingFrom': 'DashboardReport' });
            } else {
                alert("Data Not Found.");
            }
        }
        
        $scope.DivSupHide = true;
        $scope.DivDSHide = true;
        $scope.DivJSHide = true;
        $scope.DivAPHide = true;
        $scope.DivCoEHide = true;

        $scope.FillRequests = function (AcdYrID) {
            $scope.SelectedAcdYrID   = AcdYrID;
            var ServiceRequestDrillDownReportData = ServiceRequestDrillDownReportService.GetServiceRequestDrillDownReport(AcdYrID, AppSettings.DistrictIDs, AppSettings.SysUsrGrpID);
            ServiceRequestDrillDownReportData.then(function (data) {
                $scope.DrillDownList = data;
                if (data.length > 0) {
                    if ($scope.LoginTime == true) {
                        $("select#SelectYear")[0].selectedIndex = 1;
                        $scope.LoginTime = false;
                    }
                    if (AppSettings.SysUsrGrpID == 9) {//4
                        $scope.DivSupHide = false;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = true;
                    }
                    else if (AppSettings.SysUsrGrpID == 2) {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = false;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = true;
                    }
                    else if (AppSettings.SysUsrGrpID == 11) {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = false;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = true;
                    }
                    else if (AppSettings.SysUsrGrpID == 21) {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = false;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = true;
                    }
                    else if (AppSettings.SysUsrGrpID == 17) {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = false;
                        $scope.DivCoEHide = true;
                    }
                    else if (AppSettings.SysUsrGrpID == 1) {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = false;
                    }
                    else {
                        $scope.DivSupHide = true;
                        $scope.DivDSHide = true;
                        $scope.DivJSHide = true;
                        $scope.DivAPHide = true;
                        $scope.DivERTWHide = true;
                        $scope.DivCoEHide = true;
                    }
                } else { alert("Data Not Found."); }
            }, function (error) {
                alert(error);
            });
        }

        angular.element(document).ready(function () {
            if ($scope.SelectedAcdYrID != undefined) {
                $scope.FillRequests($scope.SelectedAcdYrID);
            }
            else {
                alert('Select Academic Year');
                return;
            }
        });
    });
});