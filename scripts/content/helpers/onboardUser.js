
    if (localStorage.getItem("mindshed-userInfo") !== null) {
        userInfo = JSON.parse(localStorage.getItem("mindshed-userInfo"));
        document.getElementById("onboarding").innerHTML = "Hello " + userInfo.name + ". Welcome back!";
        displayAvatarImage();
    }
    else {
        userInfo = {
            name: "",
            age: 0
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
            localStorage.setItem("mindshed-userInfo", JSON.stringify(userInfo));
            location.reload();
        }
    }

    function displayAvatarImage() { //get avatar from RoboHash
        const input = userInfo.name + userInfo.age;
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