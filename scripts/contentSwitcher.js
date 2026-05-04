//Written by Riley Tyler
//Will switch the content of the page's dashboard usually using nav links or buttons.

//Import Modules
import { welcomeContent } from './content/dashboard_welcome.js';
import { todoListContent } from './content/dashboard_todoList.js';
import { aboutContent } from './content/dashboard_about.js';

//Setup variables
let currentContent = "";
let dashboardContainer = document.getElementById("dashboard"); //Get dashboard container element

async function changeContent(contentName) {
    try {
        if (currentContent !== contentName){
            switch (contentName) {
                case "welcome":
                    dashboardContainer.innerHTML = await welcomeContent.getContent();//Get welcome content and display it in the dashboard.

                    //add helper scripts to html.
                    welcomeContent.addHelpers(dashboardContainer);

                    currentContent = contentName;
                    break;
                case "todoList":
                    dashboardContainer.innerHTML = await todoListContent.getContent();//Get welcome content and display it in the dashboard.
                    
                    //add helper scripts to html.
                    todoListContent.addHelpers(dashboardContainer);

                    currentContent = contentName;
                    break;
                case "about":
                    dashboardContainer.innerHTML = await aboutContent.getContent();//Get welcome content and display it in the dashboard.
                    currentContent = contentName;
                    break;
                default:
                    dashboardContainer.innerHTML = '<p>There was an error getting the content.</p>';
                    break;
            }
        }
        else {
            console.log("Page already selected.")
        }
    }
    catch(error) {
        dashboardContainer.innerHTML = '<p>There was an error displaying the content. Error: ' + error + '</p>';
    }     
}

window.changeContent = changeContent;

//Open welcome content to start
changeContent("welcome");