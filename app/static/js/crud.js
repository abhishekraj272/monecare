
export function assignEventHandlers(){
    let target_rows = $('.datarow');
    console.log(target_rows);
    //Handle mouse enter and leave events for each row
    target_rows.each(function(){
        $(this).mouseenter(handleMouseEnter);
        $(this).mouseleave(handleMouseLeave);
        $(this).children(".column3").children("#editRow").click(editRow);
        $(this).children(".column3").children("#deleteRow").click(deleteRow);
    });
}

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

function editRow(){
   console.log("Edit"); 
}


function deleteRow(){
    console.log("Delete");
}



