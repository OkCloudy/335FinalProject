const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-area");

let taskId = 0; // Initialize a variable to keep track of task IDs

addButton.addEventListener("click", addTask);

function addTask() {
    console.log("Adding new Task");
    const taskText = document.getElementById("enter-task");

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
    deleteButton.onclick = () => {
        console.log("DELETE DAT HOE");
    };
    newTaskDiv.appendChild(deleteButton);


    //Adding the new task to the task-area div
    taskContainer.appendChild(newTaskDiv);
    taskText.value = "";
    taskId++; // Increment the task ID for the next task
}