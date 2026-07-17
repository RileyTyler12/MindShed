"use strict";
//Written by Riley Tyler

//settingsContent object
export const settingsContent = {
    async getContent() {
        const response = await fetch('scripts/content/html/settings.html');
        const data = await response.text(); 
        
        console.log(data); 
        return data; 
    },

    addHelpers(element) {
        //add user settings helper script to html.
        const userSettingsScript = document.createElement('script');
        userSettingsScript.src = "scripts/content/helpers/userSettings.js";
        element.appendChild(userSettingsScript);
    }
};
