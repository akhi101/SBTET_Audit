﻿define(['app'], function (app) {
	app.controller("BasicManagementTypeListController", function ($scope, $state, AppSettings, BasicManagementTypeService) {
        $scope.CompanyName = AppSettings.CompanyName;
        $scope.LoginYear = AppSettings.SelectedYear;
        var PageNm = $state.current.name.split(".")[1];
        var RightForCurrentPage = [];
        var UsersRightsdata = [];
        UsersRightsdata = AppSettings.UserRights;
        for (var i = 0; i < UsersRightsdata.length; i++) {
            if (UsersRightsdata[i].GridFormToOpen == PageNm) {
                var obj = {};
                obj.RollAdd = UsersRightsdata[i].RollAdd;
                RightForCurrentPage.push(obj);
            }
        }

		var gridColumns = [
			
            { field: "MngtTypName", headerText: " Management Type ", textAlign: ej.TextAlign.Left, width: 40 },			
            { field: "Active", headerText: "Status", textAlign: ej.TextAlign.Left, width: 20 },
            { field: "MngtTypID", headerText: "MngtTypID", textAlign: ej.TextAlign.Right, visible: false } 
        ];
		$scope.BasicManagementTypeList = [];
		$("#BasicManagementType").ejGrid({
			dataSource: $scope.BasicManagementTypeList,
            allowPaging: true,
            pageSettings: { pageSize: 10 },
            allowSearching: true,
            allowScrolling: true,
            allowResizeToFit: true,
            allowFiltering: true,
			toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.WordExport, ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.PdfExport, ej.Grid.ToolBarItems.Search] },
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
            //if (RightForCurrentPage[0].RollAdd != 'Y') {
            //     alert("You Don't have Add Rights");
            //    return;
            // } else {
            $state.go('Masters.BasicManagementType', { MngtTypID: 0 });
            //}
        }
        // Edit delete record
        $scope.doubleclick = function doubleclick(sender, args) {
            if (this.multiSelectCtrlRequest == false) {
                //$state.go('Masters.BasicManagementType', { MngtTypID: sender.data.MngtTypID });
            }
        }
		//var BasicManagementTypedata = BasicManagementTypeService.GetBasicManagementTypeList();
		//BasicManagementTypedata.then(function (data) {
		//	$scope.BasicManagementTypeList = data;
  //      }, function (error) {
  //          alert(error);
  //      });

        var BasicManagementTypedata = BasicManagementTypeService.GetBasicManagementTypeForList(3);
        BasicManagementTypedata.then(function (data) {
            $scope.BasicManagementTypeList = data;
        }, function (error) {
            alert(error);
        });

        $scope.FillDistrictList = function (ActiveFlag) {
            if (ActiveFlag == undefined) { ActiveFlag = 3; }
            if (ActiveFlag == "") { ActiveFlag = 3; }
            var BasicManagementTypedata = BasicManagementTypeService.GetBasicManagementTypeForList(ActiveFlag);
            BasicManagementTypedata.then(function (data) {
                $scope.BasicManagementTypeList = data;
            }, function (error) {
                alert(error);
            });
        }
    });
});