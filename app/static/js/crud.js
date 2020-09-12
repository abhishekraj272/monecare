$( document  ).ready(function(){


    let target_rows = $('.datarow');

    //Handle mouse enter and leave events for each row
    target_rows.each(function(){
        $(this).mouseenter(handleMouseEnter);
        $(this).mouseleave(handleMouseLeave);
    });



    function handleMouseEnter(){
        //We want to target the i elements in column 3 and make them visible
        let my_grandchildren = $(this).children('.column3').children('i');
        my_grandchildren.removeClass('invisible');
        my_grandchildren.addClass('visible');
    }

    function handleMouseLeave(){
        //We want to target the i elements in column 3 and make them invisible
        let my_grandchildren = $(this).children('.column3').children('i');
        my_grandchildren.removeClass('visible');
        my_grandchildren.addClass('invisible');
    }

});

