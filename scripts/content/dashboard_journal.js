"use strict";
//Written by Riley Tyler

//todoListContent object
export const journalContent = {
    async getContent() {
        const response = await fetch('scripts/content/html/journal.html');
        const data = await response.text(); 
        
        console.log(data); 
        return data; 
    },

    addHelpers(element) {
        //add helper scripts to html.
        const journalScript = document.createElement('script');
        journalScript.src = "scripts/content/helpers/journal.js";
        element.appendChild(journalScript);
    }
};