//Written by Riley Tyler
//Will switch the content of the page's dashboard usually using nav links or buttons.

//Import Modules
import { welcomeContent } from './content/dashboard_welcome.js';
import { todoListContent } from './content/dashboard_todoList.js';
import { journalContent } from './content/dashboard_journal.js';
import { settingsContent } from './content/dashboard_settings.js';

//Setup variables
let currentContent = "";
let dashboardContainer = document.getElementById("dashboard"); //Get dashboard container element
if (dashboardContainer) {
    dashboardContainer.remove(); //remove old dashboard container (this is mostly so everything is reloaded and animations play correctly for now)
}
dashboardContainer = document.createElement("div"); //create new dashboard div
dashboardContainer.id = "dashboard";


async function changeContent(contentName) {
    try {
        if (currentContent !== contentName){
            switch (contentName) {
                case "welcome":
                    dashboardContainer.innerHTML = await welcomeContent.getContent();//Get welcome content and display it in the dashboard.

                    //add helper scripts to html.
                    welcomeContent.addHelpers(dashboardContainer);

                    //Set currentContent global and call setActiveButton function on button to show its the active section. (plays an anim)
                    setActiveButton(contentName);
                    currentContent = contentName;
                    
                    break;
                case "todoList":
                    dashboardContainer.innerHTML = await todoListContent.getContent();//Get todoList content and display it in the dashboard.
                    
                    //add helper scripts to html.
                    todoListContent.addHelpers(dashboardContainer);

                    //Set currentContent global and call setActiveButton function on button to show its the active section. (plays an anim)
                    setActiveButton(contentName);
                    currentContent = contentName;

                    break;
                case "journal":
                    dashboardContainer.innerHTML = await journalContent.getContent();//Get journal content and display it in the dashboard.
                    
                    //add helper scripts to html.
                    journalContent.addHelpers(dashboardContainer);

                    //Set currentContent global and call setActiveButton function on button to show its the active section. (plays an anim)
                    setActiveButton(contentName);
                    currentContent = contentName;
                    
                    break;
                case "settings":
                    dashboardContainer.innerHTML = await settingsContent.getContent();//Get settings content and display it in the dashboard.

                    //add helper scripts to html.
                    settingsContent.addHelpers(dashboardContainer);

                    //Set currentContent global and call setActiveButton function on button to show its the active section. (plays an anim)
                    setActiveButton(contentName);
                    currentContent = contentName;
                    
                    break;
                default:
                    dashboardContainer.innerHTML = '<p>There was an error getting the content.</p>';
                    break;
            }
            
            document.getElementById("main-container").appendChild(dashboardContainer);

            savePreviouslyUsedContentSection();
        }
        else {
            console.log("Page already selected.")
        }
    }
    catch(error) {
        dashboardContainer.innerHTML = '<p>There was an error displaying the content. Error: ' + error + '</p>';
    }     
}

function savePreviouslyUsedContentSection() {
    localStorage.setItem("mindshed-previousContentSection", currentContent);
    console.log("Last used content section saved to local storage.")
}

function setActiveButton(contentName) {
    //Remove heartbeat anim class from old active button if currentContent has been previously set.
    if (currentContent) {
        if (document.getElementById(currentContent + "-button").classList.contains("heartbeat")) {
            document.getElementById(currentContent + "-button").classList.toggle("heartbeat");
        }
    }
    //Add the class to the new active button if it doesn't already have it (just in case.)
    if (!document.getElementById(contentName + "-button").classList.contains("heartbeat")) {
        document.getElementById(contentName + "-button").classList.toggle("heartbeat");
    }
}


/**
 * Awards points and updates the streak based on an action completion.
 * @param {string} message - Points to award for the action.
 */
function sendNotification(message, buttonText, pageName) {
    let notificationContainer = document.getElementById("notification-container");
    let messageElement = document.createElement("p");
    let buttonElement = document.createElement("button");
    messageElement.textContent = message;
    //If button and page parameters are included, add them to the notification
    if (buttonText !== null) {
        buttonElement.classList.toggle("btn-secondary");
        buttonElement.textContent = buttonText;
        buttonElement.addEventListener("click", function(event) {
            if (pageName !== null) {
                changeContent(pageName);
            }
        });
    }
    notificationContainer.innerHTML = "";
    notificationContainer.appendChild(messageElement);
    if (buttonElement.textContent !== "") {
        notificationContainer.appendChild(buttonElement);
    }
    toggleNotificationDisplay();

    //Hide after 5 seconds
    setTimeout(toggleNotificationDisplay, 5000);
}

function toggleNotificationDisplay() {
    let notificationContainer = document.getElementById("notification-container");
    if (notificationContainer.classList.contains("slide-in-top")) {
        notificationContainer.classList.toggle("slide-out-top");
        notificationContainer.classList.toggle("slide-in-top");
    }
    else {
        if (notificationContainer.classList.contains("slide-out-top")) {
            notificationContainer.classList.toggle("slide-out-top");
        }
        notificationContainer.classList.toggle("slide-in-top");
    }
}

//Page Init Functions
window.changeContent = changeContent;

if (localStorage.getItem("mindshed-previousContentSection") !== null) {
    changeContent(localStorage.getItem("mindshed-previousContentSection"));
}
else {
    //Open welcome content to start
    changeContent("welcome");
}

//Show on load notifications (such as message of the day or something)
sendNotification("Even more new themes have been added!");

if (localStorage.getItem("mindshed-userInfo") !== null) {
    setTimeout(() => {
        const messages = [
            "Add to your journal or complete to-dos to earn me-points and continue your daily streak.",
            "Keep up the great progress! Your consistency is earning rewards.",
            "Your dedication inspires. Keep pushing forward!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        sendNotification(randomMessage, "Go to Journal", "journal");
    }, 7000);
}
