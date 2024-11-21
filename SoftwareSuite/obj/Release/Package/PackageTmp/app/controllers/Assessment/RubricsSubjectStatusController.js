﻿define(['app'], function (app) {

    app.controller("RubricsSubjectStatusController", function ($scope, $http, $localStorage, $state, $uibModal, $stateParams, AppSettings, MenuService, AssessmentService, MarksEntryService, PaymentService) {
        var authData = $localStorage.authorizationData;
        $scope.userName = authData.userName;
        AppSettings.userName = authData.userName;
        var BranchCode = authData.userName;
        //AppSettings.LoggedUserId = authData.SysUserID;
        //AppSettings.CollegeID = authData.CollegeID;
        //$scope.CollegeID = authData.CollegeID;
        //$scope.College_Code = authData.College_Code;
        $scope.College_Name = authData.College_Name;
        
        //$scope.BranchId = authData.BranchId;
        $scope.showcollegedetail = false;
        $scope.subjectDetailsView = false;
        $scope.LoadImgForPinList = true;
        $scope.studentsNotFound = true;
        $scope.subbtn = false;
        var issaved = true;
        var selectScheme = $localStorage.assessment.Scheme.Scheme;
        $scope.AcademicYearsActiveResponse = $localStorage.assessment.AcademicYearsActiveResponse;

        $scope.selectedsem = $localStorage.assessment.selectedsem;
        $scope.branch = $localStorage.assessment.branchName;
        var examtype = $localStorage.assessment.entryList;
        var branchName = $localStorage.assessment.branchName;


        $scope.College_Code = authData.College_Code;

        var selectScheme = $localStorage.assessment.Scheme;
        var AcademicId = $localStorage.assessment.AcademicYearsActiveResponse.AcademicID;
        var SemId = $localStorage.assessment.selectedsem.semid;
       
        var SchemeId = $localStorage.assessment.Scheme;
        $scope.SchemeId = $localStorage.assessment.SchemeId;
        $scope.loadedScheme = {};
        $scope.loadedScheme.Scheme = selectScheme;

        var SubjectTypeId = $localStorage.assessment.SubjectTypeId;
        // var StudentTypeId = $localStorage.assessment.StudentTypeId

        var BranchId = authData.BranchId;
        
        //var collegecode = $localStorage.assessment.CollegeCode;

      
     
        $scope.pinWise = [];

        var RubricsSubjectPinList = MarksEntryService.RubricsgetSubjectPinList(SubjectTypeId, $scope.College_Code, SemId, BranchId, $scope.SchemeId, AcademicId);
       
        RubricsSubjectPinList.then(function (response) {
         
      
            if (response.Table.length > 0) {
                var pinWiseNonFiltered = response.Table;
                for (var i = 0 ; i < pinWiseNonFiltered.length ; i++) {
                    if (pinWiseNonFiltered[i].IsPassed != null) {

                        if (pinWiseNonFiltered[i].IsPassed == '0') {
                            pinWiseNonFiltered[i].IsPassed = "Fail";
                        }
                        if (pinWiseNonFiltered[i].IsPassed == '1') {
                            pinWiseNonFiltered[i].IsPassed = "Pass";
                        }
                        $scope.pinWise.push(pinWiseNonFiltered[i]);
                    }
                }
                $scope.subjectDetailsView = true;
                $scope.studentsNotFound = false;
            }
            
        },
             function (error) {
                 alert("error");
                 $scope.studentsNotFound = true;
             });
        
        

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   
            $scope.reverse = !$scope.reverse; 
        }

        var studentdetailes = [];
        
    
        $scope.finalStudentData = [];
        $scope.changeStuentType = function (ExamValue, studentDetails) {
            studentDetails.IsPassed = ExamValue;
            for (var i = 0; i < $scope.finalStudentData.length ; i++) {
                if ($scope.finalStudentData[i].Id == studentDetails.Id) {
                    $scope.finalStudentData.splice(i, 1);
                    break;
                }
            }
            if (studentDetails.IsPassed == '1' || studentDetails.IsPassed == '0') {
                $scope.finalStudentData.push(studentDetails);
            }
        }



         
        $scope.save = function () {
            if ($scope.finalStudentData.length > 0) {
                var stringRubricsData = JSON.stringify($scope.finalStudentData);

            } else {
                alert("");
            }
            var SETRubricsMarks = AssessmentService.SETRubricsMarks(SubjectTypeId, stringRubricsData)
            SETRubricsMarks.then(function (response) {
            
                alert("Marks status is update");

            }, function (error) {
                console.log(error);
                alert(error);

            });
        }
        var schemename = $localStorage.assessment.Scheme.Scheme;
        $scope.printMarksEntered = function () {
            if (issaved == false) {
                alert('Save the marks before You Print');
                return;
            }
            var divName = "idtoDivPrint";
            var $markstable = document.createElement("div");
            $markstable.innerHTML = '';
            $markstable.className = "table";

            var parsent = new DOMParser();
            var bl = parsent.parseFromString('<div id="divtitle">STATE BOARD OF TECHNICAL EDUCATION AND TRAINING TELANGANA</div>', "text/html");


            var parse = new DOMParser();
            var al = parse.parseFromString('<div id="divtop" ><span id="text-left"><label class="label-pad">College : </label>' + $scope.collegeName + '</span><span id="text-right"><label class="label-pad">Branch :</label>' + branchName + "(" + BranchCode + ")" + ' </span> </div>', "text/html");
            var parser = new DOMParser();
            var el = parser.parseFromString('<div id="divtoadd" ><span id="text-left"><label class="label-pad">Scheme : </label>' + schemename + '</span><span id="text-center"><label class="label-pad sem-pad"> Semester :</label>' +$scope.semName + "     " + '</span><span id="text-right"><label class="label-pad">Subject Code :</label>' +$scope.SubjectCode + '</span></div>', "text/html");
            var divToPrint = document.getElementById(divName);
            var temp = document.body.innerHTML;
            $("#markslist").hide();
            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            if (!$printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";
                //var $ele1 = document.createElement("div");
                //$ele1.className = "sbtet_img";             
                var divToPrintheads = bl.getElementById("divtitle");
                var divToPrintheaded = al.getElementById("divtop");
                var divToPrinthead = el.getElementById("divtoadd");
                $markstable.appendChild(divToPrintheads);
                $markstable.appendChild(divToPrintheaded);
                $markstable.appendChild(divToPrinthead);


                document.body.appendChild($printSection);

                var $ele1 = document.createElement("div");
                $ele1.className = "row";

                var $ele2 = document.createElement("div");
                $ele2.className = "col-lg-2 col-md-12";

                var $ele3 = document.createElement("div");
                $ele3.className = "col-lg-10 col-md-12";

              
                $ele1.appendChild($ele3);

                $printSection.appendChild($ele1);

                $printSection.appendChild($ele1);
                $printSection.appendChild($markstable);

            }
            $printSection.appendChild(domClone);
         
            window.print();
            document.body.removeChild($printSection);
            $("#markslist").show();
            $scope.showcollegedetail = false;

        }

        //var markslist = [];
        
            $scope.logOut = function () {
                $scope.$emit("logout", authData.userName);
                sessionStorage.loggedIn = "no";
                delete $localStorage.authorizationData;

                $scope.authentication = {
                    isAuth: false,
                    UserId: 0,
                    userName: ""
                };
                $state.go('login')
            }

            $scope.back = function () {

                $state.go('Dashboard.AssessmentDashboard.Assessment');
            }

            Schemeid = (loadedScheme == undefined || loadedScheme == '') ? $localStorage.assessment.selectedsem.current_schemeid : loadedScheme.SchemeID;
          // var subid = $localStorage.assessment.selectSubjectDetails.subid;
        var loadedScheme = '';
        var schemeStatus = AssessmentService.getSchemeStatus(); // for getting the pin and marks list 
        schemeStatus.then(function (response) {
          ;
            var SchemesList = response.Table;
            SchemesList.forEach(function (scheme) {
                if ($scope.selectedsem.Scheme === scheme.SchemeID) {
                    loadedScheme = scheme;
                    $scope.loadedScheme = scheme;
                    console.log($scope.loadedScheme);
                  //  alert(loadedScheme)
                    // $scope.loadPinAndMarks();
                }
            });

        }, function (error) {
            alert("error");
        });

  
        $scope.editDetaila = function () {
            $scope.edit = false;
            $scope.update = true;
            examCenters = [];
        }
        
        $scope.passOrfail = [{ "Id": 0, "IsPassed": "Pass" }, { "Id": 1, "IsPassed": "Fail" }];


    });
});