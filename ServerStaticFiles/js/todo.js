const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-area");
//const date = document.getElementById("todo-date");

let taskArray = [];
let taskNames = [];
let taskId = 0; // Initialize a variable to keep track of task IDs

addButton.addEventListener("click", addTask);

/* Code for updating DB but not after every single delete or add*/
//window.addEventListener('beforeunload', updateTasks)
// updates the database every 5 minutes
//setInterval(updateTasks, 300000);

function renderTasks() {
    taskContainer.innerHTML = "";
    taskArray.forEach(element => {
        taskContainer.appendChild(element);
    });
}

function addTask(eventOrTaskName) {
    console.log("Adding new Task");
    let taskName = ""
    if (eventOrTaskName && eventOrTaskName.type === "click") {
        const taskText = document.getElementById("enter-task");
        if (taskText.value.trim() === "") {
            alert("Type a task first");
            return;
        }
        taskName = taskText.value
    } else if (typeof eventOrTaskName === "string") {
        taskName = eventOrTaskName;
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
    newTaskText.name = taskName;
    newTaskText.value = taskName;
    newTaskDiv.appendChild(newTaskText);

    // Creating Trash Can
    let deleteButton = document.createElement("ion-icon");
    deleteButton.className = "delete-button";
    deleteButton.name = "trash-outline";
    deleteButton.onclick = (event) => {
        // Retrieve the parent element of the delete button
        let taskElement = event.target.parentElement;
        let taskElementName = taskElement.querySelector('.individual-task').getAttribute('name')
        console.log("DELETE TASKELEMETN: ", taskElement);
        console.log(" TASKELEMETN: ", taskElementName);
        console.log("Tasksnames before rmb: ", taskNames);

        // Remove the task from the DOM and taskNames
        let indexToRmv = taskArray.indexOf(taskElement);
        console.log("IndextoRMV: ", indexToRmv);
        taskArray.splice(indexToRmv,1);
        let nameToRmv = taskNames.indexOf(taskElementName);
        taskNames.splice(indexToRmv,1);
        console.log("Tasknames after rmv: ", taskNames);
        renderTasks();
        updateTasks();
        // Send a request to delete the task from the backend
    };
    newTaskDiv.appendChild(deleteButton);

    taskArray.push(newTaskDiv);

    //Adding the new task to the task-area div
    taskContainer.appendChild(newTaskDiv);
   // taskText.value = "";
    taskId++; // Increment the task ID for the next task

    if (eventOrTaskName && eventOrTaskName.type === "click") {
        taskNames.push(taskName)
        updateTasks()
    }
}

async function retrieveSessionData() {
    const retrieveData = await fetch('/session-data', {
        method: 'GET'
    })
    let data = await retrieveData.json();
    console.log("REtreived session data: ", data)
    taskNames = data.tasks
    console.log(" REterive Tasksnames before: ", taskNames);
    taskNames.forEach(task => {
        addTask(task)
    })
    console.log(" REterive Tasksnames after: ", taskNames);
}

async function updateTasks() {
    const add = await fetch("/update-task", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tasks: taskNames})
    });
}

retrieveSessionData()


// On the frontend(Here) we need to retrieve task data from current user rs
// things that may be a design flaw
// Having fetch for every single update or delete. Across many concurrent applications this might be way too many calls into the data base.
// (Maybe we only update when the user is done?)

// Bugs