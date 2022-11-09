console.log("Hello!")

import { formatISO } from 'date-fns'
import DOM from './modules'

let createTaskBtn = document.querySelector('.createTask');
createTaskBtn.addEventListener('click', DOM.createTask);

let submitTaskBtn = document.querySelector('.submitTaskBtn');
submitTaskBtn.addEventListener('click', DOM.submitTask);
