var Scrolling = (function(){
    var
        screen = 0,
        container = $('.main-container'),
        pages = $('.page'),
        inScroll = false;

    $('.page:first-child').addClass('active');

    $('body').on('mousewheel', function(event){
        var
            activePage = pages.filter('.active');
        if (!inScroll) {
            inScroll = true;
            if (event.deltaY > 0) {
                if (activePage.prev().length) {
                    screen--;
                }
            } else {
                if (activePage.next().length) {
                    screen++;
                }
            }
        }

        var
            position = (-screen * 100) + '%';

        pages.eq(screen).addClass('active').siblings().removeClass('active');

        container.css('top', position);

        setInterval(function(){
            inScroll = false;
        }, 1500);

    });

})();