
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span>✦</span>
                <h3>No tasks found</h3>
                <p>Add a task or select another filter.</p>
            </div>`;
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) taskItem.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const details = document.createElement("div");
        details.className = "task-details";

        const title = document.createElement("h3");
        title.textContent = task.name;

        const category = document.createElement("p");
        category.textContent = task.category;

        details.append(title, category);

        const tag = document.createElement("span");
        tag.className = "category-tag";
        tag.textContent = task.category;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskItem.append(checkbox, details, tag, deleteButton);
        taskList.appendChild(taskItem);
    });

    updateStatistics();
}

function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ?    0 : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressPercent").textContent = percentage + "%";
    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("taskCount").textContent = total + " tasks";

    document.getElementById("progressText").textContent =
        total === 0
            ? "Start adding tasks to track your progress."
            : `${completed} of ${total} tasks completed. Keep going!`;
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === "") {
        alert("Please enter a task name.");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: name,
        category: taskCategory.value,
        completed: false
    });

    saveTasks();
    taskForm.reset();
    currentFilter = "all";

    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.filter === "all");
    });

    renderTasks();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();
