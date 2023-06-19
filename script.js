document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('task-input');
  const addButton = document.getElementById('add-button');
  const toDoList = document.getElementById('to-do-list');
  const completedList = document.getElementById('completed-list');
  const deleteAllButton = document.getElementById('delete-all-button');

  
  loadTasks();

  addButton.addEventListener('click', function() {
    const taskName = taskInput.value;
    if (taskName.trim() !== '') {
      createTask(taskName);
      taskInput.value = '';
      saveTasks();
    }
  });

  function loadTasks() {
    const toDoTasks = JSON.parse(localStorage.getItem('toDoTasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    toDoTasks.forEach(function(task) {
      createTask(task, false);
    });

    completedTasks.forEach(function(task) {
      createTask(task, true);
    });

    if (completedTasks.length > 0) {
      deleteAllButton.disabled = false;
    }
  }

  function saveTasks() {
    const toDoTasks = Array.from(toDoList.children).map(function(task) {
      return task.firstChild.nextSibling.textContent;
    });

    const completedTasks = Array.from(completedList.children).map(function(task) {
      return task.firstChild.nextSibling.textContent;
    });

    localStorage.setItem('toDoTasks', JSON.stringify(toDoTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }

  function createTask(taskName, isCompleted) {
    const taskItem = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.addEventListener('change', function() {
      if (taskCheckbox.checked) {
        completeTask(taskItem);
      } else {
        undoTask(taskItem);
      }
      saveTasks();
    });

    const taskText = document.createElement('span');
    taskText.textContent = taskName;

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskText);

    if (isCompleted) {
      taskCheckbox.checked = true;
      completedList.appendChild(taskItem);
      createCompletedButtons(taskItem);
    } else {
      toDoList.appendChild(taskItem);
    }
  }

  function completeTask(taskItem) {
    
    toDoList.removeChild(taskItem);
    completedList.appendChild(taskItem);
    deleteAllButton.disabled = false;
    createCompletedButtons(taskItem);
  }

  function undoTask(taskItem) {
    taskItem.style.textDecoration = '';
    completedList.removeChild(taskItem);
    toDoList.appendChild(taskItem);
    taskItem.firstChild.checked = false;
    if (completedList.childElementCount === 0) {
      deleteAllButton.disabled = true;
    }
    removeCompletedButtons(taskItem);
  }

  function deleteTask(taskItem) {
    completedList.removeChild(taskItem);
    if (completedList.childElementCount === 0) {
      deleteAllButton.disabled = true;
    }
    removeCompletedButtons(taskItem);
  }

  function createCompletedButtons(taskItem) {
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.style.marginLeft='50px';
    undoButton.addEventListener('click', function() {
      undoTask(taskItem);
      saveTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deleteTask(taskItem);
      saveTasks();
      deleteTask(taskItem);
      saveTasks();
    });

    taskItem.appendChild(undoButton);
    taskItem.appendChild(deleteButton);
  }

  function removeCompletedButtons(taskItem) {
    const buttons = taskItem.querySelectorAll('button');
    buttons.forEach(function(button) {
      button.remove();
    });
  }

  deleteAllButton.addEventListener('click', function() {
    while (completedList.firstChild) {
      completedList.removeChild(completedList.firstChild);
    }
    deleteAllButton.disabled = true;
    saveTasks();
  });
});
