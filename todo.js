
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();

function eventListener() {//eventleri ekleme metodu
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodoToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function getTodoFromStorage() { //todos yoksa oluşturuyor ve todos dizisini dönüyor
    let todos;

    if (localStorage.getItem("todos") == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

/*
    function isTodoAvaliable(newTodo) {

    const listItems = document.querySelectorAll(".list-group-item");
    
    listItems.forEach(function (listItem) {
        let text = listItem.textContent;
        text = text.trim();
        newTodo = newTodo.trim();
        console.log(typeof text,typeof newTodo)
        if (text !=  newTodo) {
            return false;
        }
    });
    
    return true;
}
*/


function addTodo(e) {
    const newTodo = todoInput.value.trim(); //boşlukları silip alıyoruz
    if (newTodo === null || newTodo === "") {
        showMessage("danger", "Lütfen bir todo girin !");
    } else {
            addTodoToStorage(newTodo);
            addTodoToUI(newTodo);
            showMessage("success", "Todo Başarıyla Eklendi !");
    }

    e.preventDefault();
}

function loadAllTodoToUI() {//Storage dan UI ye yükleme
    let todos = getTodoFromStorage();

    todos.forEach(element => {
        addTodoToUI(element);
    });
}

function addTodoToStorage(newTodo) { //Todoları storage ekler
    let todos;

    todos = getTodoFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

}

function addTodoToUI(newTodo) {//Arayüze ekeleme metodu

    /*
    --LİSTENİN YAPISI--
    <!-- 
        <li class="list-group-item d-flex justify-content-between">
        Todo 1
        <a href = "#" class ="delete-item"><i class = "fa fa-remove"></i></a>
        </li>-->
    */

    //liste itemini oluşturma
    
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    //link i oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = " <i class = 'fa fa-remove'></i>";
    //liste iteminin içerisine todomuzu ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo liste ıtemı ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";

}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        let todo = e.target.parentElement.parentElement.textContent;
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent.trim());
        showMessage("success", `'${todo}'- Silindi !`);
    }
}


function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodoFromStorage();

    todos.forEach(function (todo, index) {
        //todo = String(todo);
        //deleteTodo = String(deleteTodo);
        if (todo === deleteTodo) {
            todos.splice(index, 1);
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));//yeni listeyi ile storage ı güncelliyoruz
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();//inputtan veriyi alma ve küçük harf yapma
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();//list içinden veriyi alma

        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style", "display: none !important");

        } else {
            listItem.setAttribute("style", "display : block");
        }
    });

}

function clearAllTodos(e) {
    if (confirm("Tüm Todoları silmek istediğinize emin misiniz ?")) {
        //Arayüzden todoları temizleme
        //todoList.innerHTML = ""; //Geçerli fakat yavaş bir yöntem
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        //localstorage ı temizleme
        localStorage.removeItem("todos");

        showMessage("success", "Tüm Todolar Silindi !");
    }
}



function showMessage(type, message) {

    /* <div class="alert alert-danger" role="alert">
    A simple danger alert—check it out!
    </div> */
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);


    setTimeout(function () {
        alert.remove();
    }, 1500);

}