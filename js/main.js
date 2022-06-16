const Main = {

    tasks:[],
 
    init: function(){     
        this.cacheSelectors();
        this.bindEvents();
        //Função para obter o que estiver armazenado no storage
        this.getStoraged()
        this.buildTasks()

    },
 
    /* seleciona os elementos html e armazena em variáveis
        torna a variável acessivel em todo o objeto
        cria um array com cada item encontrado. 
        */
    cacheSelectors: function(){
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')

    },
   
    bindEvents: function() {
        const self = this; //this = objeto Main
        /* 
        percorre todos os botões doa array para aplicar a função. 
        Cada função recebe uma variável para cada item do array.
        this dentro do forEach se refere ao window
        adiciona eventos aos elementos html armazenados em variáveis. 
        */
        this.$checkButtons.forEach(function(button) {
            button.onclick = self.Events.checkButtons_click.bind(self)
            })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button) {
            button.onclick = self.Events.removeButtons_click.bind(self)
        })

    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')
        //escopo do obj
        if (tasks) {
            this.tasks = JSON.parse(tasks) //constante
        } else {
            localStorage.setItem('tasks', JSONstringify([]))
        }
    },

    getTaskHtml: function(task, isDone) {
        return `
            <li class="${isDone ? 'done' : ''}" data-task="${task}">
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove"></button>
            </li>
        `  
    },

    insertHTML: function(element, htmlString){
        element.innerHTML += htmlString

        this.cacheSelectors();
        this.bindEvents();
    },
    
    buildTasks: function() {
        //pegar as tarefas e montar na tela
        let html = ''
        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task, item.done)
        })

        this.insertHTML(this.$list, html)
    },

    Events: {
        //cria os eventos
        checkButtons_click: function(e) {
            //encontra o elemento pai de onde ocorreu o evento
            const li = e.target.parentElement
            const value = li.dataset['task']
            const isDone = li.classList.contains('done')
        
            const newTasksState = this.tasks.map(item => {
                if (item.task === value) {
                    item.done = !isDone
                }
                return item
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            if (!isDone) {
                return li.classList.add('done')
            }
            li.classList.remove('done')
        },

        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            if(key === "Enter") {
                const taskHtml = this.getTaskHtml(value, isDone)
                //modifica a árvore html, renderiza todos os elementos e adiciona algo no final
                this.insertHTML(this.$list, taskHtml)

                e.target.value = ''
                
                //adiciona tarefas ao localStorage
                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                const arrTasks = [
                    {task: value, done: isDone},
                    ...savedTasksArr, //spread operator
            ]

            const jsonTasks = JSON.stringify(arrTasks)

            this.tasks = arrTasks
            localStorage.setItem('tasks', jsonTasks)

            }
        },

        removeButtons_click: function(e) {
            const li = e.target.parentElement
            const value = li.dataset['task']

            console.log(this.tasks)

            const newTasksState = this.tasks.filter(item => {
                return item.task !== value
            })
            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            this.tasks = newTasksState

            li.classList.add('removed')

            setTimeout(function () {
                li.classList.add('hidden')
            }, 300)
        },

    }

}

Main.init();
