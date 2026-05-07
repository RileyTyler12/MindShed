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
        //add user settings helper script to html.
        const userSettingsScript = document.createElement('script');
        userSettingsScript.src = "scripts/content/helpers/userSettings.js";
        element.appendChild(userSettingsScript);

        //add additional helper scripts to html.
        const todoListScript = document.createElement('script');
        todoListScript.src = "scripts/content/helpers/todoList.js";
        element.appendChild(todoListScript);
    }
};