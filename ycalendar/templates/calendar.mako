<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->
<head>

	<!-- Basic Page Needs
  ================================================== -->
	<meta charset="utf-8">
	<title>Our Calendar</title>
	<meta name="description" content="Keep it a secret....">
	<meta name="author" content="Kay Z.">

	<!-- Mobile Specific Metas
  ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- CSS
  ================================================== -->
	<link rel="stylesheet" href="static/stylesheets/base.css">
	<link rel="stylesheet" href="static/stylesheets/skeleton.css">
	<link rel="stylesheet" href="static/stylesheets/layout.css">
	<link rel="stylesheet" href="static/stylesheets/opentip.css">

	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

    <script src="static/js/moment.js"></script>
    <script src="static/js/jquery-1.8.2.js"></script>
    <script src="static/js/opentip.js"></script>
    <script src="static/js/adapter.jquery.js"></script>
    <script src="static/js/calendar.js"></script>

	<!-- Favicons
	================================================== -->
    <!-- <link rel="shortcut icon" href="images/calendar.png"> -->
    <!-- 
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png">
    -->
</head>

<body>

	<!-- Primary Page Layout
	================================================== -->

	<!-- Delete everything in this .container and get started on your own site! -->

	<div class="container">

		<div class="sixteen columns">
			<h1 class="remove-bottom" style="margin-top: 40px">Our Calendar</h1>
			<h5>Version 1.2</h5>
			<hr style="margin-bottom: 10px;" />
		</div>

        <div id="edit_form" class="sixteen columns">
            <h4 id="edit_form_title"></h4>
            <form>
                <input id="txt_title" name="title" type="text" placeholder="Title" required="required" />
                <input id="txt_time" name="time" type="text" placeholder="Time - HH:MM" />
                <textarea id="txt_content" name="content" placeholder="Content"></textarea>
                <input id="btn_edit_ok" type="submit" value="OK" />
                <input id="btn_edit_cancel" type="button" value="Cancel" />

                <input id="hidden_date" type="hidden" value="" />
            </form>
        </div>

		<div id="month-list" class="two columns" style="margin-top:2px;">
            <div class="month-list-item">Jan</div>
            <div class="month-list-item">Feb</div>
            <div class="month-list-item">Mar</div>
            <div class="month-list-item">Apr</div>
            <div class="month-list-item">May</div>
            <div class="month-list-item">Jun</div>
            <div class="month-list-item">Jul</div>
            <div class="month-list-item">Aug</div>
            <div class="month-list-item">Sep</div>
            <div class="month-list-item">Oct</div>
            <div class="month-list-item">Nov</div>
            <div class="month-list-item">Dec</div>
		</div>

		<div class="fourteen columns" id="cells-area">
            <div class="cells-column">
                <div class="left-cell"> <span class="date">1</span> </div>
                <div class="left-cell"> <span class="date">1</span> </div>
                <div class="left-cell"> <span class="date">1</span> </div>
                <div class="left-cell"> <span class="date">1</span> </div>
                <div class="left-cell"> <span class="date">1</span> </div>
            </div>

            <div class="cells-column">
                <div class="cell"> <span class="content">1234</span> <span class="date">2</span> </div>
                <div class="cell"> <span class="content">1234</span> <span class="date">2</span> </div>
                <div class="cell"> <span class="date">2</span> </div>
                <div class="cell"> <span class="date">2</span> </div>
                <div class="cell"> <span class="date">2</span> </div>
            </div>

            <div class="cells-column">
                <div class="cell"> <span class="date">3</span> </div>
                <div class="cell"> <span class="date">3</span> </div>
                <div class="cell"> <span class="date">3</span> </div>
                <div class="cell"> <span class="date">3</span> </div>
                <div class="cell"> <span class="date">3</span> </div>
            </div>

            <div class="cells-column">
                <div class="cell"> <span class="date">4</span> </div>
                <div class="cell"> <span class="date">4</span> </div>
                <div class="cell"> <span class="date">4</span> </div>
                <div class="cell"> <span class="date">4</span> </div>
                <div class="cell"> <span class="date">4</span> </div>
            </div>

            <div class="cells-column">
                <div class="cell"> <span class="date">5</span> </div>
                <div class="cell"> <span class="date">5</span> </div>
                <div class="cell"> <span class="date">5</span> </div>
                <div class="cell"> <span class="date">5</span> </div>
                <div class="cell"> <span class="date">5</span> </div>
            </div>

            <div class="cells-column">
                <div class="cell"> <span class="date">6</span> </div>
                <div class="cell"> <span class="date">6</span> </div>
                <div class="cell"> <span class="date">6</span> </div>
                <div class="cell"> <span class="date">6</span> </div>
                <div class="cell"> <span class="date">6</span> </div>
            </div>

            <div class="cells-column">
                <div class="right-cell"> <span class="date">7</span> </div>
                <div class="right-cell"> <span class="date">7</span> </div>
                <div class="right-cell"> <span class="date">7</span> </div>
                <div class="right-cell"> <span class="date">7</span> </div>
                <div class="right-cell"> <span class="date">7</span> </div>
            </div>

		</div>

        <div id="details">
            <div id="details_header">
                <div id="btn_add" class="button">
                    <span id="btn_add_title">2012-11-28</span><br/>+
                </div>
            </div>
            <div id="details_container">
                <div id="details_content">
                    a
                </div>
                <div id="btn_close">
                    &lt;
                </div>
            </div>
            <div id="details_overlay">
                <div class="vertical-align-helper" style="margin-bottom:-20px;"></div>
                <div class="vertical-aligned" style="height:40px;">
                    Loading....
                </div>
            </div>
        </div>

	</div><!-- container -->

<!-- End Document
================================================== -->
</body>
</html>

