const addButton = document.getElementById("add-task");
const taskContainer = document.getElementById("task-area");


const url = `mongodb+srv://tgacquin:<password>@cluster0.4zzdwnk.mongodb.net/?retryWrites=true&w=majority`

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


document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => console.log('Login successful:', data))
    .catch(error => console.error('Error:', error));
});