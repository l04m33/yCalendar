function cell_on_click() {
    var self = $(this),
        details = $("#details"),
        btn_add = $("#btn_add"),
        btn_add_title = $("#btn_add_title"),
        cur_moment = self.data("moment");

    btn_add.data('moment', cur_moment);

    if (details.is(":visible")) {
        details.animate({width: "0px"}, 400,
            function() {
                self.parent().after(details);
                btn_add_title.html(cur_moment.format("YYYY-MM-DD"));
                details.animate({width: "100px"}, 400);
            });
    }
    else {
        self.parent().after(details);
        btn_add_title.html(cur_moment.format("YYYY-MM-DD"));
        details.show().animate({width: "100px"}, 400);
    }
}


function btn_close_on_click() {
    var details = $("#details");

    if (details.is(":visible")) {
        details.animate({width: "0px"}, 400,
            function() {
                details.hide();
            });
    }
}


function btn_add_on_click() {
    var self = $(this);
        edit_form = $("#edit_form"),
        edit_form_title = $("#edit_form_title"),
        cur_moment = self.data("moment"),
        txt_title = $("#txt_title"),
        txt_content = $("#txt_content");

    if (edit_form.is(":visible")) {
        edit_form.animate({height: "0px"}, 400,
            function() {
                txt_title.val("");
                txt_content.val("");
                edit_form_title.html(cur_moment.format("LL"));
                edit_form.animate({height: "240px"}, 400,
                    function() {
                        txt_title.focus();
                    });
            });
    }
    else {
        txt_title.val("");
        txt_content.val("");
        edit_form_title.html(cur_moment.format("LL"));
        edit_form.show().animate({height: "240px"}, 400,
            function() {
                txt_title.focus();
            });
    }
}


function btn_edit_cancel_on_click() {
    var edit_form = $("#edit_form");

    if (edit_form.is(":visible")) {
        edit_form.animate({height: "0px"}, 400,
            function() {
                edit_form.hide();
            });
    }
}


function form_edit_on_submit(ev) {
    var edit_form = $("#edit_form"),
        txt_title = $("#txt_title"),
        txt_content = $("#txt_content"),
        data = {
            title: txt_title.val(),
            content: txt_content.val()
        };

    ev.preventDefault();

    $.post("/json/detail_info/0/update", data,
        function(ret_data) {
            // TODO: check the return value, and display errors?
            alert(JSON.stringify(ret_data));
            edit_form.animate({height: "0px"}, 400,
                function() {
                    edit_form.hide();
                });
        });
}


function populate_cells() {
    var i;
    var cells_area = $("#cells-area");

    cells_area.empty();
    for(i = 0; i < 7; i++) {
        var col_id = "col-" + i;
        var new_col = $('<div class="cells-column" id="' + col_id + '" />');

        cells_area.append(new_col)
    }

    var now = moment();
    var first_day_of_month = moment().startOf("month"),
        first_day_of_page = first_day_of_month.clone().subtract("days", first_day_of_month.day()),
        last_day_of_month = moment().endOf("month"),
        last_day_of_page = last_day_of_month.clone().add("days", 6 - last_day_of_month.day());

    var cur_day = first_day_of_page.clone().add("hours", 12);
    var cell_class, 
        container, 
        new_cell,
        new_date_span;

    while (cur_day.toDate() < last_day_of_page) {
        switch (cur_day.day()) {
        case 0:
            cell_class = "left-cell";
            break;
        case 6:
            cell_class = "right-cell";
            break;
        default:
            cell_class = "cell";
            break;
        }

        container = $("#col-" + cur_day.day());
        new_cell = $('<div class="' + cell_class + '" />');
        new_date_span = $('<span class="date">' + cur_day.date() + '</span>');
        new_cell.append(new_date_span);
        container.append(new_cell);

        new_cell.data('moment', cur_day.clone());

        if (cur_day.toDate() < first_day_of_month || cur_day.toDate() > last_day_of_month) {
            new_cell.addClass("inactive-cell");
        }

        cur_day.add("days", 1);
    }
}


$(document).ready(function() {
    populate_cells();

    var col_height = $("#col-0").height(),
        header_height = $("details_header").height(),
        container_height = col_height - header_height - 64;

    $("#details").hide();
    $("#details").css({height: col_height + 'px'});
    $("#details_container").css({height: container_height + 'px'});

    $("#edit_form").hide();

    $(".cell").bind("click", cell_on_click);
    $(".left-cell").bind("click", cell_on_click);
    $(".right-cell").bind("click", cell_on_click);

    $("#btn_add").bind("click", btn_add_on_click);
    $("#btn_edit_cancel").bind("click", btn_edit_cancel_on_click);
    $("#edit_form").bind("submit", form_edit_on_submit);
    $("#btn_close").bind("click", btn_close_on_click);
    $("#details").bind("mouseleave", btn_close_on_click);
});

