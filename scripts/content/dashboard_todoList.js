"use strict";
//Written by Riley Tyler

//todoListContent object
export const todoListContent = {
    async getContent() {
        const response = await fetch('scripts/content/html/todoList.html');
        const data = await response.text(); 
        
        console.log(data); 
        return data; 
    },

    addHelpers(element) {
        //add helper scripts to html.
        const todoListScript = document.createElement('script');
        todoListScript.src = "scripts/content/helpers/todoList.js";
        element.appendChild(todoListScript);
    }
};