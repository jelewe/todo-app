import { parseISO } from "date-fns";

const dataModel = (() => {
    let allTasks = {
        "tasks": [],
        "customProjects": []
    };

    return {
        allTasks
    };
})();


const DOM = (() => {

    //task-based functions*****************************************************
    const createTask = () => {
        let formList = document.querySelector('.formList');
        formList.style.visibility = "visible";
    };

    const submitTask = () => {
        let formList = document.querySelector('.formList');
        formList.style.visibility = "hidden";
        controller.storeTaskForm();
        document.getElementById('form').reset();
    };

    const cancelTask = () => {
        let formList = document.querySelector('.formList');
        formList.style.visibility = "hidden";
        document.getElementById('form').reset();
    };

    const displayTask = (task) => {
        let displayArea = document.getElementById('main');
        let div = document.createElement('div');
        div.classList.add("divCard");
        div.setAttribute('data-index', dataModel.allTasks.tasks.indexOf(task));
        if (task.strike == "none") {
            div.style.textDecorationLine = "none";
        } else {
            div.style.textDecorationLine = "line-through"
        };
        div.innerText= `${task.title}
        ${task.notes}
        ${task.dueDate}
        ${task.priority}`;
        let img = document.createElement('img');
        img.classList.add('trash');
        img.src="../src/imgs/trash.svg";
        div.appendChild(img);
        controller.createTrashEventHandler(img);
        img = document.createElement('img');
        img.classList.add('check');
        img.src="../src/imgs/check.svg";
        div.appendChild(img);
        controller.createTextStrike(img);
        img = document.createElement('img');
        img.classList.add('plus');
        img.src="../src/imgs/plus.svg";
        div.appendChild(img);
        controller.createAddToProject(img);
        displayArea.appendChild(div);
    };

    const displayDefaultList = () => {
        for(let i=0; i< dataModel.allTasks.tasks.length; i++) {
            displayTask(dataModel.allTasks.tasks[i])
        };
    };

    //project-based functions***************************************************

    const displayStoredProjects = () => {
        for(let i=0; i< dataModel.allTasks.customProjects.length; i++) {
            addProjectToList(dataModel.allTasks.customProjects[i])
        };
    };

    const addNewProject = () => {
        let projectForm = document.querySelector('.projectList');
        projectForm.style.visibility= "visible";
    };

    const cancelProjectCreation = () => {
        let projectForm = document.querySelector('.projectList');
        projectForm.style.visibility = "hidden";
        document.getElementById('projectForm').reset();
    };

    const addProjectToList = (project) => {
        let parentDiv = document.querySelector('.projectsDiv');
        let childDiv = document.createElement('div');
        childDiv.classList.add('project');
        childDiv.setAttribute('project-type', project.name);
        childDiv.innerText= project.name;
        parentDiv.appendChild(childDiv);
        cancelProjectCreation();
    };

    const displaySelectedProject = (listedProject) => {
        let mainDiv = document.getElementById('main');
        while(mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild)
        };
        let list = listedProject.getAttribute('project-type');
        if (list == "allTasks") {
            displayDefaultList()
        } else if (list == "thisWeek") {
            let tasksObj = JSON.parse(localStorage.getItem('allTasks'));
            if (tasksObj == null) {
                return
            } else {
                for (let i = 0; i< tasksObj.tasks.length; i++) {
                    let currentDate = new Date();
                    let diff = (parseISO(tasksObj.tasks[i].dueDate).getTime() - currentDate.getTime()) / 86400000;
                    if (diff <= 7 && diff >= -1) {
                        displayTask(tasksObj.tasks[i])
                    }
                }
            }
        } else if (list == "thisMonth") {
            let tasksObj = JSON.parse(localStorage.getItem('allTasks'));
            if (tasksObj == null) {
                return
            } else {
                for (let i = 0; i< tasksObj.tasks.length; i++) {
                        let currentMonth = new Date().getMonth()
                        let taskMonth = parseISO(tasksObj.tasks[i].dueDate).getMonth();
                        if (currentMonth == taskMonth) {
                            displayTask(tasksObj.tasks[i])
                        }
                    }
                }
            } else if (list == "priorityLevel") {
                let tasksObj = JSON.parse(localStorage.getItem('allTasks'));
                if (tasksObj == null) {
                    return
                } else {
                    for (let i = 0; i< tasksObj.tasks.length; i++) {
                        if (tasksObj.tasks[i].priority == "high") {
                            displayTask(tasksObj.tasks[i])
                        }
                    }
                }
            } else {
                let t = JSON.parse(localStorage.getItem('allTasks'));
                for (let i = 0; i< t.tasks.length; i++) {
                    if (t.tasks[i].list == list) {
                            displayTask(t.tasks[i])
                    }
                }
            }
        };

        const deleteProject = (projectTrashIcon) => {
            console.log(projectTrashIcon.parentElement)

        }


    return {
        createTask,
        submitTask,
        cancelTask,
        displayTask,
        displayDefaultList,
        displayStoredProjects,
        addNewProject,
        cancelProjectCreation,
        addProjectToList,
        displaySelectedProject,
        deleteProject
    };
})();

const controller = (() => {

    //task-based functions*************************************
    const storeTaskForm = () => {
        let task = {
        "title": document.getElementById('title').value,
        "notes": document.getElementById('notes').value,
        "dueDate": document.getElementById('dueDate').value,
        "priority": document.getElementById('priority').value,
        "strike": "none",
        "list": "none"
        };
        addTaskToStorage(task);
        DOM.displayTask(task);
    };

    const addTaskToStorage = (task) => {
        dataModel.allTasks.tasks.push(task);
        JSON.parse(localStorage.getItem('allTasks'));
        localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    };

    const createTrashEventHandler = (img) => {
        img.onclick = (e) => {
            let index = img.parentElement.getAttribute('data-index');
            let main = document.querySelector('#main');
            main.removeChild(img.parentElement);
            dataModel.allTasks.tasks.splice(index, 1);
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
            let cards = document.querySelectorAll('.divCard');
            Array.from(cards).forEach(function (c) {
                c.setAttribute("data-index", Array.from(cards).indexOf(c));
            });
        };
    };

    const createTextStrike = (img) => {
        img.onclick = (e) => {
            let card = img.parentElement;
            let index = img.parentElement.getAttribute('data-index');
            let o = dataModel.allTasks.tasks[index];
            if (card.style.textDecorationLine == "none") {
                card.style.textDecorationLine = "line-through";
                o.strike = "strike";
            } else {
                card.style.textDecorationLine = "none";
                o.strike = "none"
            };
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
        };
    };

        const saveTaskToProject = (img, buttonS, sel) => {
            buttonS.onclick = (e) => {
                let index = img.parentElement.getAttribute('data-index');
                let t = dataModel.allTasks.tasks[index]; 
                let selected = sel.value
                let proj = dataModel.allTasks.customProjects
                for (let i=0; i< proj.length; i++) {
                    if (proj[i].name == selected) {
                        t.list = selected
                    }
                    localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
                }
                let currentDiv = buttonS.parentElement;
                let parent = currentDiv.parentElement;
                parent.removeChild(currentDiv)
            };
        };
    
        const cancelTaskToProjectHandler = (buttonC) => {
            buttonC.onclick = (e) => {
                let currentDiv = buttonC.parentElement;
                let parent = currentDiv.parentElement;
                parent.removeChild(currentDiv)
            };
        };

    //project-based functions*******************************************************************

    const saveNewProject = () => {
        let project = {
            "name": document.getElementById('projectName').value,
        };
        addProjectToStorage(project);
        DOM.addProjectToList(project);
    };


//this needs to be reworked or removed to eliminate projectListObj -- should be fixed, this code might eb able to be consolidated???? looks redundant
    const addProjectToStorage = (project) => {
        let list = JSON.parse(localStorage.getItem('allTasks')); 
        list = list.customProjects;
        if ( list == null) {
            dataModel.allTasks.customProjects.push(project);
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
        } else {
            dataModel.allTasks.customProjects.push(project);
            localStorage.removeItem('allTasks');
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks));
        };
    };

    const createAddToProject = (img) => {
        img.onclick = (e) => {
            let list = JSON.parse(localStorage.getItem('allTasks'));
            list = list.customProjects
            if (list == null) {
                let div = document.createElement('div');
                div.classList.add('projectAddPopup');
                div.innerText= "Create a Project first";
                img.parentElement.appendChild(div);
                let buttonC = document.createElement('button');
                buttonC.classList.add('.cancelTaskToProjectBtn');
                buttonC.innerText="Cancel";
                div.appendChild(buttonC);
                cancelTaskToProjectHandler(buttonC);
            } else {
                let div = document.createElement('div');
                div.classList.add('projectAddPopup');
                div.innerText=`Select a project to add this task to:
                `;
                img.parentElement.appendChild(div);
                let sel = document.createElement("select")
                for (let i=0; i< list.length; i++) { 
                    let opt = document.createElement("option");
                    opt.value = list[i].name; 
                    opt.text = list[i].name; 
                    sel.add(opt)
                }
                div.appendChild(sel);
                let buttonS = document.createElement('button');
                buttonS.classList.add('.addTaskToProjectBtn');
                buttonS.innerText="Submit";
                div.appendChild(buttonS);
                saveTaskToProject(img, buttonS, sel);
                let button = document.createElement('button');
                button.classList.add('.cancelTaskToProjectBtn');
                button.innerText="Cancel";
                div.appendChild(button);
                cancelTaskToProjectHandler(button);
                return sel
            }
        }
    };

    const pageLoad = () => {
        let taskStorage = JSON.parse(localStorage.getItem('allTasks'));
        let projectStorage = taskStorage.customProjects 
        taskStorage = taskStorage.tasks
        if (taskStorage == null) {
            return
        } else {
            for (let i = 0; i< taskStorage.length; i++) {
                dataModel.allTasks.tasks.push(taskStorage[i]) 
            };
            DOM.displayDefaultList();
        };
        if (projectStorage == null) {
            return
        } else {
            for (let i = 0; i< projectStorage.length; i++) { 
                dataModel.allTasks.customProjects.push(projectStorage[i])
            };
            DOM.displayStoredProjects();
        };
        localStorage.removeItem('allTasks');
        localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks));
    };

    return {
        storeTaskForm,
        saveNewProject,
        createTrashEventHandler,
        createTextStrike,
        createAddToProject,
        pageLoad
    }
})();

export {
    DOM,
    controller
} 