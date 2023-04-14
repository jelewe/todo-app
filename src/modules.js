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
        let displayArea = document.getElementById('main')
        let div = document.createElement('div')
        div.classList.add("divCard")
        div.setAttribute('data-index', task.index)
        if (task.strike === 'none') {
            div.style.textDecorationLine = "none";
        } else {
            div.style.textDecorationLine = "line-through"
        };
        div.innerText= `${task.title}
        Note: ${task.notes}
        Due by ${task.dueDate}
        ${task.priority} priority`;
        let img = document.createElement('img');
        img.classList.add('trash');
        img.src="imgs/trash.svg";
        div.appendChild(img);
        controller.createTrashEventHandler(img);
        img = document.createElement('img');
        img.classList.add('check');
        img.src = "imgs/check.svg";
        div.appendChild(img);
        controller.createTextStrike(img);
        img = document.createElement('img');
        img.classList.add('plus');
        img.src="imgs/plus.svg";
        div.appendChild(img);
        controller.createAddToProject(img);
        img = document.createElement('img');
        img.classList.add('edit');
        img.src="imgs/pencil.svg";
        div.appendChild(img);
        controller.editTask(img);
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
        projectForm.style.visibility = 'hidden';
        document.getElementById('projectForm').reset();
    };

    const addProjectToList = (project) => {
        let parentDiv = document.querySelector('.projectsDiv');
        let childDiv = document.createElement('div');
        childDiv.classList.add('project');
        childDiv.setAttribute('project-type', project.name);
        childDiv.innerText= project.name;
        let img = document.createElement('img');
        img.classList.add('projectTrash');
        img.src="imgs/trash.svg";
        childDiv.append(img);
        img.addEventListener('click' , (e) => deleteProject(e, img));
        childDiv.addEventListener('click', () => displaySelectedProject(childDiv));
        parentDiv.appendChild(childDiv);
        cancelProjectCreation();
    };

    const displaySelectedProject = (listedProject) => {
        let mainDiv = document.getElementById('main');
        while(mainDiv.firstChild) {
            mainDiv.removeChild(mainDiv.firstChild)
        };
        let nameDisplay = document.getElementById('projectNameDisplay');
        nameDisplay.innerText = ""
        let list = listedProject.getAttribute('project-type');
        if (list == "allTasks") {
            nameDisplay.innerText = "All Tasks";
            displayDefaultList()
        } else if (list == "thisWeek") {
            nameDisplay.innerText = "This Week";
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
            nameDisplay.innerText = "This Month";
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
            } else if (list === 'priorityLevel') {
                nameDisplay.innerText = 'High Priority'
                let tasksObj = JSON.parse(localStorage.getItem('allTasks'))
                if (tasksObj.tasks == null) {
                    return
                } else {
                    for (let i = 0; i < tasksObj.tasks.length; i++) {
                        if (tasksObj.tasks[i].priority === 'High') {
                            displayTask(tasksObj.tasks[i])
                        }
                    }
                }
            } else {
                nameDisplay.innerText = list;
                let t = JSON.parse(localStorage.getItem('allTasks'))
                for (let i = 0; i < t.tasks.length; i++) {
                    if (t.tasks[i].list == list) {
                            displayTask(t.tasks[i])
                    }
                }
            }
        };

        const deleteProject = (e, projectTrashIcon) => {
            e.stopImmediatePropagation();
            let projName = projectTrashIcon.parentElement.getAttribute('project-type');
            let projList = dataModel.allTasks.customProjects;
            let nameDisplay = document.getElementById('projectNameDisplay');
            nameDisplay.innerText = "All Tasks";
            let child = projectTrashIcon.parentElement;
            child.remove();
            let mainDiv = document.getElementById('main');
            while(mainDiv.firstChild) {
                mainDiv.removeChild(mainDiv.firstChild)
            };
            for(let i = 0; i < projList.length; i++) {
                if (projList[i].name == projName) {
                    projList.splice(i, 1)
                }
            };
            let taskList = dataModel.allTasks.tasks;
            for (let i =0; i < taskList.length; i++) {
                if (taskList[i].list == projName) {
                    taskList.splice(i, 1)
                }
                controller.updateTaskIndex();
            };
            JSON.parse(localStorage.getItem('allTasks'));
            localStorage.removeItem('allTasks')
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks));
            displayDefaultList();
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
        let index = dataModel.allTasks.tasks.length;
        let task = {
        "title": document.getElementById('title').value,
        "notes": document.getElementById('notes').value,
        "dueDate": document.getElementById('dueDate').value,
        "priority": document.getElementById('priority').value,
        "strike": "none",
        "list": "none",
        "index": index
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
            updateTaskIndex();
            updateCardIndex();
        };
    };

    const updateTaskIndex = () => {
        let t = dataModel.allTasks.tasks
        for(let i = 0; i < t.length; i++) {
            t[i].index = i
        };
        localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    };

    const updateCardIndex = () => {
        let cards = document.querySelectorAll('.divCard');
        Array.from(cards).forEach(function (c) {
            c.setAttribute("data-index", Array.from(cards).indexOf(c));
        });
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

        const editTask =(img) => {
            img.onclick = (e) => {
                let index = img.parentElement.getAttribute('data-index');
                DOM.createTask();
                document.getElementById('title').value = dataModel.allTasks.tasks[index].title;
                document.getElementById('notes').value = dataModel.allTasks.tasks[index].notes;
                document.getElementById('dueDate').value = dataModel.allTasks.tasks[index].dueDate;
                document.getElementById('priority').value = dataModel.allTasks.tasks[index].priority;
                let main = document.querySelector('#main');
                main.removeChild(img.parentElement);
                dataModel.allTasks.tasks.splice(index, 1);
                updateTaskIndex();
                updateCardIndex();
            }
        }
    
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

    const addProjectToStorage = (project) => {
        let list = JSON.parse(localStorage.getItem('allTasks')); 
        if ( list == null) {
            dataModel.allTasks.customProjects.push(project);
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
        } else {
            dataModel.allTasks.customProjects.push(project);
            //localStorage.removeItem('allTasks');
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks));
        };
    };

    const createAddToProject = (img) => {
        img.onclick = (e) => {
            let list = JSON.parse(localStorage.getItem('allTasks'));
            list = list.customProjects
            if (list.length == 0) {
                let div = document.createElement('div');
                div.classList.add('projectAddPopup');
                div.innerText= `Create a Project first
                
                `;
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
        if (taskStorage == null) {
            return
        } else {
            getTasks(taskStorage);
            getProjects(taskStorage);
            localStorage.removeItem('allTasks');
            localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks));
        };
    };

    const getTasks = (taskStorage) => {
        taskStorage = taskStorage.tasks
        if (taskStorage == null) {
            return
        } else {
            for (let i = 0; i< taskStorage.length; i++) {
                dataModel.allTasks.tasks.push(taskStorage[i]) 
            };
            DOM.displayDefaultList();
        };
    };

    const getProjects = (taskStorage) => {
        let projectStorage = taskStorage.customProjects
            if (projectStorage == null) {
                return
            } else {
                for (let i = 0; i< projectStorage.length; i++) { 
                    dataModel.allTasks.customProjects.push(projectStorage[i])
                };
            DOM.displayStoredProjects();
        };
    };

    return {
        storeTaskForm,
        saveNewProject,
        createTrashEventHandler,
        createTextStrike,
        editTask,
        updateTaskIndex,
        createAddToProject,
        pageLoad
    }
})();

export {
    DOM,
    controller
} 