<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Brain Lab Prototype</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="bootstrap/css/bootstrap.css" rel="stylesheet" media="screen">
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="bootstrap/js/bootstrap.min.js"></script>
	</head>
	<body style="text-align: center">
		<div class="navbar">
			<div class="navbar-inner">
				<div class="container">
					<!-- .btn-navbar is used as the toggle for collapsed navbar content -->
					<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</a>
	 
					<!-- Be sure to leave the brand out there if you want it shown -->
					<a class="brand" href="#">Brainlab</a>
					<ul class="nav">
						<li class="active"><a href="#">Home</a></li>
						<li><a href="#">Reports</a></li>
						<li><a href="#">Upload</a></li>
						<li><a href="#">Settings</a></li>
					</ul>
	 
					<!-- Everything you want hidden at 940px or less, place within here -->
					<div class="nav-collapse collapse">
					<!-- .nav, .navbar-search, .navbar-form, etc -->
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
			<div class="span1">span1</div>
		</div>
		<div class="row">
			<div class="span2 offset3">span2 offset3</div>
			<div class="span2 offset3">span2 offset3</div>
			<div class="span2">span2</div>
		</div>	
		<div class="row">
			<div class="span8">
				<table class="table table-striped">
					<tr class="success">
						<td>Alex</td>
						<td>Weekly</td>
						<td>10 Hours</td>
						<td>Approved</td>
					</tr>
					<tr class="error">
						<td>Edson</td>
						<td>Monthly</td>
						<td>8 Hours</td>
						<td>Declined</td>
					</tr>
					<tr class="warning">
						<td>Katie</td>
						<td>Weekly</td>
						<td>12 Hours</td>
						<td>Pending</td>
					</tr>
				</table>
			</div>
			<div class="span4">
				<form>
					<fieldset>
						<legend>Team Epic!</legend>
						<label>Add Teammember</label>
							<input type="text" placeholder="New member's name...">
							<span class="help-block">Alphanumerical Characters Only</span>
							<label class="checkbox">
							<input type="checkbox">Restricted Access
						</label>
						<button type="submit" class="btn">Submit</button>
					</fieldset>
				</form>
			</div>
		</div>
	</body>
</html>