console.log("test for script file!!");

function registerUser(event){
    event.preventDefault(); //prevent page from endless refresh


    let fullName= document.getElementById("full-name").value;
    let userName = document.getElementById("user-name").value;
    let password= document.getElementById("password").value; //getting the variables from htlm elements

    let formdata= new FormData();
    formdata.append("full-name",fullName);
    formdata.append("user-name",userName);
    formdata.append("password",password);
    //sending data to php
    fetch("register.php",{
        method: "POST",
        body: formdata

    }).then(response=> response.text()) //turning the response we got from php to readable text that turns to 'data' which we use to check the mesage
    .then(data=>{ 
        alert(data);//alert to user 
        if(data.includes("registration succesful")){
            window.location.href="index.html"; //directing user to log in after register(automatic instead manual)
        }

    }).catch(error=>console.error("registration error: ",error));
}
//doing a similar thing with login function
function loginUser(event){
    event.preventDefault();

    let userName=document.getElementById("user-name").value;
    let password=document.getElementById("password").value;
   
    let formdata=new FormData();
    formdata.append("user-name",userName);
    formdata.append("password",password);
    

    fetch("login.php",{
        method: "POST",
        body: formdata
    }).then(response=>response.text()).then(data=> {
        alert(data);
        if(data.includes("login succesful")){

            window.location.href="dashboard.html";
        }
    }).catch(error=>console.error("login error: ",error));

}
function logoutUser(){
    window.location.href="logout.php";

}

document.addEventListener("DOMContentLoaded", ()=> {
    
    loadTasks() ;
});


const taskList =document.querySelector(".task-list");
const taskDetailsTitle =document.querySelector(".task-details-section h2");
const taskDetailsContent =document.querySelector(".task-content");
const taskCreatedDate =document.querySelector(".task-created");
const addTaskBtn =document.querySelector(".add-task-btn");
const filterDropdown =document.querySelector(".filter-dropdown");
const deleteTaskBtn =document.querySelector(".delete-task-btn");


addTaskBtn.addEventListener("click", ()=> {
    let tasks= JSON.parse(localStorage.getItem("tasks")) || [];//turning to javascript object notation with json
    let taskId= tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    let newTask={
        id: taskId,
        title: `Task ${taskId}`,
        content: "",//we do for to place holdr to remain
        completed: false
    };
    tasks.push(newTask);//pushing the new default task 
    localStorage.setItem("tasks", JSON.stringify(tasks));//setting the new task for local storage with its id 

    renderTasks();
});


function renderTasks(filter ="all") {//filter as parameteredd to show after if completed or pending
    taskList.innerHTML="";//reaching the html file by the element
    let tasks= JSON.parse(localStorage.getItem("tasks")) || [];
    
    tasks.forEach(task => {

        if (filter==="completed" && !task.completed) return;
        if (filter==="pending" && task.completed) return;

        let taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.dataset.id=task.id;
        taskItem.innerHTML= `
            <span class="task-title">${task.title}</span>
            <button class="check-done">
                <img src="assets/${task.completed ? "checked" : "check"}.svg" alt="Check">
            </button>
        `;
        
        
        taskItem.addEventListener("click", () => selectTask(task.id));//changing color of the item
        
       
        taskItem.querySelector(".check-done").addEventListener("click", (e) => {
            //changing the status to completed when clicked
            e.stopPropagation();
            toggleTaskComplete(task.id);
        });

        taskList.appendChild(taskItem);
    });
}

function selectTask(taskId) {//selecting and showing the details of the selected item
    let tasks=JSON.parse(localStorage.getItem("tasks")) || [];
    let task=tasks.find(t => t.id==taskId);//deciding whicvh task selected according to id
    
    if (!task) return

    
    document.querySelectorAll(".task-item" ).forEach(el => el.classList.remove("selected"));//removing selected trait from all items

    
    let selectedTask=document.querySelector(`.task-item[data-id="${taskId}"]`);//adding selected trait to selected item
    if (selectedTask) {
        selectedTask.classList.add("selected") ;
    }

    
    taskDetailsTitle.textContent= task.title;//updating task details 
    taskDetailsContent.value=task.content;
    taskCreatedDate.textContent= `Created on ${new Date().toLocaleDateString()} `;

    
    taskDetailsContent.addEventListener("input", () => {//saving task details to local storage
        task.content= taskDetailsContent.value;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });
}



function toggleTaskComplete(taskId) {//function to change the status to complete (called in rendertasks function)
    let tasks= JSON.parse(localStorage.getItem("tasks")) || [];
    let task= tasks.find(t => t.id == taskId);
    
    if (!task) return;

    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}


filterDropdown.addEventListener("change", (e) => {//filtering according to value based on rendering just the selected stated items
    renderTasks(e.target.value);
});


function loadTasks() {//when page işs refreshed  or new task added loading the tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    //render tasks if any task is added before 
    if (tasks.length > 0) {
        renderTasks();
    }
}


deleteTaskBtn.addEventListener("click", () => {//add event listnere to delete icon
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let selectedTask = tasks.find(t => t.title === taskDetailsTitle.textContent);
    
    if (!selectedTask) return;//if no item return
    
    tasks = tasks.filter(t => t.id !== selectedTask.id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    
    if (tasks.length > 0) {//if no selected item delete first one on the lsit
        selectTask(tasks[0].id);
    } else {
        taskDetailsTitle.textContent = "No Task Selected";
        taskDetailsContent.value = "";
        taskCreatedDate.textContent = "";
    }

    renderTasks();//render again to see which tasks remained
});