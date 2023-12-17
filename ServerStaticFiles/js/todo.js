const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-area");
const date = document.getElementById("todo-date");

let taskArray = [];
let taskId = 0; // Initialize a variable to keep track of task IDs

addButton.addEventListener("click", addTask);
date.addEventListener('change', dateSelect);

/* Functionality for fetching todo list based on date. never finished :( 
async function dateSelect() {
    const dateValue = date.value;
    const response = await fetch("/todo", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: dateValue })
    });
    const result = await response.json();
    console.log(result);
}
*/
function renderTasks() {
    taskContainer.innerHTML = "";
    taskArray.forEach(element => {
        taskContainer.appendChild(element);
    });
}

function addTask() {
    console.log("Adding new Task");
    const taskText = document.getElementById("enter-task");

    if (taskText.value.trim() === "") {
        console.log("Add sum");
        alert("Type a task first");
        return;
    }

    let newTaskDiv = document.createElement('div');
    newTaskDiv.className = "task";

    // Creating Checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.id = "check-" + taskId; // Unique ID for each checkbox
    newTaskDiv.appendChild(checkbox);

    // Creating label
    let label = document.createElement("label");
    label.setAttribute("for", "check-" + taskId); // Reference the unique ID
    newTaskDiv.appendChild(label);

    // Creating input text for task
    let newTaskText = document.createElement("input");
    newTaskText.type = "text";
    newTaskText.className = "individual-task";
    newTaskText.name = "individual-task";
    newTaskText.value = taskText.value
    newTaskDiv.appendChild(newTaskText);

    // Creating Trash Can
    let deleteButton = document.createElement("ion-icon");
    deleteButton.className = "delete-button";
    deleteButton.name = "trash-outline";
    deleteButton.onclick = (event) => {
        // Retrieve the parent element of the delete button
        let taskElement = event.target.parentElement;
        console.log(taskElement);

        // Remove the task from the DOM
        let indexToRmv = taskArray.indexOf(taskElement);
        taskArray.splice(indexToRmv,1);
        renderTasks();
        // Send a request to delete the task from the backend
        console.log("DELETE DAT HOE");
    };
    newTaskDiv.appendChild(deleteButton);

    taskArray.push(newTaskDiv);

    //Adding the new task to the task-area div
    taskContainer.appendChild(newTaskDiv);
    taskText.value = "";
    taskId++; // Increment the task ID for the next task
}