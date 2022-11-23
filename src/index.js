
import { DOM, controller } from './modules';

controller.pageLoad();

let createTaskBtn = document.querySelector('.createTask');
createTaskBtn.addEventListener('click', DOM.createTask);

let submitTaskBtn = document.querySelector('.submitTaskBtn');
submitTaskBtn.addEventListener('click', DOM.submitTask);

let cancelTaskBtn = document.querySelector('.cancelTaskBtn');
cancelTaskBtn.addEventListener('click', DOM.cancelTask);

let listedProjects = document.querySelectorAll('.project');
for(let i =0; i < listedProjects.length; i++) {
    listedProjects[i].addEventListener('mouseup', () => { DOM.displaySelectedProject(listedProjects[i]) })
};

let projectTrashIcon = document.querySelectorAll('.projectTrash');
for(let i=0; i < projectTrashIcon.length; i++) {
    projectTrashIcon[i].addEventListener('click', () => { DOM.deleteProject(projectTrashIcon[i]) })

}

let newProject = document.querySelector('.newProject');
newProject.addEventListener('click', DOM.addNewProject);

let cancelProject = document.querySelector('.cancel');
cancelProject.addEventListener('click', DOM.cancelProjectCreation);

let saveProject = document.querySelector('.save');
saveProject.addEventListener('click', controller.saveNewProject);

