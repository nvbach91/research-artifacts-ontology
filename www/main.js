$(document).ready(function () {
    $('a').each(function () {
        var t = $(this);
        if (t.attr('href').includes('endora')) {
            t.parents('div').last().remove();
        }
    })
});
