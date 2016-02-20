var Slider = (function(){
    $('.slide-show__link').on('click', function(e){
        e.preventDefault();

        var
            $this = $(this),
            item = $this.closest('.slide-show__item'),
            container = $this.closest('.slide-show'),
            display = container.find('.slide-show__display'),
            path = item.find('img').attr('src'),
            duration = 300;

        if (!item.hasClass('active')) {
            item.addClass('active').siblings().removeClass('active');
            display.find('img').fadeOut(duration, function(){
                $(this).attr('src', path).fadeIn(duration);
            });
        }
    })
})();