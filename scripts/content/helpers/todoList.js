if (localStorage.getItem("mindshed-todoList") !== null) {
    todoList = JSON.parse(localStorage.getItem("mindshed-todoList"));
    refreshListDisplay();
}
else {
    todoList = {
        itemStrings: [],
        itemStats: []
    };
}

function addTodoListItem() {
    let itemInput = document.getElementById("todo-input").value;
    if (itemInput) {
        todoList.itemStrings.push(itemInput);
        todoList.itemStats.push("incomplete");
        console.log("item added to list object.")  

        //save list object
        saveList();
        
        //refresh list display
        refreshListDisplay();
    }
    else {
        console.log("To-do list input empty, ignoring.")
    }
}

function refreshListDisplay() {
    //Set incomplete items first
    let incompleteList = document.getElementById("list-incomplete");
    incompleteList.innerHTML = "";
    let animDelay = 0.0; //Init animDelay variable, will be used to enhance look and feel.
    for (let i = 0; i < todoList.itemStrings.length; i++) {
        if (todoList.itemStats[i] === "incomplete") {
            let listItemContainer = document.createElement("div");
            listItemContainer.className = "listItem-container";
            animDelay += 0.2;
            listItemContainer.style.animationDelay = animDelay + "s";

            let itemText = document.createElement("p");
            itemText.className = "listItem-text";
            itemText.textContent = todoList.itemStrings[i];

            let itemButton = document.createElement("button");
            itemButton.className = "listItem-button btn-secondary";
            itemButton.id = "item-" + i; //set unique item id for use in onclick function.
            itemButton.textContent = "Mark";
            itemButton.addEventListener('click', function(event) {
                let itemNum = this.id.replace("item-", ""); //use item id to get item index num
                console.log(itemNum);

                // Mark complete and update user stats (points/streak).
                todoList.itemStats[itemNum] = "complete";
                awardPointsAndUpdateStreak(10);
                saveList();
                refreshListDisplay();
            });

            listItemContainer.appendChild(itemButton);
            listItemContainer.appendChild(itemText);
            incompleteList.appendChild(listItemContainer)
        }
    }

    //Now display complete items
    let completeList = document.getElementById("list-complete");
    completeList.innerHTML = "";
    animDelay = 0.0; //reset animDelay variable
    for (let i = 0; i < todoList.itemStrings.length; i++) {
        if (todoList.itemStats[i] === "complete") {
            let listItemContainer = document.createElement("div");
            listItemContainer.className = "listItem-container";
            //Animation delay for look and feel
            animDelay += 0.2;
            listItemContainer.style.animationDelay = animDelay + "s";

            let itemText = document.createElement("p");
            itemText.className = "listItem-text"
            itemText.textContent = todoList.itemStrings[i];

            let itemButtonsDiv = document.createElement("div");
            //Create and setup mark button
            let itemButton = document.createElement("button");
            itemButton.className = "listItem-button btn-secondary";
            itemButton.id = "item-" + i; //set unique item id for use in onclick function.
            itemButton.textContent = "Mark";
            itemButton.addEventListener('click', function(event) {
                let itemNum = this.id.replace("item-", ""); //use item id to get item index num
                console.log(itemNum);

                //now mark incomplete, save, and refresh.
                todoList.itemStats[itemNum] = "incomplete";
                saveList();
                refreshListDisplay();
            });

            //Create and setup delete button
            let itemDeleteButton = document.createElement("button");
            itemDeleteButton.className = "listItem-delete-button btn-secondary";
            itemDeleteButton.id = "item-" + i; //set unique item id for use in onclick function.
            itemDeleteButton.textContent = "Delete";
            itemDeleteButton.addEventListener('click', function(event) {
                let itemNum = this.id.replace("item-", ""); //use item id to get item index num
                console.log(itemNum);

                //now delete items from object arrays, save, and refresh.
                todoList.itemStrings.splice(itemNum, 1);
                todoList.itemStats.splice(itemNum, 1);
                saveList();
                refreshListDisplay();
            });

            itemButtonsDiv.appendChild(itemButton);
            itemButtonsDiv.appendChild(itemDeleteButton);
            listItemContainer.appendChild(itemButtonsDiv);
            listItemContainer.appendChild(itemText);
            completeList.appendChild(listItemContainer)
        }
    }
}

function saveList() {
    try {
        localStorage.setItem("mindshed-todoList", JSON.stringify(todoList))
        console.log('To-Do list save successful');
    }
    catch (error) {
        console.log('To-Do list failed to save. Error: ' + error);
    }
}