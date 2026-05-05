//built from todoList.js and modified as needed.

if (localStorage.getItem("mindshed-journal") !== null) {
    journal = JSON.parse(localStorage.getItem("mindshed-journal"));
    refreshListDisplay();
}
else {
    journal = {
        itemStrings: [],
        itemStats: [],
        itemDates: []
    };
}

function addJournalItem() {
    let itemInput = document.getElementById("journal-input").value;
    if (itemInput) {
        journal.itemStrings.push(itemInput);
        journal.itemStats.push("incomplete"); // mostly unused for now but may be used to filter journal entries.
        //Get date for journal entry
        let date = new Date();
        journal.itemDates.push(date.toLocaleString());
        console.log("item added to journal object.")  

        //save list object
        saveList();
        
        //refresh list display
        refreshListDisplay();
    }
    else {
        console.log("journal entry input empty, ignoring.")
    }
}

function refreshListDisplay() {
    //Set incomplete items first
    let journalList = document.getElementById("journal-main-container");
    journalList.innerHTML = "";
    let animDelay = 0.0; //Init animDelay variable, will be used to enhance look and feel.
    for (let i = 0; i < journal.itemStrings.length; i++) {
        if (journal.itemStats[i] === "incomplete") {
            let listItemContainer = document.createElement("div");
            listItemContainer.className = "listItem-container";
            animDelay += 0.2;
            listItemContainer.style.animationDelay = animDelay + "s";


            let listItemButtonsContainer = document.createElement("div");
            listItemButtonsContainer.className = "listItem-buttons-container";

            let itemText = document.createElement("p");
            itemText.className = "listItem-text";
            itemText.textContent = journal.itemStrings[i];

            let itemDate = document.createElement("p");
            itemDate.className = "listItem-date";
            itemDate.textContent = journal.itemDates[i];

            let itemButton = document.createElement("button");
            itemButton.className = "listItem-button btn-secondary";
            itemButton.id = "item-" + i; //set unique item id for use in onclick function.
            itemButton.textContent = "Delete";
            itemButton.addEventListener('click', function(event) {
                let itemNum = this.id.replace("item-", ""); //use item id to get item index num
                console.log(itemNum);

                //delete journal entry data, save, and refresh.
                journal.itemStrings.splice(itemNum, 1);
                journal.itemStats.splice(itemNum, 1);
                journal.itemDates.splice(itemNum, 1);
                saveList();
                refreshListDisplay();
            });

            listItemContainer.appendChild(listItemButtonsContainer);
            listItemButtonsContainer.appendChild(itemDate);
            listItemButtonsContainer.appendChild(itemButton);
            listItemContainer.appendChild(itemText);
            journalList.appendChild(listItemContainer)
        }
    }
}

function saveList() {
    try {
        localStorage.setItem("mindshed-journal", JSON.stringify(journal))
        console.log('Journal save successful');
    }
    catch (error) {
        console.log('Journal failed to save. Error: ' + error);
    }
}