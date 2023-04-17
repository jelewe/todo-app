import { parseISO } from 'date-fns'

const dataModel = (() => {
  const allTasks = {
    tasks: [],
    customProjects: []
  }

  return {
    allTasks
  }
})()

const DOM = (() => {
  // task-based functions*****************************************************
  const createTask = () => {
    const formList = document.querySelector('.formList')
    formList.style.visibility = 'visible'
  }

  const submitTask = () => {
    const formList = document.querySelector('.formList')
    formList.style.visibility = 'hidden'
    controller.storeTaskForm()
    document.getElementById('form').reset()
  }

  const cancelTask = () => {
    const formList = document.querySelector('.formList')
    formList.style.visibility = 'hidden'
    document.getElementById('form').reset()
  }

  const displayTask = (task) => {
    const displayArea = document.getElementById('main')
    const div = document.createElement('div')
    div.classList.add('divCard')
    div.setAttribute('data-index', task.index)
    if (task.strike === 'none') {
      div.style.textDecorationLine = 'none'
    } else {
      div.style.textDecorationLine = 'line-through'
    };
    div.innerText = `${task.title}
        Note: ${task.notes}
        Due by ${task.dueDate}
        ${task.priority} priority`
    let img = document.createElement('img')
    img.classList.add('trash')
    img.src = 'imgs/trash.svg'
    img.alt = 'delete'
    img.setAttribute('role', 'button')
    div.appendChild(img)
    controller.createTrashEventHandler(img)
    img = document.createElement('img')
    img.classList.add('check')
    img.src = 'imgs/check.svg'
    img.alt = 'mark as completed'
    img.setAttribute('role', 'button')
    div.appendChild(img)
    controller.createTextStrike(img)
    img = document.createElement('img')
    img.classList.add('plus')
    img.src = 'imgs/plus.svg'
    img.alt = 'add to project'
    img.setAttribute('role', 'button')
    div.appendChild(img)
    controller.createAddToProject(img)
    img = document.createElement('img')
    img.classList.add('edit')
    img.src = 'imgs/pencil.svg'
    img.alt = 'edit'
    img.setAttribute('role', 'button')
    div.appendChild(img)
    controller.editTask(img)
    displayArea.appendChild(div)
  }

  const displayDefaultList = () => {
    for (let i = 0; i < dataModel.allTasks.tasks.length; i++) {
      displayTask(dataModel.allTasks.tasks[i])
    };
  }

  // project-based functions***************************************************

  const displayStoredProjects = () => {
    for (let i = 0; i < dataModel.allTasks.customProjects.length; i++) {
      addProjectToList(dataModel.allTasks.customProjects[i])
    };
  }

  const addNewProject = () => {
    const projectForm = document.querySelector('.projectList')
    projectForm.style.visibility = 'visible'
    const createProjDiv = document.querySelector('.newProject')
    createProjDiv.style.backgroundColor = 'peachpuff'
    createProjDiv.style.fontWeight = '700'
  }

  const cancelProjectCreation = () => {
    const projectForm = document.querySelector('.projectList')
    projectForm.style.visibility = 'hidden'
    document.getElementById('projectForm').reset()
    const createProjDiv = document.querySelector('.newProject')
    createProjDiv.style.backgroundColor = ''
    createProjDiv.style.fontWeight = ''
  }

  const addProjectToList = (project) => {
    const parentDiv = document.querySelector('.projectsDiv')
    const child = document.createElement('button')
    child.classList.add('project')
    child.setAttribute('project-type', project.name)
    child.innerText = project.name
    const img = document.createElement('img')
    img.classList.add('projectTrash')
    img.src = 'imgs/trash.svg'
    img.alt = 'delete'
    img.setAttribute('role', 'button')
    child.append(img)
    img.addEventListener('click', (e) => deleteProject(e, img))
    child.addEventListener('click', () => displaySelectedProject(child))
    parentDiv.appendChild(child)
    cancelProjectCreation()
  }

  const highlightSelectedProj = (list) => {
    const projDivs = document.getElementsByClassName('project')
    for (let i = 0; i < projDivs.length; i++) {
      const projAttr = projDivs[i].getAttribute('project-type')
      if (projAttr === list) {
        projDivs[i].style.backgroundColor = 'peachpuff'
        projDivs[i].style.fontWeight = '700'
      } else {
        projDivs[i].style.backgroundColor = 'var(--secondcolor)'
        projDivs[i].style.fontWeight = '400'
      }
    }
  }

  const displaySelectedProject = (listedProject) => {
    // remove tasks from mainContent area
    const mainDiv = document.getElementById('main')
    while (mainDiv.firstChild) {
      mainDiv.removeChild(mainDiv.firstChild)
    };
    const nameDisplay = document.getElementById('projectNameDisplay')
    const list = listedProject.getAttribute('project-type')
    highlightSelectedProj(list)
    // then display tasks froom selected project and update nameDisplay
    if (list === 'allTasks') {
      nameDisplay.innerText = 'All Tasks'
      displayDefaultList()
    } else if (list === 'thisWeek') {
      nameDisplay.innerText = 'This Week'
      const tasksObj = JSON.parse(localStorage.getItem('allTasks'))
      if (tasksObj == null) {

      } else {
        for (let i = 0; i < tasksObj.tasks.length; i++) {
          const currentDate = new Date()
          const diff = (parseISO(tasksObj.tasks[i].dueDate).getTime() - currentDate.getTime()) / 86400000
          if (diff <= 7 && diff >= -1) {
            displayTask(tasksObj.tasks[i])
          }
        }
      }
    } else if (list === 'thisMonth') {
      nameDisplay.innerText = 'This Month'
      const tasksObj = JSON.parse(localStorage.getItem('allTasks'))
      if (tasksObj == null) {

      } else {
        for (let i = 0; i < tasksObj.tasks.length; i++) {
          const currentMonth = new Date().getMonth()
          const taskMonth = parseISO(tasksObj.tasks[i].dueDate).getMonth()
          if (currentMonth == taskMonth) {
            displayTask(tasksObj.tasks[i])
          }
        }
      }
    } else if (list === 'priorityLevel') {
      nameDisplay.innerText = 'High Priority'
      const tasksObj = JSON.parse(localStorage.getItem('allTasks'))
      if (tasksObj.tasks == null) {

      } else {
        for (let i = 0; i < tasksObj.tasks.length; i++) {
          if (tasksObj.tasks[i].priority === 'High') {
            displayTask(tasksObj.tasks[i])
          }
        }
      }
    } else {
      nameDisplay.innerText = list
      const t = JSON.parse(localStorage.getItem('allTasks'))
      for (let i = 0; i < t.tasks.length; i++) {
        if (t.tasks[i].list === list) {
          displayTask(t.tasks[i])
        }
      }
    }
  }

  const deleteProject = (e, projectTrashIcon) => {
    e.stopImmediatePropagation()
    const projName = projectTrashIcon.parentElement.getAttribute('project-type')
    const projList = dataModel.allTasks.customProjects
    const nameDisplay = document.getElementById('projectNameDisplay')
    nameDisplay.innerText = 'All Tasks'
    const child = projectTrashIcon.parentElement
    child.remove()
    const mainDiv = document.getElementById('main')
    while (mainDiv.firstChild) {
      mainDiv.removeChild(mainDiv.firstChild)
    };
    for (let i = 0; i < projList.length; i++) {
      if (projList[i].name == projName) {
        projList.splice(i, 1)
      }
    };
    const taskList = dataModel.allTasks.tasks
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].list == projName) {
        taskList.splice(i, 1)
      }
      controller.updateTaskIndex()
    };
    JSON.parse(localStorage.getItem('allTasks'))
    localStorage.removeItem('allTasks')
    localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    displayDefaultList()
  }

  return {
    createTask,
    submitTask,
    cancelTask,
    displayTask,
    displayDefaultList,
    highlightSelectedProj,
    displayStoredProjects,
    addNewProject,
    cancelProjectCreation,
    addProjectToList,
    displaySelectedProject,
    deleteProject
  }
})()

const controller = (() => {
  // task-based functions*************************************
  const storeTaskForm = () => {
    const index = dataModel.allTasks.tasks.length
    const task = {
      title: document.getElementById('title').value,
      notes: document.getElementById('notes').value,
      dueDate: document.getElementById('dueDate').value,
      priority: document.getElementById('priority').value,
      strike: 'none',
      list: 'none',
      index
    }
    addTaskToStorage(task)
    DOM.displayTask(task)
  }

  const addTaskToStorage = (task) => {
    dataModel.allTasks.tasks.push(task)
    JSON.parse(localStorage.getItem('allTasks'))
    localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
  }

  const createTrashEventHandler = (img) => {
    img.onclick = (e) => {
      const index = img.parentElement.getAttribute('data-index')
      const main = document.querySelector('#main')
      main.removeChild(img.parentElement)
      dataModel.allTasks.tasks.splice(index, 1)
      updateTaskIndex()
      updateCardIndex()
    }
  }

  const updateTaskIndex = () => {
    const t = dataModel.allTasks.tasks
    for (let i = 0; i < t.length; i++) {
      t[i].index = i
    };
    localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
  }

  const updateCardIndex = () => {
    const cards = document.querySelectorAll('.divCard')
    Array.from(cards).forEach(function (c) {
      c.setAttribute('data-index', Array.from(cards).indexOf(c))
    })
  }

  const createTextStrike = (img) => {
    img.onclick = (e) => {
      const card = img.parentElement
      const index = img.parentElement.getAttribute('data-index')
      const o = dataModel.allTasks.tasks[index]
      if (card.style.textDecorationLine == 'none') {
        card.style.textDecorationLine = 'line-through'
        o.strike = 'strike'
      } else {
        card.style.textDecorationLine = 'none'
        o.strike = 'none'
      };

      localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    }
  }

  const saveTaskToProject = (img, buttonS, sel) => {
    buttonS.onclick = (e) => {
      const index = img.parentElement.getAttribute('data-index')
      const t = dataModel.allTasks.tasks[index]
      const selected = sel.value
      const proj = dataModel.allTasks.customProjects
      for (let i = 0; i < proj.length; i++) {
        if (proj[i].name == selected) {
          t.list = selected
        }
        localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
      }
      const currentDiv = buttonS.parentElement
      const parent = currentDiv.parentElement
      parent.removeChild(currentDiv)
    }
  }

  const editTask = (img) => {
    img.onclick = (e) => {
      const index = img.parentElement.getAttribute('data-index')
      DOM.createTask()
      document.getElementById('title').value = dataModel.allTasks.tasks[index].title
      document.getElementById('notes').value = dataModel.allTasks.tasks[index].notes
      document.getElementById('dueDate').value = dataModel.allTasks.tasks[index].dueDate
      document.getElementById('priority').value = dataModel.allTasks.tasks[index].priority
      const main = document.querySelector('#main')
      main.removeChild(img.parentElement)
      dataModel.allTasks.tasks.splice(index, 1)
      updateTaskIndex()
      updateCardIndex()
    }
  }

  const cancelTaskToProjectHandler = (buttonC) => {
    buttonC.onclick = (e) => {
      const currentDiv = buttonC.parentElement
      const parent = currentDiv.parentElement
      parent.removeChild(currentDiv)
    }
  }

  // project-based functions*******************************************************************

  const saveNewProject = () => {
    const project = {
      name: document.getElementById('projectName').value
    }
    addProjectToStorage(project)
    DOM.addProjectToList(project)
  }

  const addProjectToStorage = (project) => {
    const list = JSON.parse(localStorage.getItem('allTasks'))
    if (list == null) {
      dataModel.allTasks.customProjects.push(project)
      localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    } else {
      dataModel.allTasks.customProjects.push(project)
      // localStorage.removeItem('allTasks');
      localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    };
  }

  const createAddToProject = (img) => {
    img.onclick = (e) => {
      // check if div already is displaying projectAddPopup, and if so, return
      for (let i = 0; i < img.parentElement.children.length; i++) {
        if (img.parentElement.children[i].classList.contains('projectAddPopup')) {
          return
        }
      }
      // otherwise, add the appropriate div
      let list = JSON.parse(localStorage.getItem('allTasks'))
      list = list.customProjects
      // if no custom projects exist, tell uer to create one
      if (list.length === 0) {
        const div = document.createElement('div')
        div.classList.add('projectAddPopup')
        div.innerText = `Create a Project first
                
                `
        img.parentElement.appendChild(div)
        const buttonC = document.createElement('button')
        buttonC.classList.add('.cancelTaskToProjectBtn')
        buttonC.innerText = 'Cancel'
        div.appendChild(buttonC)
        cancelTaskToProjectHandler(buttonC)
        // else display list of custom projects
      } else {
        const div = document.createElement('div')
        div.classList.add('projectAddPopup')
        div.innerText = `Select a project to add this task to:

                `
        img.parentElement.appendChild(div)
        const sel = document.createElement('select')
        for (let i = 0; i < list.length; i++) {
          const opt = document.createElement('option')
          opt.value = list[i].name
          opt.text = list[i].name
          sel.add(opt)
        }
        div.appendChild(sel)
        const buttonS = document.createElement('button')
        buttonS.classList.add('.addTaskToProjectBtn')
        buttonS.innerText = 'Submit'
        div.appendChild(buttonS)
        saveTaskToProject(img, buttonS, sel)
        const button = document.createElement('button')
        button.classList.add('.cancelTaskToProjectBtn')
        button.innerText = 'Cancel'
        div.appendChild(button)
        cancelTaskToProjectHandler(button)
        return sel
      }
    }
  }

  const pageLoad = () => {
    DOM.highlightSelectedProj('allTasks')
    const taskStorage = JSON.parse(localStorage.getItem('allTasks'))
    if (taskStorage == null) {
      return
    } else {
      getTasks(taskStorage)
      getProjects(taskStorage)
      localStorage.removeItem('allTasks')
      localStorage.setItem('allTasks', JSON.stringify(dataModel.allTasks))
    };
  }

  const getTasks = (taskStorage) => {
    taskStorage = taskStorage.tasks
    if (taskStorage == null) {
      return
    } else {
      for (let i = 0; i < taskStorage.length; i++) {
        dataModel.allTasks.tasks.push(taskStorage[i])
      };
      DOM.displayDefaultList()
    };
  }

  const getProjects = (taskStorage) => {
    const projectStorage = taskStorage.customProjects
    if (projectStorage == null) {
      return
    } else {
      for (let i = 0; i < projectStorage.length; i++) {
        dataModel.allTasks.customProjects.push(projectStorage[i])
      };
      DOM.displayStoredProjects()
    };
  }

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
})()

export {
  DOM,
  controller
}
