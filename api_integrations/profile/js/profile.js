$(document).ready(function() {
  //Initial Settings
  getNotifications("others", "showNotifications");
  getNotifications("payment", "referralNotifications");
  getNotifications("referral", "paymentNotifications");
  getTransactions();

  //logoutUser
  $('#logoutUser').click(function() {
    delete_cookie('useremail');
    delete_cookie('urole');
    delete_cookie('regcode');
    window.location.assign("http://localhost/refmoney/");
  });

  // check if user is logged in
  var getUN = getCookie("useremail");
  if (getUN === "") {
      window.location.assign("http://localhost/refmoney/pages/login");
  }

  //process invite form
  $('#inviteForm').on('submit', function(event) {
    event.preventDefault();
    $('#inviteBtn').attr('disabled', true);
    $('#inviteBtn').attr('value', "Processing...");
    var xhr = new XMLHttpRequest();
    var fullname = $('#fullname').val();
    var refmemcode = getCookie("regcode");
    var phonenumber = $('#phonenumber').val();
    var email = $('#email').val();
    var formData = JSON.stringify({
      	"email":email,
      	"refmemcode":refmemcode,
        "phonenumber":phonenumber,
        "fullname":fullname
      });
      console.log(formData);
      xhr.onreadystatechange = function() {//Call a function when the state changes.
         if(xhr.readyState === 4) {
           console.log(this.responseText);
           var response = JSON.parse(this.responseText);
           if(response["status"] === true) {
             $('#inviteFriendModal').modal('hide');
            swal("Done!", response["message"], "success");
             $('#inviteBtn').attr('Submit');
             $('#inviteBtn').attr('disabled', false);
             $('#inviteBtn').attr('value', "Submit");
             increaseActivityScore(5);
           } else {
             swal("Oops", response["message"], "warning");
             $('#inviteBtn').attr('disabled', false);
           }
         }
      }
      xhr.open("POST", "http://localhost/refmoney/api/newsub.php");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(formData);
  });

  //process form to edit profile
  $('#editForm').on('submit', function(event) {
    event.preventDefault();
    $('#editBtn').attr('disabled', true);
    $('#editBtn').attr('value', "Saving...");
    var xhr = new XMLHttpRequest();
    var editFullname = $('#editFullname').val();
    var editEmail = $('#editEmail').val();
    var editPhonenumber = $('#editPhonenumber').val();
    var editAcctnum = $('#editAcctnum').val();
    var editAddress = $('#editAddress').val();
    var editBankname = $('#editBankname').val();
    var editOccupation = $('#editOccupation').val();
    var formData = JSON.stringify({
      	"fullname": editFullname,
      	"phonenumber": editPhonenumber,
      	"acctnum": editAcctnum,
      	"mememail": editEmail,
      	"address": editAddress,
      	"occupation": editOccupation,
      	"bankname": editBankname
      });
      console.log(formData);
      xhr.onreadystatechange = function() {//Call a function when the state changes.
         if(xhr.readyState === 4) {
           console.log(this.responseText);
           var response = JSON.parse(this.responseText);
           if(response["status"] === true) {
            $('#editProfileModal').modal('hide');
            swal("Done!", response["message"], "success");
             $('#editBtn').attr('Save');
             $('#editBtn').attr('disabled', false);
             $('#editBtn').attr('value', "Save");
             getMemberInfo();
           } else {
             swal("Oops", response["message"], "warning");
             $('#editBtn').attr('disabled', false);
           }
         }
      }
      xhr.open("POST", "http://localhost/refmoney/api/editprofile.php");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(formData);
  });

  //get platinum downlines
  function getDownlines(downlineType) {
    $('#dlTitle').html(downlineType);
    $('#dlTable').html('<table id="platinumTable"><thead><tr><th>#</th><th>Full Name</th><th>Direct Upline</th><th>Second Level</th><th>Third Level</th><th>Date Reg</th></tr></thead><tbody id="tableBody'+downlineType+'"></tbody></table>');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            var recordSet = jsonObj["data"];

            for(var i in recordSet) {
              //append data to downlines table
              var serialNumber = parseInt(i) + 1;
              var downlineCode = recordSet[i]["referredcode"], downlineFC = recordSet[i]["referrercode"], downlineSC = recordSet[i]["secondcode"], downlineTC = recordSet[i]["thirdcode"];
              var downline = '<a id="viewProfile'+downlineTC+'" class="slink" href="viewprofile.php?rg='+downlineCode+'" target="_blank">'+recordSet[i]["refferedfullname"]+'</a>'; // target originally vp_iframe
              var downlineDirectUpline = '<a id="viewProfile'+downlineFC+'" class="slink" href="viewprofile.php?rg='+downlineFC+'" target="_blank">'+recordSet[i]["referrerfullname"]+'</a>';
              var downlineSecondUpline = '<a id="viewProfile'+downlineSC+'" class="slink" href="viewprofile.php?rg='+downlineSC+'" target="_blank">'+recordSet[i]["secondcodefullname"]+'</a>';
              var downLineThirdUpline = '<a id="viewProfile'+downlineTC+'" class="slink" href="viewprofile.php?rg='+downlineTC+'" target="_blank">'+recordSet[i]["thirdcodefullname"]+'</a>';
              $('#tableBody' + downlineType).append('<tr><td>' + serialNumber + '</td><td>' + downline + '</td><td>' + downlineDirectUpline + '</td><td>' + downlineSecondUpline + '</td><td>' + downLineThirdUpline + '</td><td>'+ recordSet[i]["dateadded"] +'</td></tr>');

            }

            //$('#platinumTable').dynatable();
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/downlines/?dltype=" + downlineType);
    xhr.send();
  }

  function getAllMemberInfo() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var jsonObj = JSON.parse(this.responseText);
        var status = jsonObj["status"];
        var memData = jsonObj["data"];

    	  if(status === true) {
          for(var i in memData) {
            var serialNumber = parseInt(i) + 1;
            var susBtnString = '';
            if(memData[i]["activated"] === "0") {
              susBtnString = '<button id="reAct" class="susBranchBtn'+ memData[i]["regCode"] +'" ><i class="fa fa-toggle-off"></i> Activate</button>';
            } else {
              susBtnString = '<button id="susBtn" class="susBranchBtn'+ memData[i]["regCode"] +'" ><i class="fa fa-toggle-on"></i> Suspend</button>';
            }
            var pendingString = "0";
            if (memData[i]["pendingpayment"] > 1000 ) {
              pendingString = '<a id="payMember" class="slink" href="#" target="_blank">'+memData[i]["pendingpayment"]+'</a>';
            }
            var memberFullName = '<a id="viewProfile'+memData[i]["regCode"]+'" class="slink" href="viewprofile.php?rg='+memData[i]["regCode"]+'" target="_blank">'+memData[i]["fullName"]+'</a>';
            $('#AllMembersBody').append('<tr><td><input type="hidden" class="getMemRegCode" name="getMemRegCode" value="'+memData[i]["regCode"]+'">' + serialNumber + '</td><td>' + memberFullName + '</td><td>' + memData[i]["acctnum"] + '</td><td>'+ memData[i]["bankname"]+'</td><td>' + memData[i]["walletBalance"] + '</td><td>' + memData[i]["amtReceived"] + '</td><td>'+ pendingString +'</td><td>'+susBtnString+'</td></tr>');
          }
          $('#AllMembersTable').dynatable();
        } else {

        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/meminfo/?filter=all");
    xhr.send();
  }

  // authorise payment on click
  $(document).on("click", "#payMember", function(event) {
    var tr = $(this).closest('tr');
    var regcodeActivate = tr.find('.getMemRegCode').val();
    var getMemFN = tr.find('.getMemFN').val();
      event.preventDefault();
      swal({
        title: "Confirm Payment Authorisation!",
        text: "Are you sure you want to authorise payment for this member?",
        icon: "warning",
        buttons: ["No", "Yes"]
      })
      .then(function(willActivate) {
        if (willActivate) {
          //pay member
          authorisePayment(regcodeActivate);
          $('#AllMembersBody').html('');
          location.reload(true);
        } else {

        }
      });
  });

  // treat pending request
  function authorisePayment(regCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {//Call a function when the state changes.
       if(xhr.readyState === 4 && xhr.status === 200) {
         var response = JSON.parse(this.responseText);
         var responseMsg = response["message"];
         if(response["status"] === true) {
           swal("Payment Authorised!", responseMsg, "success");
         } else {
           swal("Unable authorise payment", responseMsg, "info");
         }
       }
    }
    xhr.open("GET", "http://localhost/refmoney/api/makepayment/?memcode=" + regCode);
    xhr.send();
  }

  // activate member
  $(document).on("click", "#reAct", function(event) {
    var tr = $(this).closest('tr');
    var regcodeActivate = tr.find('.getMemRegCode').val();
    var getTheClass = $(this).attr('class');
      event.preventDefault();
      $('.' + getTheClass).attr('disabled', true);
      $('.' + getTheClass).html('<i class="fa fa-gear fa-spin"> </i> ');
      var xhr = new XMLHttpRequest();
      swal({
        title: "Confirm Member Activation!",
        text: "Are you sure you want to activate this member?",
        icon: "warning",
        buttons: ["No", "Yes"]
      })
      .then(function(willActivate) {
        if (willActivate) {
          xhr.onreadystatechange = function() {//Call a function when the state changes.
             if(xhr.readyState === 4 && xhr.status === 200) {
               var response = JSON.parse(this.responseText);
               var responseMsg = response["message"];
               if(response["status"] === true) {
                 swal("Done!", responseMsg, "success");
                 $('.' + getTheClass).html('<i class="fa fa-toggle-on"></i> Suspend ');
                 $('.' + getTheClass).attr('id', 'susBtn');
                 $('.' + getTheClass).attr('disabled', false);
               } else {
                 swal("Unable to Activate", responseMsg, "info");
                 $('#reAct').attr('disabled', false);
               }
             }
          }
          xhr.open("GET", "http://localhost/refmoney/api/activate/?regcode=" + regcodeActivate);
          xhr.send();
        } else {
          $('.' + getTheClass).html('<i class="fa fa-toggle-off"></i> Activate ');
          $('.' + getTheClass).attr('id', 'reAct');
          $('.' + getTheClass).attr('disabled', false);
        }
      });
  });

  // Deactivate Member
  $(document).on("click", "#susBtn", function(event) {
    var tr = $(this).closest('tr');
    var regcodeActivate = tr.find('.getMemRegCode').val();
    var getTheClass = $(this).attr('class');
    $('.' + getTheClass).attr('disabled', true);
    $('.' + getTheClass).html('<i class="fa fa-gear fa-spin"> </i> ');
    var xhr = new XMLHttpRequest();
    swal({
        title: "Confirm Member Deactivation!",
        text: "Are you sure you want to de-activate memebr?",
        icon: "warning",
        buttons: ["No", "Yes"]
      })
      .then(function(willSuspend) {
        if (willSuspend) {
          xhr.onreadystatechange = function() {//Call a function when the state changes.
             if(xhr.readyState === 4 && xhr.status === 200) {
               var response = JSON.parse(this.responseText); var responseMsg = response["message"];
               if(response["status"] === true) {
                 swal("Done!", responseMsg, "success");
                 $('.' + getTheClass).html('<i class="fa fa-toggle-off"></i> Activate ');
                 $('.' + getTheClass).attr('id', 'reAct');
                 $('.' + getTheClass).attr('disabled', false);
               } else {
                 swal("Unable to suspend", responseMsg, "info");
                 $('#susBtn').attr('disabled', false);
               }
             }
          }
          xhr.open("GET", "http://localhost/refmoney/api/deactivate/?regcode=" + regcodeActivate);
          xhr.send();
        } else {
          $('.' + getTheClass).html('<i class="fa fa-toggle-on"></i> Suspend ');
          $('.' + getTheClass).attr('id', 'susBtn');
          $('.' + getTheClass).attr('disabled', false);
        }
      });

  });

  $('#showNotifications').click(function() {
    getNotifications("others", "showNotifications");
    $('#notModal').modal('show');
    changeReadStatus("others", "showNotifications");
  });

  $('#referralNotifications').click(function() {
    getNotifications("referral", "referralNotifications");
    $('#notModal').modal('show');
    changeReadStatus("referral", "referralNotifications");
  });

  $('#paymentNotifications').click(function() {
    getNotifications("payment", "paymentNotifications");
    $('#notModal').modal('show');
    changeReadStatus("payment", "paymentNotifications");
  });

  $('#memCodeLink').click(function() {
    var memRefCode = $('#memCode').html();
    $('#hiddenRefLink').html("REFERRAL LINK: https://pruners.com/pages/register/?refcode=" + memRefCode + "<br/>" + " FULL SITE: https://pruners.com/?refcode=" + memRefCode);
    $('#hiddenRefLink').hide();
    swal({
        title: "Referral Link",
        text: "REFERRAL LINK: https://pruners.com/pages/register/?refcode=" + memRefCode,
        icon: "info",
        buttons: ["Close", "Copy Link"]
      })
      .then(function(willCopy) {
        if (willCopy) {

          copyToClipboard('#hiddenRefLink');
          swal("Done", "Link Copied. Paste to social media and other online platform while convincing people to join", "success");
        } else {
          //swal("Referral Link", "https://pruners.com/?refcode=", "info");
        }
      });

  });



  $('#transactionsIcon').click(function() {
    $('#transModal').modal('show');
    changeTransReadStatus();
    //changeReadStatus("payment", "paymentNotifications");
  });

  function getNotifications(notifType, notIcon) {
    $('#notList').html('');
    $('#notifHeading').html(notifType);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            var recordSet = jsonObj["data"];
            var readCount = 0;
            for(var i in recordSet) {
              //append data to Notifications List
              if(recordSet[i]["isread"] == 1) {
                readCount++;
              }
              $('#notList').append('<li id="list'+recordSet[i]["notID"]+'"><p>'+recordSet[i]["message"]+'</p><small class="smallText">'+recordSet[i]["dateadded"]+'</small><hr class="greyRule"></li>');
            }
            if(readCount > 0) {
              $('#' + notIcon).css('color', '#fff883');
            } else {
              $('#' + notIcon).css('color', '#ffffff');
            }
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/notifications/?notiftype=" + notifType);
    xhr.send();
  }

  function getTransactions() {
    $('#transBody').html('');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            var recordSet = jsonObj["data"];
            var readCount = 0;
            for(var i in recordSet) {
              //append data to Notifications List
              var transactionType = "Request";
              if(recordSet[i]["transtype"] == 1) {
                transactionType = "Payment";
              } else if (recordSet[i]["transtype"] == 2) {
                transactionType = "Registeration";
              }
              if(recordSet[i]["isread"] == 1) {
                readCount++;
              }
              $('#transBody').append('<tr><td>'+(parseInt(i)+1)+'</td><td>'+recordSet[i]["transcode"]+'</td><td>'+transactionType+'</td><td>'+recordSet[i]["amount"]+'</td><td>'+recordSet[i]["transdate"]+'</td></tr>');
            }
            if(readCount > 0) {
              $('#transactionsIcon').css('color', '#fff883');
            } else {
              $('#transactionsIcon').css('color', '#ffffff');
            }
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/transactions");
    xhr.send();
  }


  function changeReadStatus(notifTpye, notIcon) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            $('#' + notIcon).css('color', '#ffffff');
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/confirmread/?notiftype=" + notifTpye);
    xhr.send();
  }

  function getSiteStat() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            $('#totalMemCount').html(jsonObj["totalMembers"]);
            $('#moneyInOut').html("₦"+jsonObj["totalMoneyIn"] + " / ₦" + jsonObj["totalMoneyOut"]);
            var potientialEarnings = parseInt(jsonObj["totalMoneyIn"]) - (parseInt(jsonObj["totalMembersBalance"]) + parseInt(jsonObj["totalPendingPayment"]));
            var worstCaseEarning = jsonObj["totalMembers"] * 2000;
            $('#potentialWorstCase').html("₦"+potientialEarnings + " / ₦" + worstCaseEarning);
            $('#balanceAndPending').html("₦"+jsonObj["totalMembersBalance"] + " / ₦" + jsonObj["totalPendingPayment"]);
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/sitestat/");
    xhr.send();
  }

  // change read status
  function changeTransReadStatus() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {
            $('#transactionsIcon').css('color', '#ffffff');
        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/readtrans");
    xhr.send();
  }

  //function to increase activity score
  function increaseActivityScore(score) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {

        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/increaseactivityscore/?score=" + score);
    xhr.send();
  }

  // determine whether to display signed-in user data or other member basic data
  var ur = window.location.pathname;
  if (ur.includes("viewprofile")) {
    regCode = getUrlParameter('rg');
    viewOtherMember(regCode);
  } else if (ur.includes("admin")){
    getAllMemberInfo();
    getSiteStat();
  } else {
    getMemberInfo();
  }

  function clearTableBody() {
    $('#tableBodyplatinum').html('');
  }

  $('#pdl').mousedown(function() {
    clearTableBody();
    getDownlines("platinum");
  });

  $('#ddl').mousedown(function() {
    clearTableBody();
    getDownlines("diamond");
  });

  $('#rdl').mousedown(function() {
    clearTableBody();
    getDownlines("ruby");
  });


  function getMemberInfo() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var jsonObj = JSON.parse(this.responseText);
        var status = jsonObj["status"];
        var memData = jsonObj["data"];

    	  if(status === true) {
          var activityBonus = 0;
          var activityScore = memData["activityScore"];
          if(activityScore >= 10) {
            activityBonus = activityScore / 10;
          }

          $('#dlTotal').html(memData["totalRefs"]);
          $('#ddTotal').html(memData["totalPlatRefs"]);
          $('#slTotal').html(memData["totalDiaRefs"]);
          $('#tlTotal').html(memData["totalRubyRefs"]);
          $('#totalBalance').html(memData["walletBalance"]); $('#totalBalance2').html(memData["walletBalance"]);
          $('#amountReceived').html(memData["amtReceived"]); $('#amountReceived2').html(memData["amtReceived"]);
          $('#pendingApproval').html(memData["pendingpayment"]);
          $('#earningsBalance').html(parseInt(memData["platBalance"]) + parseInt(memData["diaBalance"]) + parseInt(memData["rubyBalance"]));
          $('#firstBalance').html(memData["platBalance"]);
          $('#secondBalance').html(memData["diaBalance"]);
          $('#thirdBalance').html(memData["rubyBalance"]);
          $('#fullName').html(memData["fullName"]);  $('#editFullname').attr("value", memData["fullName"]);
          $('#memAddress').html(memData["memAddress"]); $('#editEmail').attr("value", memData["memEmail"]);
          $('#memEmail').html(memData["memEmail"]); $('#editPhonenumber').attr("value", memData["phoneNumber"]);
          $('#memPhone').html(memData["phoneNumber"]); $('#editAcctnum').attr("value", memData["acctnum"]);
          $('#memWork').html(activityBonus); $('#editAddress').attr("value", memData["memAddress"]);
          $('#memCode').html(memData["regCode"]); $('#editOccupation').attr("value", memData["occupation"]);
          $('#memRegDate').html(memData["dateReg"]); $('#editBankname').attr("value", memData["bankname"]);
        } else {

        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/meminfo/");
    xhr.send();
  }


  // Cashout Earnings
  $('#withDrawBalance').click(function() {
    swal("Initiating Request...", {
     buttons: false,
     timer: 4000
   });
   getMemberInfo();
   var reqAmt = $("#totalBalance").html();
   var reqAmount = parseInt(reqAmt); console.log(reqAmount);
   var postData = JSON.stringify({"reqamount": reqAmount});
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          if(response["status"] === true) {
          swal("Request completed!", response["message"], "success");
        } else {
          swal("Oops!", response["message"], "error");
        }
      }
    }
    xhr.open("POST", "http://localhost/refmoney/api/requestpayment.php" );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(postData);
  });

  function viewOtherMember(regCode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var jsonObj = JSON.parse(this.responseText);
        var status = jsonObj["status"];
        var memData = jsonObj["data"];

    	  if(status === true) {
          $('#fullNamev').html(memData["fullName"]);
          $('#memAddressv').html(memData["memAddress"]);
          $('#memEmailv').html(memData["memEmail"]);
          $('#memPhonev').html(memData["phoneNumber"]);
          $('#memWorkv').html(memData["occupation"]);
          $('#memCodev').html(memData["regCode"]);
          $('#memRegDatev').html(memData["dateReg"]);
        } else {

        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/viewmember/?regcode=" + regCode);
    xhr.send();
  }
});
