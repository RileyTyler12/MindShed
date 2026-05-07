
    if (localStorage.getItem("mindshed-userInfo") !== null) {
        userInfo = JSON.parse(localStorage.getItem("mindshed-userInfo"));
        if (document.getElementById("onboarding") !== null) {
            document.getElementById("onboarding").innerHTML = "Hello " + userInfo.name + ". Welcome back!";
            displayAvatarImage();
        }
        
        if (checkStreakReset()) {
            awardPointsAndUpdateStreak(0);
        }
        updateStreakDisplay();
    }
    else {
        userInfo = {
            name: "",
            age: 0,
            points: 0,
            streakDays: 0,
            lastActionDate: null
        };
    }

    function submitOnboarding() {
        let name = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        if (!name || !age) {
            window.alert("Please enter a valid name and age.")
        }
        else {
            userInfo.name = name;
            userInfo.age = age;

            //save to local storage
            saveUserInfo();
            location.reload();
        }
    }

    function displayAvatarImage() { //get avatar from RoboHash
        const input = userInfo.name + userInfo.age + "Day" + userInfo.streakDays;
        const img = document.createElement('img');
        const url = `https://robohash.org/${input}?size=200x200&set=set4`;
        console.log(url);
        fetch(url)
        .then(response => response.blob())
        .then(blob => {
            img.src = URL.createObjectURL(blob);
            document.getElementById("dashboard").appendChild(img);
        });
        document.getElementById("dashboard").innerHTML += "<p>Avatars lovingly delivered by Robohash.org</p>";
    }

    if (document.getElementById("enterButton")) {
        console.log("enter button exists.")
    }

    /**
     * Saves the current global userInfo object to localStorage.
     */
    function saveUserInfo() {
        localStorage.setItem("mindshed-userInfo", JSON.stringify(userInfo));
        console.log('User info saved successfully.');
    }

    /**
     * Awards points and updates the streak based on an action completion.
     * @param {number} points - Points to award for the action.
     */
    function awardPointsAndUpdateStreak(points) {
        let newDay = false;
        const today = new Date().toDateString();
        let lastActionDate = userInfo.lastActionDate ? new Date(userInfo.lastActionDate).toDateString() : null;

        // Check if a day has passed since the last action
        if (userInfo.lastActionDate && lastActionDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            // Check if last action was exactly yesterday to maintain streak
            if (lastActionDate === yesterdayStr) {
                if (points !== 0) {
                    userInfo.streakDays += 1;
                    newDay = true;
                }
            } else {
                 // Reset streak if there is a gap of more than one day
                if (points !== 0) {
                    userInfo.streakDays = 1;
                }
                else {
                    userInfo.streakDays = 0;
                }
            }
        } else {
            // First action or same day action, start/maintain streak
            if (!userInfo.lastActionDate) {
                if (points !== 0) {
                    userInfo.streakDays = 1;
                }
                else {
                    userInfo.streakDays = 0;
                }
            }
        }

        if (points !== 0) {
            userInfo.points += points;
            userInfo.lastActionDate = new Date().toISOString();
        }

        // Update display
        updateStreakDisplay(newDay);

        // Save user info
        saveUserInfo();
    }

    function updateStreakDisplay(newDay) {
        let streakElement = document.getElementById("streak");
        let mePointsElement = document.getElementById("me-points");
        const today = new Date().toDateString();
        let lastActionDate = userInfo.lastActionDate ? new Date(userInfo.lastActionDate).toDateString() : null;
        // Update UI display for streak and points
        if (newDay || (today === lastActionDate)) {
            streakElement.innerHTML = userInfo.streakDays + "🔥";
        }
        else {
            streakElement.innerHTML = userInfo.streakDays + "❄️";
        }
        mePointsElement.innerHTML = userInfo.points;
    }

    function checkStreakReset() {
        const today = new Date();
        let lastActionDate = userInfo.lastActionDate ? new Date(userInfo.lastActionDate).toDateString() : null;
        if (today.getDate() > (today.getDate() - 1)) {
            return true;
        }
        else {
            return false;
        }
    }
