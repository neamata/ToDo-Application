let currentUser = null;

const sections = {
    login: document.getElementById("login-section"),
    signup: document.getElementById("signup-section"),
    dashboard: document.getElementById("dashboard-section")
};

function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-button");

    if (currentUser === null) {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
    } else {
        userInfo.textContent = currentUser.email;
        logoutButton.style.display = "inline";
    }

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.hash = "#login";
        currentUser = null;
        route();


        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
    });
}

function initialize() {

    // SignUp Handler
    const signUpForm = document.getElementById("signup-form");
    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // get the values
        const userName = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.length > 0) {
                throw new Error("Email Exists");
            }

            const createUser = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, password })
            });

            const createdUser = await createUser.json();
            currentUser = createdUser;
            console.log("signup", currentUser);

            localStorage.setItem("user", JSON.stringify(currentUser));

            window.location.hash = "dashboard";
            route();

        } catch (err) {
            document.getElementById("signup-errors").textContent = err.message;
        }
    });

    //login Handler
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (data.length === 0) {
                throw new Error("Invalid Credentials");
            }

            const user = data.find(item => item.password === password);
            currentUser = user;
            console.log("login", currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.location.hash = "dashboard";
            route();

        } catch (err) {
            document.getElementById("login-errors").textContent = err.message;
        }
    });

    currentUser = JSON.parse(localStorage.getItem("user"));
    route();

    window.onhashchange = route;
}

initialize();

function route() {
    const hash = window.location.hash || "#";
    renderHeader();

    if (!currentUser) {
        if (hash === "#signup") {
            showSections("signup");
        } else {
            showSections("login");
        }
    } else {
        showSections("dashboard");
        loadTodos();
    }
}

function showSections(name) {

    //remove the display: block property from each section
    const values = Object.values(sections);
    values.forEach((item) => {
        item.classList.remove("active");
    });

    //only add active property to currently visible section
    if (sections[name]) {
        sections[name].classList.add("active");
    }
}

const newTodo = document.getElementById("add-new-todo");
newTodo.addEventListener("click", todoModal);

function todoModal() {

    const todo = document.getElementById("todo");
    todo.style.display = "flex";
}

const div9 = document.getElementById("form");
const addBtn = document.getElementById("add-button");

addBtn.addEventListener("click", function addbtn(event) {
    event.preventDefault();

    const titleInput = document.getElementById("title");
    const title = titleInput.value;

    const addTodoInput = document.getElementById("add-todo");
    const addTodo = addTodoInput.value;

    if (title.trim() !== "" && addTodo.trim() !== "") {

        const li = document.createElement("li");

        const div2 = document.createElement("div");
        div2.classList.add("child-list");

        const span = document.createElement("span");
        span.classList.add("todo-span");
        span.textContent = addTodo;

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("check-box");

        checkBox.addEventListener("change", () => {
            span.style.textDecoration = checkBox.checked ? "line-through" : "none";
        });

        const todoContainer = document.getElementById("todo-container");
        const list = document.getElementById("list");

        div2.appendChild(span);
        div2.appendChild(checkBox);

        li.appendChild(div2);

        list.appendChild(li);

        addTodoInput.value = "";
    }


});



const closeButton = document.getElementById("close-button");

closeButton.addEventListener("click", function closebtn() {
    const todo = document.getElementById("todo");
    todo.style.display = "none";
});

const modal = document.getElementById("todo");
const modalContent = document.getElementById("modal-content");

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

const addButton = document.getElementById("addButton");

addButton.addEventListener("click", addTodoButton);

function addTodoButton() {

    const cardsId = document.getElementById("cards-id");

    const card = document.createElement("div");
    card.classList.add("todo-card");

    const titleInput = document.getElementById("title");
    const title = titleInput.value;

    const titleElem = document.createElement("h3");
    titleElem.textContent = title;
    titleElem.style.border = "2px solid #615ae8ff";
    titleElem.style.borderRadius = "8px";
    titleElem.style.padding = "0.75rem 1rem";
    card.appendChild(titleElem);

    const clonedList = document.createElement("ul");
    clonedList.style.listStyle = "none"; 
    clonedList.style.padding = "0.75rem 1rem 0.75rem";      
    clonedList.style.margin = "0"; 
    clonedList.style.border = "1px solid #615ae8ff";
    clonedList.style.borderRadius = "8px";

    const list = document.getElementById("list");
    Array.from(list.children).forEach(li => {
        const listItem = document.createElement("li");
        listItem.classList.add("listItemNew");

        const img = document.createElement("img");
        
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (checkbox?.checked) {
            img.src = "./images/checked.png";
            listItem.style.textDecoration = "line-through";
        } else {
            img.src = "./images/unChecked.png";
            listItem.style.textDecoration = "none";
        }

        const text = document.createTextNode(li.textContent);

        listItem.appendChild(text);
        listItem.appendChild(img);

        clonedList.appendChild(listItem);
    });

    card.appendChild(clonedList);

    const divButton = document.createElement("div");
    divButton.classList.add("divBtn");

    const clonedDelete = document.createElement("button");
    clonedDelete.textContent = "Delete";
    clonedDelete.classList.add("cardButton");
    divButton.appendChild(clonedDelete);

    const clonedComplete = document.createElement("button");
    clonedComplete.textContent = "Mark Complete";
    clonedComplete.classList.add("cardButton");
    divButton.appendChild(clonedComplete);

    card.appendChild(divButton);

    const clonedUpdate = document.createElement("button");
    clonedUpdate.textContent = "Update ToDo";
    clonedUpdate.classList.add("cardButton1");
    card.appendChild(clonedUpdate);

    const priority = document.querySelector(".priority").value;
    if (priority === "low") {
        card.style.borderRight = "5px solid #22c55e";
    } else if (priority === "medium") {
        card.style.borderRight = "5px solid #facc15";
    } else if (priority === "high") {
        card.style.borderRight = "5px solid #ef4444";
    }

    card.setAttribute("data-priority", priority);

    const div3 = document.createElement("div");

    const createdAtFormatted = document.createElement("h5");
    createdAtFormatted.textContent = new Date(new Date().toISOString()).toLocaleString();
    div3.appendChild(createdAtFormatted);

    const name1 = document.createElement("h5");
    name1.textContent = currentUser.userName;
    div3.appendChild(name1);

    div3.style.display = "flex";
    div3.style.justifyContent = "space-between";

    card.appendChild(div3);
    
    cardsId.appendChild(card);

    const listElement = document.getElementById("list");

const tasks = Array.from(listElement.children).map(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    return {
        text: li.childNodes[0]?.textContent.trim() || "",
        completed: checkbox?.checked || false
    };
});
    const todo = {
        userId: currentUser.id,
    title,
    tasks,
    priority,
    createdAt: new Date().toISOString(),
    userName: currentUser.userName
};


    saveTodo();
    saveTodoToApi(todo);

    modal.style.display = "none";

    document.getElementById("title").value = "";
    document.getElementById("add-todo").value = "";
    document.querySelector(".priority").value = "low"; 
    document.getElementById("list").innerHTML = "";


    
}

function saveTodo() {
  const data = document.querySelectorAll(".todo-card");
  const todos = [];

  data.forEach((card) => {
    const title = card.querySelector("h3").textContent;
    const taskItems = card.querySelectorAll("ul li");

    const tasks = Array.from(taskItems).map((taskItem) => {
      const taskText = taskItem.firstChild?.textContent?.trim() || "";
      const isCompleted = taskItem.style.textDecoration === "line-through";
      return {
        text: taskText,
        completed: isCompleted
      };
    });

    const priority = card.getAttribute("data-priority") || "low";


    const createdAt = card.querySelector("h5")?.textContent || new Date().toLocaleString();
    const userName = card.querySelectorAll("h5")[1]?.textContent || currentUser?.userName || "unknown";

    todos.push({
      title,
      tasks,
      priority,
      createdAt,
      userName
    });
  });

  if (currentUser) {
        localStorage.setItem(`todos_${currentUser.userName}`, JSON.stringify(todos));
    }
}


function loadTodos() {
     if (!currentUser) return;

    const cardsId = document.getElementById("cards-id");
    cardsId.innerHTML = "";

    const savedTodos = localStorage.getItem(`todos_${currentUser.userName}`);
    if (!savedTodos) return;

     const todos = JSON.parse(savedTodos);

    todos.forEach(todo => {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    // Title
    const titleElem = document.createElement("h3");
    titleElem.textContent = todo.title;
    titleElem.style.border = "2px solid #615ae8ff";
    titleElem.style.borderRadius = "8px";
    titleElem.style.padding = "0.75rem 1rem";
    card.appendChild(titleElem);

    // Tasks
    const taskList = document.createElement("ul");
    taskList.style.listStyle = "none";
    taskList.style.padding = "0.75rem 1rem";
    taskList.style.margin = "0";
    taskList.style.border = "1px solid #615ae8ff";
    taskList.style.borderRadius = "8px";

    todo.tasks.forEach(task => {
      const listItem = document.createElement("li");
      listItem.classList.add("listItemNew");

      const img = document.createElement("img");
      img.src = task.completed ? "./images/checked.png" : "./images/unChecked.png";
      listItem.style.textDecoration = task.completed ? "line-through" : "none";

      const text = document.createTextNode(task.text);
      listItem.appendChild(text);
      listItem.appendChild(img);

      taskList.appendChild(listItem);
    });

    card.appendChild(taskList);

    // Buttons
    const divButton = document.createElement("div");
    divButton.classList.add("divBtn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("cardButton");
    divButton.appendChild(deleteBtn);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Mark Complete";
    completeBtn.classList.add("cardButton");
    divButton.appendChild(completeBtn);

    card.appendChild(divButton);

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update ToDo";
    updateBtn.classList.add("cardButton1");
    card.appendChild(updateBtn);

    // Priority border color
    if (todo.priority === "low") {
      card.style.borderRight = "5px solid #22c55e";
    } else if (todo.priority === "medium") {
      card.style.borderRight = "5px solid #facc15";
    } else if (todo.priority === "high") {
      card.style.borderRight = "5px solid #ef4444";
    }

    // Created at and user info
    const div3 = document.createElement("div");
    const createdAtFormatted = document.createElement("h5");
    createdAtFormatted.textContent = todo.createdAt;

    const nameElem = document.createElement("h5");
    nameElem.textContent = todo.userName;

    div3.appendChild(createdAtFormatted);
    div3.appendChild(nameElem);
    div3.style.display = "flex";
    div3.style.justifyContent = "space-between";

    card.appendChild(div3);

    document.getElementById("cards-id").appendChild(card);
  });

  fetch("http://localhost:3000/todos")
  .then(res => res.json())
  .then(apiTodo => {
    apiTodo.forEach(todo => {
        const addTodoInput = document.getElementById("add-todo");
        const addTodo = addTodoInput.value;
        const li = document.createElement("li");

        const div2 = document.createElement("div");
        div2.classList.add("child-list");

        const span = document.createElement("span");
        span.classList.add("todo-span");
        span.textContent = addTodo;

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("check-box");

        checkBox.addEventListener("change", () => {
            span.style.textDecoration = checkBox.checked ? "line-through" : "none";
        });

    });
  });
}

window.addEventListener("DOMContentLoaded", loadTodos);

function saveTodoToApi(todo) {

    fetch ("http://localhost:3000/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Saved to API:", data);
    });
}

