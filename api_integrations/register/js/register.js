$(document).ready(function() {

  //initial settings
  var ur = window.location.href;
  console.log(ur);
  var getRefCode = getCookie("refcode");
	var msg = getRefCode + "from cookie";
	console.log(msg);
  var firstcode = "";
  // check if there is a referral code in cookie
  var msg2 = getUrlParameter('refcode') + " from url";
  console.log(msg2);
  if (getRefCode == "") {
    if(ur.includes("refcode")) {
      $('#rcLabel').css('display', 'none');
      $('#firstcode').hide();
      $('#firstcode').attr('required', false);
      firstcode = getUrlParameter('refcode');
      console.log(firstcode + " from url");
      increaseActivityScore(3, firstcode);
    } else {
      $('#rcLabel').css('display', 'block');
      $('#firstcode').show();
      // store reg code of last registered member into cookie
    }

  } else {
    $('#rcLabel').css('display', 'none');
    $('#firstcode').hide();
    $('#firstcode').attr('required', false);
    firstcode = getRefCode;
    console.log(firstcode + " from cookie");
  }

  //function to increase activity score
  function increaseActivityScore(score, refcode) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jsonObj = JSON.parse(this.responseText);
          if(jsonObj["status"] === true) {

        }
      }
    }
    xhr.open("GET", "http://localhost/refmoney/api/increaseactivityscore/?score=" + score + "&refcode=" + refcode);
    xhr.send();
  }

  //process registeration form
  $('#registerForm').on('submit', function(event) {
    event.preventDefault();
    $('#registerBtn').attr('disabled', true);
    $('#registerBtn').attr('value', "Processing...");
    var xhr = new XMLHttpRequest();
    var fullname = $('#fullname').val();
    var phonenumber = $('#phonenumber').val();
    var acctnum = $('#acctnum').val();
    var password = $('#password').val();
    var mememail = $('#mememail').val();
    var address = $('#address').val();
    var rcode = "";
    if (firstcode == "") {
      rcode = $('#firstcode').val();
    } else {
      rcode = firstcode;
    }
    console.log(rcode);
    var occupation = $('#occupation').val();
    var bankname = $('#bankname').val();
    var conpassword = $('#conpassword').val();
    if(password !== conpassword) {
      swal("Password Mismatch", "Please Check Passwords", "warning");
      $('#registerBtn').html('<i class="fa fa-plus"></i> Submit');
      $('#registerBtn').attr('disabled', false);
    } else {
      var formData = JSON.stringify({
        	"fullname":fullname,
        	"phonenumber":phonenumber,
        	"acctnum":acctnum,
        	"password":password,
        	"mememail":mememail,
        	"address":address,
        	"firstcode":rcode,
        	"occupation":occupation,
        	"bankname":bankname
        });
        console.log(formData);
        xhr.onreadystatechange = function() {//Call a function when the state changes.
           if(xhr.readyState === 4) {
             console.log(this.responseText);
             var response = JSON.parse(this.responseText);
             var responseMsg = response["message"];
             if(response["status"] === true) {
               swal({
                   title: "Payment Method",
                   text: responseMsg,
                   icon: "info",
                   buttons: ["Bank Transfer", "Online Payment"]
                 })
                 .then(function(willPay) {
                   if (willPay) {
                     payWithPaystack(mememail);

                   } else {
                     $('#registerBtn').attr('Submit');
                     $('#registerBtn').attr('disabled', false);
                     $('#registerBtn').attr('value', "Submit");
                     swal("Mobile Transfer", "Transfer the sum of #5000 to the GTB Account 0162695800 using the bank account you registered with. Your account will be activate once we confirm payment", "info");
                   }
                 });
             } else {
               swal("Error registering", responseMsg, "warning");
               $('#registerBtn').attr('disabled', false);
             }
           }
        }
        xhr.open("POST", "http://localhost/refmoney/api/register.php");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(formData);
    }
  });


  //Pay With Paystack
  function payWithPaystack(mememail){
    swal("Please wait while payment page loads...", {
     buttons: false,
     timer: 3000
    });

    var handler = PaystackPop.setup({
        key: 'pk_test_b709d99c725f4cb1b4c48714e229da96b4049d7b',
        email: mememail,
        amount: 500000,
        ref: 'PE_REG_FEE' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response) {
            /* swal("Please wait while we get response from paystack", {
             buttons: false,
             timer: 4000
           }); */
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    var a = JSON.parse(this.responseText);
                    if (a.status == "success") {
                        var xhr = new XMLHttpRequest();
                        xhr.withCredentials = false;
                        xhr.addEventListener("readystatechange", function() {
                            if (this.readyState === 4) {
                                var a = JSON.parse(this.responseText);
                                if (a.status == true) {
                                    swal("Account Activated!", a.message, "success");
                                } else {
                                  swal("Account Activation Failed", a.message, "error");
                                }
                            }
                        });

                        xhr.open("GET", "http://localhost/refmoney/api/logpayment/?mememail=" + mememail + "&refcode=" + response.reference);
                        xhr.send(data);
                    } else {
                      swal("Payment completed!", "Your account will be activated within 24 hours.", "success");
                    }
                }
            });

            xhr.open("GET", "https://api.paystack.co/transaction/verify/" + response.reference);
            xhr.setRequestHeader("authorization",
                "Bearer sk_test_2eaaaa729732c9010c8105a5cbacf7800041a3a7");
            xhr.send();
        },
        onClose: function() {

        }
    });
    handler.openIframe();
  }


  // check if user is logged in
  var getUN = getCookie("useremail");
  if (getUN !== "") {
      window.location.assign("http://localhost/refmoney/pages/profile");
  }

});
