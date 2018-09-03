$(document).ready(function() {

  //process login form
  $('#loginForm').on('submit', function(event) {
    event.preventDefault();
    $('#loginBtn').attr('disabled', true);
    $('#loginBtn').attr('value', "Processing...");
    var xhr = new XMLHttpRequest();
    var email = $('#email').val();
    var password = $('#password').val();
    var formData = JSON.stringify({
      	"email":email,
      	"password":password
      });
      console.log(formData);
      xhr.onreadystatechange = function() {//Call a function when the state changes.
         if(xhr.readyState === 4) {
           console.log(this.responseText);
           var response = JSON.parse(this.responseText);
           var responseMsg = response["message"];
           var regcode = response["regcode"];
           var useremail = response["email"];
           var urole = response["urole"];
           if(response["status"] === true) {
             swal("Login Successful! Reloading...", {
              buttons: false
            });
             $('#loginBtn').attr('Submit');
             $('#loginBtn').attr('disabled', false);
             $('#loginBtn').attr('value', "Submit");
             setCookie('useremail', useremail, 3);
             setCookie('regcode', regcode, 3);
             setCookie('urole', urole, 3);
             var getUserRole = getCookie("urole");
             if(getUserRole === "4") {
               window.location.assign("http://localhost/refmoney/pages/profile/admin.php");
             } else {
               window.location.assign("http://localhost/refmoney/pages/profile");
             }
             //location.reload(true);
           } else {
             if(responseMsg == "Your account is not activated yet") {
               swal({
                   title: "Unable to login",
                   text: "Your account is not activated yet. Please make payment using any of the options below",
                   icon: "warning",
                   buttons: ["Bank Transfer", "Online Payment"]
                 })
                 .then(function(willPay) {
                   if (willPay) {
                     payWithPaystack(email);

                   } else {
                     $('#registerBtn').attr('Submit');
                     $('#registerBtn').attr('disabled', false);
                     $('#registerBtn').attr('value', "Submit");
                     swal("Mobile Transfer", "Transfer the sum of #5000 to the GTB Account 0162695800. Your account will be activate once we confirm payment", "info");
                   }
                 });
             } else {
               swal("Unable to login", responseMsg, "warning");
             }
             $('#loginBtn').attr('disabled', false);
             $('#loginBtn').attr('value', "Submit");
           }
         }
      }
      xhr.open("POST", "http://localhost/refmoney/api/login.php");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(formData);
  });

  //process password recovery form
  $('#prForm').on('submit', function(event) {
    event.preventDefault();
    $('#prBtn').attr('disabled', true);
    $('#prBtn').attr('value', "Processing...");
    var xhr = new XMLHttpRequest();
    var newpassword = $('#newpassword').val();
    var conpassword = $('#conpassword').val();
    var token = getUrlParameter('prltoken');

    if(newpassword !== conpassword) {
      swal("Mismatched Passwords", "Passwords must be the same", "warning");
      $('#prBtn').attr('value', "Update");
      $('#prBtn').attr('disabled', false);
    } else {
        xhr.onreadystatechange = function() {//Call a function when the state changes.
           if(xhr.readyState === 4) {

             var response = JSON.parse(this.responseText);
             var responseMsg = response["message"];

             if(response["status"] === true) {

                 swal({
                     title: "Done!",
                     text: responseMsg,
                     icon: "success",
                     buttons: ["Close", "Login"]
                   })
                   .then(function(login) {
                     if (login) {
                       window.location.assign("http://localhost/refmoney/pages/login");
                     } else {
                       $('#prBtn').attr('value', "Update");
                       $('#prBtn').attr('disabled', false);
                     }
                   });

               $('#prBtn').attr('value', "Update");
             } else {
               $('#prBtn').attr('disabled', false);
               $('#prBtn').attr('value', "Update");
               swal("Unable to reset Password", responseMsg, "error");
             }
           }
        }
        xhr.open("GET", "http://localhost/refmoney/api/passwordreset/?actiontype=resetpwd&newpassword=" + newpassword + "&prltoken=" + token);
        xhr.send();
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

  $('#forgotPassword').click(function() {
    swal({
      text: 'Please provide the email you registered to get a password reset link',
      content: "input",
      button: {
        text: "Submit",
        closeModal: true,
      },
    })
    .then(function(name) {
      if (!name) throw null;

      return fetch(`http://localhost/refmoney/api/passwordreset/?prlemail=${name}&actiontype=sendlink`);
    })
    .then(function(results) {
      return results.json();
    })
    .then(function(json) {
      const prlData = json.message;

      if (json.status == false) {
        return swal("Unable to send link", json.message, "info");
      } else {
        return swal("Password reset link sent", json.message, "success");
      }


    })
    .catch(function(err) {
      if (err) {
        swal("Oh noes!", "We were unable to send a link to that email!", "error");
      } else {
        swal.stopLoading();
        swal.close();
      }
    });
  });

  // check if user is logged in
  var getUN = getCookie("useremail");
  if (getUN !== "") {
      window.location.assign("http://localhost/refmoney/pages/profile");
  }

});
