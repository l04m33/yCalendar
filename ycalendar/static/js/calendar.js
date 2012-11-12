function cell_on_click() {
    var self = $(this);
    var details = $("#details");

    if (details.is(":visible")) {
        details.animate({width: "0px"}, 400,
            function() {
                self.parent().after(details);
                details.animate({width: "100px"}, 400);
            });
    }
    else {
        self.parent().after(details);
        details.show().animate({width: "100px"}, 400);
    }
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
    var first_day_of_month = moment().startOf("month");
    var first_day_of_page = first_day_of_month.clone().subtract("days", first_day_of_month.day());
    var last_day_of_month = moment().endOf("month");
    var last_day_of_page = last_day_of_month.clone().add("days", 6 - last_day_of_month.day());

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

        if (cur_day.toDate() < first_day_of_month || cur_day.toDate() > last_day_of_month) {
            // XXX: move this to the CSS files?
            new_cell.css({
                "background":  "#fbfbfb",
                "opacity":     "0.7"});
            new_date_span.css({
                "opacity":     "0.7", 
                "text-shadow": "1px 1px 1px #c0c0c0"});
        }

        cur_day.add("days", 1);
    }
}


$(document).ready(function() {
    populate_cells();
    $("#details").hide();
    $(".cell").bind("click", cell_on_click);
    $(".left-cell").bind("click", cell_on_click);
    $(".right-cell").bind("click", cell_on_click);
});

