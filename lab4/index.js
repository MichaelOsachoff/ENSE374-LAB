let elements = [" "," "," "," "," "];
let position = 0;
function AddForm()
{
    inputValue = document.getElementById("newTask").value;
    elements[position]=inputValue;
    document.getElementById("Task1").value= elements[0];
    document.getElementById("Task2").value= elements[1];
    document.getElementById("Task3").value= elements[2];
    document.getElementById("Task4").value= elements[3];
    document.getElementById("Task5").value= elements[4];

    if(position==4)
    {
        position = 0;
    }
    else
    {
        position++;
    }
    document.getElementById("newTask").value="";
}
function SortForm()
{
    elements.sort();
    document.getElementById("Task1").value= elements[0];
    document.getElementById("Task2").value= elements[1];
    document.getElementById("Task3").value= elements[2];
    document.getElementById("Task4").value= elements[3];
    document.getElementById("Task5").value= elements[4];
}