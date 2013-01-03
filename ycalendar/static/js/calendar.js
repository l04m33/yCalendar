(function() {


var g_var = {
    last_move_ev_timestamp: 0,
    cur_month: 0
};

var g_config = {
    slide_time:         400,
    fade_time:          200,
    edit_form_height:   "290px",
    details_pane_width: "100px",
    default_time:       "12:00",
    default_limit:      5
};

function add_detail_row(container, row) {
    var new_row_title = $("<div class=\"details-row-title\"></div>"),
        new_row_content = $("<div class=\"details-row-content\"></div>"),
        new_row = $("<div class=\"details-row\"></div>"),
        cur_moment = moment.unix(row["timestamp"]);

    new_row_title.html(cur_moment.format("YYYY"));
    new_row_content.html(row["title"]);
    new_row.append(new_row_title);
    new_row.append(new_row_content);
    container.append(new_row);

    return new_row;
}

function get_load_details_cb(container, cur_moment) {
    var cb_func = function() {
        var url = "/json/daily_list/" + cur_moment.format("YYYY-MM-DD");
        var i,
            new_row,
            details_overlay = $("#details_overlay");

        details_overlay.show();

        $.get(url, {
                offset: 0, 
                limit: g_config["default_limit"]
            },
            function(ret_data) {
                var info_list,
                    cur_row;

                if (ret_data.hasOwnProperty("info_list")) {
                    details_overlay.hide();

                    info_list = ret_data.info_list;
                    info_list.reverse();

                    cur_row = info_list.pop();
                    if (typeof(cur_row) === "undefined") {
                        container.html("<br/>");
                        return;
                    }

                    new_row = add_detail_row(container, cur_row);
                    new_row.animate({opacity: 1}, g_config["fade_time"], 
                        function() {
                            cur_row = info_list.pop();
                            if (typeof(cur_row) !== "undefined") {
                                new_row = add_detail_row(container, cur_row);
                                new_row.animate({opacity: 1}, g_config["fade_time"], 
                                    arguments.callee);
                            }
                        });
                }
            });
    };

    return cb_func;
}


function cell_on_click() {
    var self = $(this),
        details = $("#details"),
        details_content,
        btn_add,
        btn_add_title,
        cur_moment,
        details_overlay;

    if (!details.is(":animated")) {
        details_content = $("#details_content");
        btn_add = $("#btn_add");
        btn_add_title = $("#btn_add_title");
        cur_moment = self.data("moment");
        details_overlay = $("#details_overlay");

        btn_add.data('moment', cur_moment);

        if (details.is(":visible")) {
            details_overlay.hide();
            details.animate({width: "0px"}, g_config["slide_time"],
                function() {
                    self.parent().after(details);
                    details_content.empty();
                    btn_add_title.html(cur_moment.format("YYYY-MM-DD"));
                    details.animate({width: g_config["details_pane_width"]}, 
                        g_config["slide_time"], 
                        get_load_details_cb(details_content, cur_moment));
                });
        }
        else {
            self.parent().after(details);
            details_content.empty();
            btn_add_title.html(cur_moment.format("YYYY-MM-DD"));
            details.show().animate({width: g_config["details_pane_width"]}, 
                g_config["slide_time"],
                get_load_details_cb(details_content, cur_moment));
        }
    }
}


function btn_close_on_click() {
    var details = $("#details"),
        details_overlay = $("#details_overlay");

    if (details.is(":visible") && (!details.is(":animated"))) {
        details_overlay.hide();
        details.animate({width: "0px"}, g_config["slide_time"],
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
        txt_content = $("#txt_content"),
        txt_time = $("#txt_time"),
        hidden_date = $("#hidden_date");

    var default_time_val,
        now = moment();

    if (cur_moment.year() === now.year() &&
            cur_moment.month() === now.month() &&
            cur_moment.date() === now.date()) {
        default_time_val = now.format("HH:mm");
    }
    else {
        default_time_val = g_config["default_time"]
    }

    if (edit_form.is(":visible")) {
        edit_form.animate({height: "0px"}, g_config["slide_time"],
            function() {
                txt_title.val("");
                txt_content.val("");
                txt_time.val(default_time_val);
                hidden_date.val(cur_moment.format("YYYY-MM-DD"));
                edit_form_title.html(cur_moment.format("LL"));
                edit_form.animate({height: g_config["edit_form_height"]}, 
                    g_config["slide_time"],
                    function() {
                        txt_title.focus();
                    });
            });
    }
    else {
        txt_title.val("");
        txt_content.val("");
        txt_time.val(default_time_val);
        hidden_date.val(cur_moment.format("YYYY-MM-DD"));
        edit_form_title.html(cur_moment.format("LL"));
        edit_form.show().animate({height: g_config["edit_form_height"]}, 
            g_config["slide_time"],
            function() {
                txt_title.focus();
            });
    }
}


function btn_edit_cancel_on_click() {
    var edit_form = $("#edit_form");

    if (edit_form.is(":visible")) {
        edit_form.animate({height: "0px"}, g_config["slide_time"],
            function() {
                edit_form.hide();
            });
    }
}


function form_edit_on_submit(ev) {
    var edit_form = $("#edit_form"),
        txt_title = $("#txt_title"),
        txt_content = $("#txt_content"),
        txt_time = $("#txt_time"),
        hidden_date = $("#hidden_date");

    var data,
        cur_moment;

    cur_moment = moment(hidden_date.val() + " " + txt_time.val(), 
            ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss"]);
        
    data = {
        title: txt_title.val(),
        content: txt_content.val(),
        timestamp: cur_moment.unix()
    };
    // TODO: validate all the fields above....

    ev.preventDefault();

    $.post("/json/detail_info/0/update", data,
        function(ret_data) {
            // TODO: check the return value, and display errors?
            alert(JSON.stringify(ret_data));
            edit_form.animate({height: "0px"}, g_config["slide_time"],
                function() {
                    edit_form.hide();
                });
        });
}


function populate_cells(now) {
    var i;
    var cells_area = $("#cells-area");

    cells_area.empty();
    for(i = 0; i < 7; i++) {
        var col_id = "col-" + i;
        var new_col = $('<div class="cells-column" id="' + col_id + '" />');

        cells_area.append(new_col)
    }

    var first_day_of_month = now.clone().startOf("month"),
        first_day_of_page = first_day_of_month.clone().subtract("days", first_day_of_month.day()),
        last_day_of_month = now.clone().endOf("month"),
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

        if (cur_day.unix() < first_day_of_month.unix() 
                || cur_day.unix() > last_day_of_month.unix()) {
            new_cell.addClass("inactive-cell");
        }
        else if (cur_day.date() === moment().date() 
                && cur_day.month() === moment().month()) {
            new_cell.addClass("today-cell");
        }

        cur_day.add("days", 1);
    }
}


function set_month_list_focus(mouse_y) {
    var month_list = $("#month-list"),
        month_items = month_list.children(".month-list-item");

    var i,
        cur_item,
        item_height,
        item_pos,
        item_y_center,
        y_diff,
        scale_factor;


    for (i = 0; i < month_items.length; i++) {
        cur_item = month_items.slice(i, i + 1);

        item_pos = cur_item.position();

        item_height = cur_item.height();
        item_y_center = item_pos.top + item_height / 2 + 7;
        y_diff = Math.abs(mouse_y - item_y_center);

        if (y_diff < item_height / 2) {
            cur_item.addClass("month-list-item-focus");
        }
        else {
            cur_item.removeClass("month-list-item-focus");
        }

        y_diff = Math.max(1,  y_diff / 15);

        scale_factor = 1.0 / y_diff + 1;
        cur_item.css("-webkit-transform", "scale(" + scale_factor + ")");
        cur_item.css("-moz-transform",    "scale(" + scale_factor + ")");
    }
}


function set_month_list_focus_by_month(month) {
    var month_list = $("#month-list"),
        month_items = month_list.children(".month-list-item");

    var cur_item = month_items.slice(month - 1, month),
        item_pos = cur_item.position(),
        item_y_center = item_pos.top + cur_item.height() / 2 + 7;

    g_var["cur_month"] = month;
    set_month_list_focus(item_y_center);
}


function month_list_on_move(ev) {
    if (ev.timeStamp - g_var["last_move_ev_timestamp"] > 50) {
        set_month_list_focus(ev.clientY);
        g_var["last_move_ev_timestamp"] = ev.timeStamp;
    }
}


function month_list_on_click(ev) {
    var self = $(this),
        cur_item = self.children(".month-list-item-focus"),
        dummy_moment,
        month_idx;

    if (cur_item.length === 1) {
        month_idx = Math.floor((cur_item.position().top - 125) / 31);
        dummy_moment = moment();
        dummy_moment.month(month_idx);
        populate_cells(dummy_moment);
        set_month_list_focus_by_month(month_idx + 1);
    }
}


function populate_month_list() {
    var months = ["Jan", "Feb", "Mar",
                  "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep",
                  "Oct", "Nov", "Dec"],
        month_list = $("month-list");

    var i,
        new_item;

    month_list.empty();
    for (i = 0; i < months.length; i++) {
        new_item = $("<div class=\"month-list-item\">" + months[i] + "</div>");
        month_list.append(new_item);
    }
}


$(document).ready(function() {
    populate_cells(moment());

    var col_height = $("#col-0").height(),
        header_height = $("details_header").height(),
        container_height = col_height - header_height - 64;

    $("#details").hide();
    $("#details").css({"height": col_height + "px"});
    $("#details_overlay").hide();
    $("#details_overlay").css({"height": col_height + "px"});
    $("#details_container").css({"height": container_height + "px"});
    $("#details_content").css({"height": container_height + "px"});

    $("#edit_form").hide();

    $(".cell").bind("click", cell_on_click);
    $(".left-cell").bind("click", cell_on_click);
    $(".right-cell").bind("click", cell_on_click);

    $("#btn_add").bind("click", btn_add_on_click);
    $("#btn_edit_cancel").bind("click", btn_edit_cancel_on_click);
    $("#edit_form").bind("submit", form_edit_on_submit);
    $("#btn_close").bind("click", btn_close_on_click);
    $("#details").bind("mouseleave", btn_close_on_click);

    populate_month_list();
    $("#month-list").bind("mousemove", month_list_on_move);
    $("#month-list").bind("mouseleave", function(){
        set_month_list_focus_by_month(g_var["cur_month"]);
    });
    $("#month-list").bind("click", month_list_on_click);
    set_month_list_focus_by_month(moment().month() + 1);
});


})();

