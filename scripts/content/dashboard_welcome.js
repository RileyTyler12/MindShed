"use strict";
//Written by Riley Tyler

//welcome object
export const welcomeContent = {
    async getContent() {
        const response = await fetch('scripts/content/html/welcome.html');
        const data = await response.text();
        
        console.log(data); 
        return data; 
    },

    addHelpers(element) {
        //add helper scripts to html.
        const onboardUserScript = document.createElement('script');
        onboardUserScript.src = "scripts/content/helpers/onboardUser.js";
        element.appendChild(onboardUserScript);
    }
};