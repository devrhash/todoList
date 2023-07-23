import "./styles.css";
import editbutton from "./images/edit-button.png";
import plus from "./images/plus.png";
let task = [];
let tags = [];

let flag = "";
let subTask = [];
let activityLog = [];

window.onload = function () {
  subTask = JSON.parse(localStorage.getItem("subTask"));
  console.log(subTask);
  task = JSON.parse(localStorage.getItem("task"));
  console.log(task);
  create_element(null, null);
};
const create_element = (id, type) => {
  let html = ``;
  for (const x of task) {
    html += `
    <div class="hold" id=${x.title}>
     <div class="list" id=${x.title}>
     <input type="checkbox" class="check" id=${x.title} checked=${x.checked}></input>
    <div class="txt">${x.title}</div>
    <img src="https://i.ibb.co/sFtYxMg/delete.png" class="del" id=${x.title}></img>
    <img src=${editbutton} class="editImg" id=${x.title} alt="?"></img>
    <img src=${plus} class="subTaskImg" id=${x.title}></img>
   </div>`;
    let subHtml = ``;
    for (const y of subTask) {
      if (y.parent === x.title) {
        subHtml += `
         <div class="list1" id=${y.title}>
         <input type="checkbox" class="check" id=${y.title} checked=${y.checked}></input>
          <div class="txt1">${y.title}</div>
         <img src="https://i.ibb.co/sFtYxMg/delete.png" class="del" id=${y.title} alt=${x.title}></img>
         <img src=${editbutton} class="editImg" id=${y.title} alt=${x.title}></img>
        </div>
        `;
      }
      if (y.title === type && x.title === id) {
        let editSubHtml = ``;
        editSubHtml += `<input class="editSub" id="editSubInput"></input>
        <button class="editSubBtn" id=${y.title}>save</button>`;
        subHtml += editSubHtml;
      }
    }
    html += subHtml;
    if (x.title === id && type === null) {
      let inputHtml = ``;

      inputHtml += `<input class="input2" id="input2"></input>
         <button class="save" id=${x.title}>save</button>
       `;
      html += inputHtml;
    }
    html += `<div class="footer">${x.duedate}</div>`;
    html += `</div>`;
  }
  document.getElementById("page").innerHTML = html;

  let image = document.getElementsByClassName("del");

  let editImage = document.getElementsByClassName("editImg");
  let save = document.getElementsByClassName("save");

  let subTaskImg = document.getElementsByClassName("subTaskImg");

  let check = document.getElementsByClassName("check");
  let editSubBtn = document.getElementsByClassName("editSubBtn");
  for (let itr of save) {
    itr.addEventListener("click", saveTask);
  }

  for (let itr of image) {
    itr.onclick = del_pressed;
  }

  for (let itr of editImage) {
    console.log(itr.alt + " " + itr.id);
    if (itr.alt === "?") {
      itr.onclick = editFun;
    } else {
      itr.onclick = editSub;
    }
  }

  for (let itr of subTaskImg) {
    itr.onclick = subtask;
  }

  for (let itr of check) {
    itr.onclick = checkFun;
  }
  for (let itr of editSubBtn) {
    itr.onclick = editSubtask;
  }
};
const editSubtask = (e) => {
  let val = document.getElementById("editSubInput").value;
  let new_array = [];
  for (const x of subTask) {
    if (x.title !== e.target.id) {
      new_array.push(x);
    } else {
      x.title = val;
      new_array.push(x);
    }
  }
  subTask = new_array;
  create_element(task, null, null);
};
const checkFun = (e) => {
  console.log("devraj");
  for (const x of task) {
    if (x.title === e.target.id) {
      x.checked = true;
    }
  }
  for (const y of subTask) {
    if (y.title === e.target.id) {
      y.checked = true;
    }
  }
};
const saveTask = (e) => {
  let activity = "";
  let newSub = {};
  let val = document.getElementById("input2").value;
  newSub.parent = e.target.id;
  newSub.title = val;
  newSub.checked = false;
  activity += "added subtask " + val + "to " + e.target.id;
  activityLog.push(activity);
  subTask.push(newSub);
  localStorage.setItem("subTask", JSON.stringify(subtask));
  create_element(task, null, null);
};
const del_pressed = (e) => {
  console.log(e.target.id);
  let activity = "";
  let rem_id = e.target.id; // Get ID of Clicked Element
  let new_array = [];
  let items = document.getElementsByClassName("hold");
  for (let itr of items) {
    itr.remove();
  }
  for (const x of task) {
    if (x.title !== rem_id) {
      new_array.push(x);
    } else {
      activity += "Deleted task " + e.target.id;
    }
  }
  task = new_array;

  new_array = [];

  let parent = e.target.alt;
  console.log(parent);
  for (const y of subTask) {
    console.log(y);
    if (y.title !== rem_id || y.parent !== parent) {
      new_array.push(y);
    } else {
      activity += "Deleted subtask " + y.title + "from " + parent;
    }
  }

  subTask = new_array;
  localStorage.setItem("subTask", JSON.stringify(subTask));
  activityLog.push(activity);
  create_element(null, null);
};

const editFun = (e) => {
  flag = e.target.id;
  document.getElementById("input1").value = e.target.id;
  document.getElementById("input1").focus();
};
const editSub = (e) => {
  create_element(e.target.alt, e.target.id);
};
const subtask = (e) => {
  let id = e.target.id;
  create_element(id, null);
};

document.getElementById("btn1").addEventListener("click", function () {
  let val = document.getElementById("input1").value;

  let inpCat = document.getElementById("inpCat").value;
  let priority = document.getElementById("priority").value;
  let duedate = document.getElementById("duedate").value;
  let newtask = {};
  newtask.title = val;
  newtask.category = inpCat;
  newtask.checked = false;
  newtask.priority = priority;
  newtask.duedate = duedate;

  if (flag !== "") {
    let new_array = [];
    for (const x of task) {
      if (x.title !== flag) {
        new_array.push(x);
      } else {
        x.title = val;
        for (const y of subTask) {
          if (y.parent === flag) {
            y.parent = val;
          }
        }
        new_array.push(x);
      }
    }
    task = new_array;
  }
  if (val !== "") {
    if (flag === "") {
      task.push(newtask);
    }
    document.getElementById("input1").value = "";
    document.getElementById("inpCat").value = "";
    flag = "";
    localStorage.setItem("task", JSON.stringify(task));
    create_element(null, null);
  }
});

document.getElementById("search").addEventListener("click", function () {
  let val = document.getElementById("searchBar").value;
  console.log(val);
  let temptask = task;
  let result = [];
  for (const x of task) {
    if (x.title === val) {
      console.log("kkjskj");
      result.push(x);
    }
  }

  task = result;
  create_element(null, "search");
  if (result.length === 0) {
    for (const x of subTask) {
      if (x.title === val) {
        for (const y of temptask) {
          if (y.title === x.parent) {
            result.push(y);
            break;
          }
        }
      }
    }
    task = result;
    create_element(null, null);
  }
  if (result.length === 0) {
    result = [];
    for (const x of tags) {
      if (x.title === val) {
        for (const y of temptask) {
          if (x.taskId === y.title) {
            result.push(y);
            break;
          }
        }
      }
    }
    task = result;
    create_element(null, null);
  }
});
document.getElementById("sort").addEventListener("click", function () {
  console.log(task);
  let type = document.getElementById("sorting").value;
  if (type === "duedate") {
    task.sort((a, b) => {
      let d1 = new Date(a.duedate);
      let d2 = new Date(b.duedate);
      if (d1.getTime() < d2.getTime()) {
        console.log("he");
        return 1;
      } else if (d1.getTime() > d2.getTime()) {
        console.log("he");
        return -1;
      } else {
        return 0;
      }
    });
    console.log(task);
    create_element(null, null);
  } else {
    task.sort((a, b) => {
      if (a.priority === "low" && b.priority === "medium") {
        return 1;
      } else if (a.priority === "low" && b.priority === "high") {
        return 1;
      } else if (a.priority === "medium" && b.priority === "high") {
        return 1;
      } else if (a.priority === b.priority) {
        return 0;
      } else {
        return -1;
      }
    });
    console.log(task);
    create_element(null, null);
  }
});

document.getElementById("apply").addEventListener("click", function () {
  let type = document.getElementById("filter").value;
  let val = document.getElementById("filterVal").value;
  let result = [];
  for (const x of task) {
    if (type === "priority") {
      if (x.priority === val) {
        result.push(x);
      }
    } else if (type === "category") {
      if (x.category === val) {
        result.push(x);
      }
    }
  }
  task = result;
  create_element(null, null);
});

document.getElementById("addTag").addEventListener("click", function () {
  let inpTag = document.getElementById("inpTag").value;
  let val = document.getElementById("input1").value;
  document.getElementById("inpTag").value = "";

  tags.push({ title: inpTag, taskId: val });
});

const addOption = (e) => {
  let val = e.target.value;
  console.log(val);
  if (val === "priority") {
    let html = `	<option value="low">low</option>
       <option value="medium">medium</option>
         <option value="high">high</option>`;
    document.getElementById("filterVal").innerHTML = html;
  }
  if (val === "category") {
    let categories = [];
    for (const x of task) {
      categories.push(x.category);
    }
    let html = ``;
    for (const x of categories) {
      html += `<option value=${x}>${x}</option>`;
    }
    document.getElementById("filterVal").innerHTML = html;
  }
};
document.getElementById("filter").addEventListener("focus", addOption);
document.getElementById("filter").addEventListener("change", addOption);
