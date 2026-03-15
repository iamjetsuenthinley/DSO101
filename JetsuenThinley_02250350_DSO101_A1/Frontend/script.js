const API_URL = "http://localhost:5000/tasks"

async function getTasks(){

const res = await fetch(API_URL)
const tasks = await res.json()

const list = document.getElementById("taskList")
list.innerHTML=""

tasks.forEach((task,index)=>{

const li = document.createElement("li")

li.innerHTML = `
${task.name}
<button onclick="deleteTask(${index})">Delete</button>
`

list.appendChild(li)

})

}

async function addTask(){

const input = document.getElementById("taskInput")

await fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name:input.value})
})

input.value=""

getTasks()

}

async function deleteTask(id){

await fetch(API_URL + "/" + id,{
method:"DELETE"
})

getTasks()

}

getTasks()