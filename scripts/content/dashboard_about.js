"use strict";
//Written by Riley Tyler

//aboutContent object
export const aboutContent = {
    async getContent() {
        const response = await fetch('scripts/content/html/about.html');
        const data = await response.text(); 
        
        console.log(data); 
        return data; 
    }
};