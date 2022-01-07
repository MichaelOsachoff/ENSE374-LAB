let tasks = $(".tasks");
let addButton = $("#newTaskButton");
var counter = 0;
$(addButton).click( (event) => { 

    var inputValue = $("#newTask").val();
    tasks.append($('<div/>').addClass('input-group mb-3').append($(`<input type="checkbox" class="form-check mx-2" style="display:none" unchecked id="checkbox-${counter}"/>`))
    .append( $(`<input type="textbox" readonly id="inputText-${counter}">`).val(inputValue).addClass( 'form-control' ) )
    .append( $(`<button  id="abandonButton-${counter}"/>`).addClass( 'btn' ).text( 'Claim' ) ));

    let checkBox = $(`#checkbox-${counter}`);
    checkBox.click(changeCheck);

    let abandonButton = $(`#abandonButton-${counter}`);
    abandonButton.click(changeClaim);

    $(`#removeCompleteButton`).click(removeComplete);
    counter++;

});

function changeClaim(event)
{
    let id = event.currentTarget.id.at(-1);
    let abandonButton = $(`#abandonButton-${id}`);
    let checkBox = $(`#checkbox-${id}`);
    var value1 = abandonButton.html();
    if(value1=='Claim')
    {
        abandonButton.html('Abandon');
        checkBox.css("display","inline");
    }
    else if(value1=='Abandon')
    {
        abandonButton.html('Claim');
        checkBox.css("display","none");
    }
}

function changeCheck(event)
{
    let id = event.currentTarget.id.at(-1);
    let abandonButton = $(`#abandonButton-${id}`);
    let checkBox = $(`#checkbox-${id}`);
    let inputText = $(`#inputText-${id}`);

    inputText.toggleClass('text-decoration-line-through');
    checkBox.toggleClass('completed');
    abandonButton.toggle();
}

function removeComplete()
{
    $('.completed').parent().remove();
}