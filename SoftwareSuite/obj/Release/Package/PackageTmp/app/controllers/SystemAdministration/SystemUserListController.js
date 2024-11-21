﻿define(['app'], function (app) {
	app.controller("SystemUserListController", function ($scope, $state, AppSettings, SystemUserService) {
		$scope.SystemUserList = {}
		$scope.CompanyName = AppSettings.CompanyName;
        $scope.LoginYear = AppSettings.SelectedYear;
        var PageNm = $state.current.name.split(".")[1];
        var RightForCurrentPage = [];
        var UsersRightsdata = [];
        UsersRightsdata = AppSettings.UserRights;
        for (var i = 0; i < UsersRightsdata.length; i++) {
            if (UsersRightsdata[i].GridFormToOpen == PageNm) {
                var obj = {};
                obj.isaddable = UsersRightsdata[i].isaddable;
                RightForCurrentPage.push(obj);
            }
        }
        var gridColumns = [
			{ field: "GroupName", headerText: "User Group", textAlign: ej.TextAlign.Left, width: 100 },
			{ field: "LoginName", headerText: "User Name", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "FirstName", headerText: "First Name", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "LastName", headerText: "Last Name", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "CellNo", headerText: "Cell No", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "EmailId", headerText: "Email ID ", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "TypeFlag", headerText: "User Type", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "CollegeName", headerText: "College", textAlign: ej.TextAlign.Left, width: 50 },
            { field: "Active", headerText: "Status", textAlign: ej.TextAlign.Left, width: 50 },
			{ field: "SysUserID", headerText: "SysUserID", textAlign: ej.TextAlign.Right, visible: false }
        ];
		$scope.SystemUserList = [];
		$("#SystemUser").ejGrid({
			dataSource: $scope.SystemUserList,
            allowPaging: true,
            pageSettings: { pageSize: 10 },
            allowSearching: true,
            allowScrolling: true,
            allowResizeToFit: true,
            allowFiltering: true,
			toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Add, ej.Grid.ToolBarItems.WordExport, ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.PdfExport, ej.Grid.ToolBarItems.Search] },
			editSettings: { allowAdding: true },
            toolbarClick: function (args) {
                if (args.itemName == "Add") {
                    args.cancel = true;
                    AddNew();
                }
                if (args.itemName == "Excel Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToExcelUrl);
                }
                if (args.itemName == "Word Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToWordUrl);
                }
                if (args.itemName == "PDF Export") {
                    args.cancel = true;
                    this.export(AppSettings.ExportToPdfUrl);
                }
            },
            columns: gridColumns
        });
        // Add new Record
        function AddNew() {
            //if (RightForCurrentPage[0].isaddable != 'Y') {
            //     alert("You Don't have Add Rights");
            //    return;
            // } else {
            $state.go('Masters.SystemUser', { SysUserID: 0 });
            //}
        }
        // Edit delete record
        $scope.doubleclick = function doubleclick(sender, args) {
            if (this.multiSelectCtrlRequest == false) {
                $state.go('Masters.SystemUser', { SysUserID: sender.data.SysUserID });
            }
        }
		var SystemUserdata = SystemUserService.GetSystemUsereList();
		SystemUserdata.then(function (data) {
			$scope.SystemUserList = data;
        }, function (error) {
            alert(error);
        });
    });
});