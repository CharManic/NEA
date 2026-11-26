console.log("TEST");
const socket = new WebSocket('ws://localhost:80');
export let id;

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", authenticate);

let signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", createAccount);

let errorElements = [document.getElementById("error-container"), document.getElementById("error")];

// add functionality for invalid inputs !!!!!!
// ADD AN OPTION TO REGISTER FOR A NEW ACCOUNT !!!!!!

socket.addEventListener('message', (event) => {
    // fetching params lol

    console.log('received %s', event.data);
    const sentData = JSON.parse(event.data);
    var code = sentData.code;
    
    if (code === 0 || code === 1) {
        if (!sentData.error) {
            id = sentData.id;
            window.open("/index.html", "_self");
        } else {
            errorElements[1].innerHTML = sentData.error;
            errorElements[0].classList.toggle("error-visible");
        }

    };

});


async function authenticate() {
    let username = document.getElementById("username").textContent;
    let password = document.getElementById("password").textContent;
    
    // empty field check !!
    if (username && password) {
        await socket.send(JSON.stringify({
            code: 0,
            username: username,
            password: password
        }));
    } else {
        errorElements[1].innerHTML = "Please do not leave any blank fields.";
        errorElements[0].classList.toggle("error-visible");
    };
};

async function createAccount() {

    // check for empty fields DONE
    // check for invalid user DONE
    // check for invalid password DONE

    // CONSIDER MAKING A CLASS ????

    let username = document.getElementById("username").textContent;
    let password = document.getElementById("password").textContent;
    let passwordMatch = document.getElementById("confirm-password").textContent;
    
    if (username && password) {
        
        // check if user has correctly entered their password twice
        if (password === passwordMatch) {
            await socket.send(JSON.stringify({
                code: 1,
                username: username,
                password: password
            }));
        } else {
            errorElements[1].innerHTML = "Passwords must match.";
            errorElements[0].classList.toggle("error-visible");
        };
    
    } else {
        errorElements[1].innerHTML = "Please do not leave any blank fields.";
        errorElements[0].classList.toggle("error-visible");
    };
}


// add signUp functionality DONE, validity checks, SORT ALL LISTENERS OUT !!!!
window.toggleSignUp = function () {
    let loginElements = document.querySelectorAll(".visible, .hidden");
    loginElements.forEach(element => {
        element.classList.toggle("visible");
        element.classList.toggle("hidden");
    });
    
        
}

