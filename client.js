// client.js

window.onload = function() {
    console.log("onload function called");
    if (retrieveToken() !== null) {
        showProfile();
    }else {
        showWelcome();
        const signUpForm = document.getElementById("signupForm");
        signUpForm.addEventListener("submit", signUp);
        const signInForm = document.getElementById("signinForm");
        signInForm.addEventListener("submit", signIn);
        for (let i = 0; i < signUpForm.elements.length; i++) {
            signUpForm.elements[i].addEventListener("change", hideErrorMessageSignUp);
        }
        for (let i = 0; i < signInForm.elements.length; i++) {
            signInForm.elements[i].addEventListener("change", hideErrorMessageSignIn);
        }
    }
}

function hideErrorMessageSignUp() {
    document.getElementById("errorMessageSignUp").style.display = "none";
}

function hideErrorMessageSignIn() {
    document.getElementById("errorMessageSignIn").style.display = "none";
}


function showWelcome() {
    let oneContainer = document.getElementById("oneContainer");
    oneContainer.innerHTML = document.getElementById("welcomeview").innerHTML;
}

function showProfile() {
    let profileView = document.getElementById("profileview").innerHTML;
    let oneContainer = document.getElementById("oneContainer");
    oneContainer.innerHTML = profileView;
    document.getElementById("changePasswordForm").addEventListener("submit", changePassword);
    document.getElementById("signOutButton").addEventListener("click", signOut);
    homePanel();
    implementBrowseTab();
    tabsPanels();

}

function checkPasswords(input) {
    if (input.value !== document.getElementById('password_signup').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        input.setCustomValidity('');
    }
}

function signUp(event) {
    console.log("signUp function called");
    event.preventDefault(); // prevent the form from submitting
    const email = document.getElementById("email_signup").value;
    const password = document.getElementById("password_signup").value;
    const firstName = document.getElementById("first_name").value;
    const familyName = document.getElementById("family_name").value;
    const gender = document.getElementById("gender").value;
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;

    const dataObject = {
        email: email,
        password: password,
        firstname: firstName,
        familyname: familyName,
        gender: gender,
        city: city,
        country: country
    };

    let response = serverstub.signUp(dataObject);
    signUpCallback(response);
}

function signUpCallback(response) {
    if (response.success) {
        console.log("Successfully registered!");
        let errorMessage = document.getElementById("errorMessageSignUp");
        errorMessage.innerHTML = "Successfully registered!";
        errorMessage.style.display = "block";
    } else {
        let errorMessage = document.getElementById("errorMessageSignUp");
        errorMessage.innerHTML = response.message;
        errorMessage.style.display = "block";
        console.log("Error: " + response.message);
    }
}

function signIn(event) {
    event.preventDefault();
    let email = document.getElementById("email_signin").value;
    let password = document.getElementById("password_signin").value;

    let response = serverstub.signIn(email, password);
    signInCallback(response);
}

function signInCallback(response) {
    if (response.success) {
        let token = response.data;
        console.log("Successfully Signed In!");
        localStorage.setItem("token", token);
        showProfile();
    } else {
        let errorMessage = document.getElementById("errorMessageSignIn");
        errorMessage.innerHTML = response.message;
        errorMessage.style.display = "block";
        console.log("Error: " + response.message);
    }
}

function retrieveToken() {
    let token = localStorage.getItem("token");
    if (token) {
        console.log("Token retrieved: " + token);
        return token;
    } else {
        console.log("No token found.");
        return null;
    }
}

function tabsPanels() {
    const tabs = document.getElementsByClassName("tab-btn");
    const panels = document.getElementsByClassName("panel");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() {
            for (let j = 0; j < tabs.length; j++) {
                tabs[j].classList.remove("active");
                panels[j].classList.remove("active");
            }
            tabs[i].classList.add("active");
            panels[i].classList.add("active");
        });
    }
}

function changePassword(event) {
    event.preventDefault();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const token = retrieveToken();

    if (newPassword !== confirmPassword) {
        document.getElementById("changePasswordMessage").innerHTML = "New password and confirm password do not match.";
        document.getElementById("changePasswordMessage").style.display = "block";
        return;
    }

    const response = serverstub.changePassword(token, oldPassword, newPassword);
    changePasswordCallback(response);
}

function changePasswordCallback(response) {
    if (response.success) {
        document.getElementById("changePasswordMessage").innerHTML = "Password changed successfully.";
        document.getElementById("changePasswordMessage").style.display = "block";
    } else {
        document.getElementById("changePasswordMessage").innerHTML = response.message;
        document.getElementById("changePasswordMessage").style.display = "block";
    }
}

function signOut() {
    let token = localStorage.getItem("token");
    let response = serverstub.signOut(token);
    signOutCallback(response);
}

function signOutCallback(response) {
    if (response.success) {
        localStorage.removeItem("token");
        showWelcome();
        console.log("Successfully signed out!");
    } else {
        console.log("Error: " + response.message);
    }
}

function homePanel() {
    let token = retrieveToken();
    getUserDataByToken(token);
    getMessagesByToken(token);
    document.getElementById("post_button").addEventListener("click", postMessage);
    document.getElementById("reload_button").addEventListener("click", reloadMessages);
}

function getUserDataByToken(token) {
    let response = serverstub.getUserDataByToken(token);
    getUserDataCallback(response);
}

function getUserDataCallback(response) {
    if (response.success) {
        console.log("Successfully got data!");
        let user = response.data;
        console.log(user);
        document.getElementById('email_home_panel').innerHTML = user.email;
        document.getElementById('firstname_home_panel').innerHTML = user.firstname;
        document.getElementById('familyname_home_panel').innerHTML = user.familyname;
        document.getElementById('gender_home_panel').innerHTML = user.gender;
        document.getElementById('city_home_panel').innerHTML = user.city;
        document.getElementById('country_home_panel').innerHTML = user.country;
    } else {
        console.log("Error: " + response.message);
    }
}

function getMessagesByToken(token) {
    let response = serverstub.getUserMessagesByToken(token);
    getMessagesCallback(response);
}

function getMessagesCallback(response) {
    if (response.success) {
        console.log("Successfully got messages!");
        let messages = response.data;
        console.log(messages);
        let messageList = document.getElementById('messages');
        messageList.innerHTML = "";
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i].content;
            let messageElement = document.createElement('li');
            messageElement.innerHTML = message;
            messageList.appendChild(messageElement);
        }
    } else {
        console.log("Error: " + response.message);
    }
}

function postMessage(event) {
    event.preventDefault();
    let message = document.getElementById('message_textarea').value;
    let token = retrieveToken();
    let response = serverstub.postMessage(token, message);
    postMessageCallback(response);
    document.getElementById('message_textarea').value = "";
}


function postMessageCallback(response) {
    if (response.success) {
        console.log("Successfully posted message!");
    } else {
        console.log("Error: " + response.message);
    }
}

function reloadMessages(event) {
    event.preventDefault();
    let token = retrieveToken();
    getMessagesByToken(token);
}

function implementBrowseTab() {
    console.log("browse tab called");
    const browseSubmitBtn = document.getElementById("browse-submit");
    const browseEmailInput = document.getElementById("browse-email");
    const browseResult = document.getElementById("search-status");

    browseSubmitBtn.addEventListener("click", function(event) {
        console.log("browse submit clicked");
        event.preventDefault();
        const email = browseEmailInput.value;
        let response = serverstub.getUserDataByEmail(retrieveToken(),email);
        if (response.success) {
            browseResult.innerHTML = '';
            const user = response.data;
            console.log(user);
            document.getElementById('email_browse_user').innerHTML = user.email;
            document.getElementById('firstname_browse_user').innerHTML = user.firstname;
            document.getElementById('familyname_browse_user').innerHTML = user.familyname;
            document.getElementById('gender_browse_user').innerHTML = user.gender;
            document.getElementById('city_browse_user').innerHTML = user.city;
            document.getElementById('country_browse_user').innerHTML = user.country;
        }else {
            browseResult.innerHTML = "User not found.";
        }
        let messageResponse = serverstub.getUserMessagesByEmail(retrieveToken(),email);
        if (messageResponse.success) {
            let messages = messageResponse.data;
            console.log(messages);
            let messageList = document.getElementById('messages_browse_user');
            messageList.innerHTML = "";
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i].content;
                let messageElement = document.createElement('li');
                messageElement.innerHTML = message;
                messageList.appendChild(messageElement);
            }
        }

        document.getElementById("post_button_browse").addEventListener("click", function(event) {
            event.preventDefault();
            let message = document.getElementById('message_textarea_browse').value;
            let token = retrieveToken();
            let response = serverstub.postMessage(token, message, email);
            if (response.success) {
                console.log("Successfully posted message!");
                document.getElementById('message_textarea_browse').value = "";
            } else {
                console.log("Error: " + response.message);
            }
        });
        document.getElementById("reload_button_browse").addEventListener("click", function(event) {
            event.preventDefault();
            let messageResponseRe = serverstub.getUserMessagesByEmail(retrieveToken(),email);
            if (messageResponseRe.success) {
                let messagesRe = messageResponseRe.data;
                console.log(messagesRe);
                let messageListRe = document.getElementById('messages_browse_user');
                messageListRe.innerHTML = "";
                for (let i = 0; i < messagesRe.length; i++) {
                    let message = messagesRe[i].content;
                    let messageElement = document.createElement('li');
                    messageElement.innerHTML = message;
                    messageListRe.appendChild(messageElement);
                }
            }
        });
    });
}


