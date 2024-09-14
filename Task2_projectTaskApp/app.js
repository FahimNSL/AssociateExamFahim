document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterSelect = document.getElementById('filter');
    const filterDate = document.getElementById('filterDate');
    const filterBtn = document.getElementById('filterBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let undoStack = [];
    let redoStack = [];

    const toggleUndoRedoVisibility = (taskCount) => {
        if (taskCount > 0) {
            undoBtn.style.display = undoStack.length > 0 ? 'inline-block' : 'none';
            redoBtn.style.display = redoStack.length > 0 ? 'inline-block' : 'none';
        } else {
            undoBtn.style.display = 'none';
            redoBtn.style.display = 'none';
        }
    };

    const displayTasks = (filteredTasks = tasks) => {
        taskList.innerHTML = ''; 
    
        if (filteredTasks.length === 0) {

            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 4; 
            noDataCell.style.textAlign = 'center'; 
            noDataCell.textContent = 'No data to preview'; 
            noDataRow.appendChild(noDataCell);
            taskList.appendChild(noDataRow);
        } else {
           
            filteredTasks.forEach(task => {
                const row = document.createElement('tr');
                row.className = task.status === 'completed' ? 'task-completed' : '';
    
                row.innerHTML = `
                    <td>${task.description}</td>
                    <td>${task.status}</td>
                    <td>${task.createdAt}</td>
                    <td>
                        ${task.status === 'completed' ? `
                            <button class="btn btn-complete" onclick="markCompleted(${task.id})" disabled>Complete</button>
                            <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                            <button class="undo-icon" onclick="undoTask(${task.id})">Pending</button>
                        ` : `
                            <button class="btn btn-complete" onclick="markCompleted(${task.id})">Complete</button>
                            <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                        `}
                    </td>
                `;
                taskList.appendChild(row);
            });
        }

        toggleUndoRedoVisibility(filteredTasks.length);
    };
    


    addTaskBtn.addEventListener('click', () => {
        const taskDesc = taskInput.value.trim();
        if (taskDesc === '') return alert('Please enter a task');

        const task = {
            id: Date.now(),
            description: taskDesc,
            status: 'pending',
            createdAt: new Date().toLocaleString(),
        };

        tasks.push(task);
        saveTasks();
        undoStack.push({ action: 'add', task });
        redoStack = [];
        displayTasks();

        taskInput.value = '';
    });

    window.markCompleted = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task && task.status === 'pending') {
            task.status = 'completed';
            saveTasks();
            undoStack.push({ action: 'complete', task });
            redoStack = [];
            displayTasks();
        }
    };

    window.deleteTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            undoStack.push({ action: 'delete', task });
            redoStack = [];
            displayTasks();
        }
    };

    window.undoTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = 'pending';
            saveTasks();
            undoStack.push({ action: 'edit', task });
            redoStack = [];
            displayTasks();
        }
    };

    undoBtn.addEventListener('click', () => {
        if (undoStack.length === 0) return;

        const lastAction = undoStack.pop();
        redoStack.push(lastAction);

        switch (lastAction.action) {
            case 'add':
                tasks = tasks.filter(task => task.id !== lastAction.task.id);
                break;
            case 'complete':
                lastAction.task.status = 'pending';
                tasks = tasks.map(task => task.id === lastAction.task.id ? lastAction.task : task);
                break;
            case 'delete':
                tasks.push(lastAction.task);
                break;
            case 'edit':
                lastAction.task.status = 'completed';
                tasks = tasks.map(task => task.id === lastAction.task.id ? lastAction.task : task);
                break;
        }

        saveTasks();
        displayTasks();
    });

    redoBtn.addEventListener('click', () => {
        if (redoStack.length === 0) return;

        const lastUndo = redoStack.pop();
        undoStack.push(lastUndo);

        switch (lastUndo.action) {
            case 'add':
                tasks.push(lastUndo.task);
                break;
            case 'complete':
                lastUndo.task.status = 'completed';
                tasks = tasks.map(task => task.id === lastUndo.task.id ? lastUndo.task : task);
                break;
            case 'delete':
                tasks = tasks.filter(task => task.id !== lastUndo.task.id);
                break;
            case 'edit':
                lastUndo.task.status = 'pending';
                tasks = tasks.map(task => task.id === lastUndo.task.id ? lastUndo.task : task);
                break;
        }

        saveTasks();
        displayTasks();
    });

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    filterSelect.addEventListener('change', () => {
        const status = filterSelect.value;
        const filteredTasks = status === 'all' ? tasks : tasks.filter(task => task.status === status);
        displayTasks(filteredTasks);
    });

    filterBtn.addEventListener('click', () => {
        const selectedDate = filterDate.value;
        if (!selectedDate) return alert('Please select a date to filter by');

        const filteredTasks = tasks.filter(task => new Date(task.createdAt).toLocaleDateString() === new Date(selectedDate).toLocaleDateString());
        displayTasks(filteredTasks);
    });


    displayTasks();
});
