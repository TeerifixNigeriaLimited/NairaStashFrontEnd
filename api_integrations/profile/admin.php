<!DOCTYPE html>
<html>
<head>
<title>Personal Card Widget Flat Responsive Widget Template :: w3layouts</title>
<!-- custom-theme -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="Personal Card Widget Responsive web template, Bootstrap Web Templates, Flat Web Templates, Android Compatible web template,
Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design" />
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
		function hideURLbar(){ window.scrollTo(0,1); } </script>
<!-- //custom-theme -->
<link href="css/style.css" rel="stylesheet" type="text/css" media="all" />
<link href="css/dynatable.css" rel="stylesheet" type="text/css" media="all" />
<link href="../../assets/fa/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all" />
<!-- js -->
<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
<!-- //js -->
<link rel="stylesheet" href="css/flexslider.css" type="text/css" media="screen" property="" />
<link href="//fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i&amp;subset=latin-ext" rel="stylesheet">
</head>
<body>
	<div class="main">
		<div class="social-w3lsicon">
			<h1 id="adminPanelTitle">ADMIN PANEL</h1>
		</div>
		<div class="full_width">

			<div class="w3_agileits_personal_card_grid">

        <div class="w3_main_grid_right_gridr">
          <a href="" id="logoutUser" class="slink"><i class="fa fa-sign-out"></i> Logout</a> <span class="pipe">|</span> <a href="#" data-toggle="modal" data-target="#editProfileModal" class="slink"><i class="fa fa-pencil"></i> Pending Payments</a> <span class="pipe">|</span> <a href="#" data-toggle="modal" data-target="#inviteFriendModal" class="slink"><i class="fa fa-users"></i> Invited People </a>
        </div><br>
				<div class="row">
					<div class="col-md-4">
						<p>Total Money In / Out: <span id="moneyInOut"></span></p>
					</div>
					<div class="col-md-4">
						<p>Total Balance / Pending Payment: <span id="balanceAndPending"></span></p>
					</div>
					<div class="col-md-4">
						<h2>Potential Profit / Worst Case Scenario: <span id="potentialWorstCase"></span></h2>
					</div>
				</div>
				<div class="wthree_personal_card_gridr">

				</div>
				<div class="clear"> </div><br>

				<div class="agileits_plans">
					<h3>All Members(<span id="totalMemCount"></span>)</h3>
          <table id="AllMembersTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Acct Num</th>
                <th>Bank Name</th>
                <th>Balance (₦)</th>
                <th>Received (₦)</th>
                <th>Pending (₦)</th>
                <th>Action</th>
              </tr>
             </thead>
             <tbody id="AllMembersBody">
            </tbody>
          </table>

					<br>
				</div>
			</div>



			<div class="clear"> </div>
		</div>
		<div class="agileits_copyright">
			<p>© 2017 Personal Card Widget. All rights reserved | Design by <a href="http://w3layouts.com/">W3layouts</a></p>
		</div>
	</div>

	<!-- Modal for friend invite -->
	<div class="modal fade" id="inviteFriendModal" tabindex="-1" role="dialog" >
		<div class="modal-dialog">
		<!-- Modal content-->
			<div class="modal-content">
				<button type="button" class="close" id="modalClose" data-dismiss="modal" style="float: right">&times;</button>
				<div class="modal-header">
					<div class="signin-form profile">
						<h4><i class="fa fa-user-plus"></i> Invite A Friend</h4>
						<div class="login-form">
							<form method="post" id="inviteForm" name="inviteForm">
								<input type="text" id="fullname" name="fullname" placeholder="Full name" required="">
								<input type="email" id="email" name="email" placeholder="E-mail address" required="">
								<input type="text" id="phonenumber" name="phonenumber" placeholder="Phone number" required="">
								<input type="submit" id="inviteBtn" value="Submit">
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /modal for friend invite -->


	<!-- Modal for editing profile -->
	<div class="modal fade" id="editProfileModal" tabindex="-1" role="dialog" >
		<div class="modal-dialog">
		<!-- Modal content-->
			<div class="modal-content">
				<button type="button" class="close" id="modalClose" data-dismiss="modal" style="float: right">&times;</button>
				<div class="modal-header">
					<div class="signin-form profile">
						<h4><i class="fa fa-pencil"></i> Edit Profile</h4>
						<div class="login-form">
							<form method="post" id="editForm" name="editForm">
								<label>Full Name</label>
								<input type="text" id="editFullname" name="editFullname" required="">
								<label>Email Address</label>
								<input type="email" id="editEmail" name="editEmail" required="">
								<label>Phone Number</label>
								<input type="text" id="editPhonenumber" name="phonenumber" required="">
								<label>Account Number</label>
								<input type="text" id="editAcctnum" name="editAcctnum" required="">
								<label>Current Address</label>
								<input type="text" id="editAddress" name="editAddress" required="">
								<label>Occupation</label>
								<input type="text" id="editOccupation" name="editOccupation" required="">
								<label>Bank Name</label>
								<input type="text" id="editBankname" name="editBankname" placeholder="Phone number" required="">
								<input type="submit" id="editBtn" value="Save">
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /modal for editing profile -->


	<script src="../../js/jquery-2.1.4.min.js"></script>
	<script src="../../js/sweetalerts.min.js"></script>
	<script src="../../js/functions.js"></script>
	<script src="js/dynatable.js"></script>
	<script src="js/profile.js"></script>
	<script type="text/javascript" src="js/bootstrap.js"></script><!-- bootstrap js file -->


</body>
</html>
