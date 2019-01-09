$(function () {
    $("a.nav-link[href='" + window.location.pathname + "']").filter(":first").parent().addClass("active");
});
