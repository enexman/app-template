var Nav = (function(){
    var
        screen = 0,
        container = $('.main-container'),
        pages = $('.page'),
        inScroll = false;

    // заменить этот код!!!
    var
        item_1 = $('.nav__item-1'),
        item_2 = $('.nav__item-2'),
        item_3 = $('.nav__item-3');

    item_1.on('click', function(e){
        $(this).addClass('nav__item_active')
            .siblings()
            .removeClass('nav__item_active');
        container.css('top', '0%');
    });

    item_2.on('click', function(e){
        $(this).addClass('nav__item_active')
            .siblings()
            .removeClass('nav__item_active');
        container.css('top', '-100%');
    });

    item_3.on('click', function(e){
        $(this).addClass('nav__item_active')
            .siblings()
            .removeClass('nav__item_active');
        container.css('top', '-200%');
    });
    //

})();