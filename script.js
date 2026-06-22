const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Save to Local Storage */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Render Tasks */
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="actions">
                <button class="complete-btn" data-id="${task.id}">
                    ✓
                </button>

                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

/* CREATE */
function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

/* Event Delegation */
taskList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    /* DELETE */
    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    /* COMPLETE */
    if (e.target.classList.contains("complete-btn")) {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
    }

    /* UPDATE */
    if (e.target.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === id);

        const updatedText = prompt(
            "Edit Task",
            task.text
        );

        if (updatedText && updatedText.trim()) {
            task.text = updatedText.trim();
        }
    }

    saveTasks();
    renderTasks();
});

/* FILTERING */
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filterBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

/* Initial Load */
renderTasks();
