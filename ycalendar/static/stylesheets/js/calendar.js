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


$(document).ready(function() {
    $("#details").hide();
    $(".cell").bind("click", cell_on_click);
    $(".left-cell").bind("click", cell_on_click);
    $(".right-cell").bind("click", cell_on_click);
});

