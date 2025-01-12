﻿define(['app'], function (app) {
    app.controller("PracticalSummaryController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, MenuService, AssessmentService, MarksEntryService) {

        var authData = $localStorage.authorizationData;
        $scope.userName = authData.userName;
        AppSettings.userName = authData.userName;
        var BranchCode = authData.userName;
        AppSettings.LoggedUserId = authData.SysUserID;
        AppSettings.CollegeID = authData.CollegeID;
        $scope.CollegeID = authData.CollegeID;
        $scope.College_Code = authData.College_Code;
        $scope.College_Name = authData.College_Name;
        $scope.StudentTypeId = $localStorage.assessment.StudentTypeId
        $scope.BranchId = authData.BranchId;
        $scope.showcollegedetail = false;
        $scope.subjectDetailsView = false;
        $scope.LoadImgForPinList = false;
        $scope.studentsNotFound = false;
        $scope.printDisable = true;
        $scope.submitHide = false;
        var selectScheme = $localStorage.assessment.Scheme;
        $scope.AcademicYearsActiveResponse = $localStorage.assessment.AcademicYearsActiveResponse;
    //   var BranchId = $localStorage.authorizationData.BranchId
        $scope.selectedsem = $localStorage.assessment.selectedsem;
        $scope.branch = $localStorage.assessment.branchName;
        var examtype = $localStorage.assessment.entryList;
        var branchName = $localStorage.assessment.branchName;
        $scope.subjectCode = $localStorage.assessment.selectSubjectDetails.Subject_Code;
        var SubjectCode = $localStorage.assessment.selectSubjectDetails.Subject_Code;
        var AcademicId = $localStorage.assessment.AcademicYearsActiveResponse.AcademicID;
        var semId = $scope.selectedsem;
        var examId = $localStorage.assessment.entryListid;
        $scope.ExamMonthYear = $localStorage.assessment.ExamMonthYear;
        var semName = $localStorage.assessment.selectedsem.sem;
        var collegeName = authData.College_Name;
        $scope.SchemeId = $localStorage.assessment.SchemeId;
        $scope.scheme = $localStorage.assessment.Scheme;

        var loadedScheme = '';
        var schemeStatus = AssessmentService.getSchemeStatus(); // for getting the pin and marks list 
        schemeStatus.then(function (response) {
            var SchemesList = response.Table;
            SchemesList.forEach(function (scheme) {
                if ($scope.schemeId === scheme.SchemeID) {
                  
               
                    $scope.loadedScheme = scheme.Scheme;
                    // $scope.loadPinAndMarks();
                }
            });

        }, function (error) {
            alert("error");
        });

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        var markslist = [];
        var previewlist = [];
        var NEMarksList = [];
     //   $scope.loadPinAndMarks = function () {
            markslist = [];
            previewlist = [];
            NEMarksList = [];
            $scope.subjectDetailsView = false;
            $scope.LoadImgForPinList = true;
            var Scheme = {};
            $scope.MaxMarks ="";
            Schemeid = (loadedScheme == undefined || loadedScheme == '') ? $localStorage.assessment.Scheme : loadedScheme.SchemeID;
            
        var subid = $localStorage.assessment.selectSubjectDetails.subid;
        //console.log($scope.AcademicYearsActiveResponse.AcademicID, $scope.SchemeId, $localStorage.authorizationData.College_Code, $scope.selectedsem, $scope.BranchId, subid, examId, $scope.StudentTypeId)
        var subjectPinList = MarksEntryService.getReportSubjectPinList($scope.AcademicYearsActiveResponse.AcademicID, $scope.SchemeId, $localStorage.authorizationData.College_Code, $scope.selectedsem.semid, $scope.BranchId, subid, examId, $scope.StudentTypeId, $scope.ExamMonthYear);
             subjectPinList.then(function (response) {
                 if (response.Table.length > 0) {
                  
                     $scope.subjectDetailsView = true;
                     //var marksIdList = response
                     $scope.studentsNotFound = false;
                     $scope.LoadImgForPinList = false;
                     $scope.pinWise = response.Table;
                     NEMarksList = response;
                     $scope.SubjectName = response.Table1[0].SubjectName;
                     $scope.MaxMarks = response.Table1[0].maxmarks;
                     $scope.IndustryName = response.Table1[0].IndustryName;
                     response.Table.forEach(function (stud) {
                         if (stud.marks != null) {
                             previewlist.push(stud);
                         }
                     });

                     if (previewlist.length == $scope.pinWise.length) {

                         $scope.submitHide = true;
                     } else {
                         $scope.submitHide = false;
                     }
                 }
             }, function (error) {
                 $scope.pinWise = [];
                 $scope.subjectDetailsView = false;
                 $scope.studentsNotFound = true;
                 $scope.LoadImgForPinList = false;
                 let err = JSON.parse(error)
                 console.log(err);

             });

      //  }

        $scope.getExamStatus = function (exam) {
            $scope.examName = exam;
            $scope.homeDashBoard = false;
        }


        $scope.OpenDashboard = function () {
            $scope.homeDashBoard = true;
            $state.go("Dashboard");
        }

        var tempId = [];

        $scope.addData = function (id, marks) {
            return {
                id: id,
                marks: marks,
            };
        },

    


       
        $scope.back = function () {
            $state.go("Dashboard.AssessmentDashboard.Reports");
        }

      
        $scope.printMarksEntered = function () {

            var divName = "idtoDivPrint";
            var $markstable = document.createElement("div");
            $markstable.innerHTML = '';
            $markstable.className = "table";

            var parsent = new DOMParser();
            var bl = parsent.parseFromString('<div id="divtitle">STATE BOARD OF TECHNICAL EDUCATION AND TRAINING TELANGANA</div>', "text/html");


            var parse = new DOMParser();
            var al = parse.parseFromString('<div id="divtop" ><span id="text-left"><label class="label-pad">College : </label>' + collegeName + '</span><span id="text-right"><label class="label-pad">Branch :</label>' + branchName + "(" + BranchCode + ")" + ' </span> </div>', "text/html");
            var parser = new DOMParser();
            var el = parser.parseFromString('<div id="divtoadd" ><span id="text-left"><label class="label-pad">Scheme : </label>' + selectScheme + '</span><span id="text-center"><label class="label-pad sem-pad"> Semister :</label>' + semName + "     " + '</span><span id="text-right"><label class="label-pad">Subject Code :</label>' + SubjectCode + '</span></div>', "text/html");
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

                //var $titlelogo = document.createElement("div");               
                //$titlelogo.className = "sbtet_img";

                // var $img = document.createElement("img");
                // $img.src = "../../../contents/img/big-logo.png";
                // $img.className = "image";

                //var $titlelabel = document.createElement("div");
                //$titlelabel.className = "logo-name";

                //var $title = document.createElement("h2");
                //$title.innerHTML = "STATE BOARD OF TECHNICAL EDUCATION AND TRAINING TELANGANA";
                //$titlelabel.className = "title-label";

                //$titlelabel.appendChild($title);
                //  $titlelogo.appendChild($img);

                // $ele2.appendChild($titlelogo);
                //$ele3.appendChild($titlelabel);

                //  $ele1.appendChild($ele2);
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

        $scope.preview = function () {
            $scope.marksTypeTitle = 'Theory marks Entry List';
            $scope.previewList = previewlist;
            $scope.modalInstance = $uibModal.open({
                templateUrl: "/app/views/Assessment/PreviewPopup.html",
                size: 'lg',
                scope: $scope,
                windowClass: 'modal-fit',
            });

        }

   

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


    });
});