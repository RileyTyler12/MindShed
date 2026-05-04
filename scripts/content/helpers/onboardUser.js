
    if (localStorage.getItem("mindshed-userInfo") !== null) {
        let savedInfo = JSON.parse(localStorage.getItem("mindshed-userInfo"));
        document.getElementById("onboarding").innerHTML = "Hello " + savedInfo.name + ", welcome back!"
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
        userInfo.name = name;
        userInfo.age = age;

        //save to local storage
        localStorage.setItem("mindshed-userInfo", JSON.stringify(userInfo));
        location.reload();
    }

    if (document.getElementById("enterButton")) {
        console.log("enter button exists.")
    }