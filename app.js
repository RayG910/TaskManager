// Selectors
const form = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const sortBtn = document.getElementById('sortBtn');
const taskCountDisplay = document.getElementById('taskCount');

// Event Listeners
form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteOrToggle);
taskList.addEventListener('click', editTask);
clearBtn.addEventListener('click', clearTasks);
darkModeToggle.addEventListener('click', toggleDarkMode);
sortBtn.addEventListener('click', sortTasks);
taskList.addEventListener('dragstart', dragStart);
taskList.addEventListener('dragover', dragOver);
taskList.addEventListener('drop', drop);
document.addEventListener('DOMContentLoaded', displayTasksFromLocalStorage);

// Function to add a task
function addTask(event) {
    event.preventDefault(); // Prevent form submission
    
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }
    
    if (taskExists(taskText)) {
        alert('Task already exists!');
        return;
    }
    
    // Create new task element
    const li = createTaskElement(taskText);
    
    taskList.appendChild(li);
    
    // Save task to local storage
    saveTaskToLocalStorage(taskText);
    
    // Clear input
    taskInput.value = '';

    // Update task count
    updateTaskCount();
}

// Function to delete or mark task as complete
function deleteOrToggle(event) {
    const item = event.target;
    
    if (item.classList.contains('delete-btn')) {
        const taskItem = item.closest('.task-item');
        taskItem.remove();
        removeFromLocalStorage(taskItem);
    } else if (item.classList.contains('complete-btn')) {
        const taskItem = item.closest('.task-item');
        taskItem.classList.toggle('completed');
        
        // Toggle checkmark icon
        toggleCheckmark(taskItem);
        
        // Update local storage
        updateTaskInLocalStorage(taskItem.querySelector('span').textContent);
    }
}

// Function to edit a task
function editTask(event) {
    const item = event.target;
    
    if (item.classList.contains('edit-btn')) {
        const taskItem = item.closest('.task-item');
        const taskContent = taskItem.querySelector('span');
        const taskText = taskContent.textContent;
        
        const newText = prompt('Edit task:', taskText);
        
        if (newText !== null && newText.trim() !== '') {
            taskContent.textContent = newText.trim();
            
            // Update local storage
            updateTaskInLocalStorage(taskText, newText.trim());
        }
    }
}

// Function to clear all tasks
function clearTasks() {
    taskList.innerHTML = ''; // Clear all tasks from the list
    localStorage.clear(); // Clear local storage
    updateTaskCount(); // Update task count display
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}

// Function to sort tasks alphabetically
function sortTasks() {
    const tasksArray = Array.from(taskList.children);
    const sortedTasks = tasksArray.sort((a, b) => {
        return a.querySelector('span').textContent.localeCompare(b.querySelector('span').textContent);
    });

    taskList.innerHTML = '';
    sortedTasks.forEach(task => taskList.appendChild(task));
}

// Function for drag and drop
let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target.closest('.task-item');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    const dropTarget = event.target.closest('.task-item');
    if (!dropTarget) return;

    const taskListItems = Array.from(taskList.querySelectorAll('.task-item'));
    const draggedIndex = taskListItems.indexOf(draggedItem);
    const dropIndex = taskListItems.indexOf(dropTarget);

    if (draggedIndex === dropIndex) return;

    if (draggedIndex < dropIndex) {
        taskList.insertBefore(draggedItem, dropTarget.nextSibling);
    } else {
        taskList.insertBefore(draggedItem, dropTarget);
    }

    // Update local storage order
    updateTaskOrderInLocalStorage();
}

// Function to update task order in local storage
function updateTaskOrderInLocalStorage() {
    const tasks = Array.from(taskList.children).map(task => task.querySelector('span').textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task count display
function updateTaskCount() {
    const taskCount = taskList.childElementCount;
    taskCountDisplay.textContent = `Total Tasks: ${taskCount}`;
}

// Function to save task to local storage
function saveTaskToLocalStorage(task) {
    let tasks;
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove task from local storage
function removeFromLocalStorage(taskItem) {
    const taskText = taskItem.querySelector('span').textContent;
    let tasks;
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    const updatedTasks = tasks.filter(task => task !== taskText);
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Function to update task in local storage
function updateTaskInLocalStorage(oldText, newText) {
    let tasks;
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    const index = tasks.indexOf(oldText);
    if (index !== -1) {
        tasks[index] = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Function to check if task already exists
function taskExists(taskText) {
    let tasks;
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    return tasks.includes(taskText);
}

// Function to display tasks from local storage
function displayTasksFromLocalStorage() {
    let tasks;
    console.log(tasks);
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    tasks.forEach(function(taskText) {
        const li = createTaskElement(taskText);
        taskList.appendChild(li);
    });

    // Update task count display
    updateTaskCount();
}

// Function to create task element
function createTaskElement(taskText) {
    // Create new task element
    const li = document.createElement('li');
    li.classList.add('task-item'); // Add a class for styling
    
    // Task text
    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;
    li.appendChild(taskContent);
    
    // Date stamp
    const dateStamp = document.createElement('span');
    dateStamp.textContent = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    dateStamp.classList.add('date-stamp');
    li.appendChild(dateStamp);
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons');
    
    // Add buttons for delete, edit, and mark as completed
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.className = 'edit-btn';
    
    const completeBtn = document.createElement('button');
    completeBtn.innerText = 'Complete';
    completeBtn.className = 'complete-btn';
    
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(completeBtn);
    buttonsContainer.appendChild(deleteBtn);
    
    li.appendChild(buttonsContainer);
    
    // Check if task is completed and add checkmark if needed
    if (isTaskCompleted(taskText)) {
        li.classList.add('completed');
        toggleCheckmark(li);
    }

    return li;
}

// Function to check if task is completed
function isTaskCompleted(taskText) {
    let tasks;
    
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    
    return tasks.includes(taskText);
}

// Function to toggle checkmark for completed task
function toggleCheckmark(taskItem) {
    const checkmark = taskItem.querySelector('.checkmark');
    
    if (!checkmark) {
        // Create checkmark icon
        const checkmarkIcon = document.createElement('span');
        checkmarkIcon.classList.add('checkmark');
        checkmarkIcon.innerHTML = '&#x2713;'; // Unicode for checkmark symbol
        taskItem.querySelector('.buttons').appendChild(checkmarkIcon);
    } else {
        checkmark.remove();
    }
}
