//data manager
const dataModel = (() => {
    let allTasks = {
        "tasks": []
};
    const storeTaskForm = () => {
        let task = {
        "title": document.getElementById('title').value,
        "notes": document.getElementById('notes').value,
        "dueDate": document.getElementById('dueDate').value,
        "priority": document.getElementById('priority').value
        };
        allTasks.tasks.push(task);
        console.log(task.title);
        DOM.displayTask(task);
       return allTasks;
    };

    return {
        storeTaskForm
    };
})();


//DOM view
const DOM = (() => {
    
    const createTask = () => {
        let formList = document.querySelector('.formList');
        formList.style.visibility = "visible";
    };

    const submitTask = () => {
        let formList = document.querySelector('.formList');
        formList.style.visibility = "hidden";
        dataModel.storeTaskForm();
        document.getElementById('form').reset();
    };

    const displayTask = (task) => {
        let displayArea = document.getElementById('main');
        let div = document.createElement('div');
        div.classList.add("divCard");
        div.innerText= `${task.title}
        ${task.notes}
        ${task.dueDate}
        ${task.priority}`;
        displayArea.appendChild(div);
    }

    return {
        createTask,
        submitTask,
        displayTask
    };
})();

export default DOM