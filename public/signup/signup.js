import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth,db,storage } from "../config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'
const err=document.getElementById("err")
const email = document.getElementById("email")
const passsord = document.getElementById("password")
const img = document.querySelector('#img');
const  userName = document.querySelector('#name');
const  userNumber = document.querySelector('#number');
const  userDateOfBirth = document.querySelector('#dateOfBirth');
const errparagraf = document.getElementById("show-err")

const form = document.getElementById("form")
const done =document.getElementById("done")


form.addEventListener('submit', (event) => {
    event.preventDefault();
   const result = createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            // console.log(user);
            const file = img.files[0]
            const storageRef = ref(storage, userName.value);
            uploadBytes(storageRef, file).then(() => {
                getDownloadURL(storageRef).then((url) => {
                   
                    addDoc(collection(db, "users"), {
                    name: userName.value,
                    userPhoneNum :userNumber.value,
                    email: email.value,
                    uid: user.uid,
                    profileUrl: url,
                    dateOfBirth:userDateOfBirth.value,
                    }).then((res) => {
                        // console.log(res);
                        window.location = '../index.html'
                    }).catch((err) => {
                        // console.log(err);
                        // M.toast({html: message})
                    })
                })
            });
          done.innerText=`You succsessfully create your account : ${ userName.value}`;

        })
        .catch((error) => {
            const errorMessage = error.message;
           err.innerText=errorMessage
            errparagraf.innerHTML=errorMessage
            // console.log(error.message);
          
            
        });


})
//uper last two breket add
const firstPage = document.getElementById("first-page")
const secoundPage = document.getElementById("login1_box")
const btnNextPage = document.getElementById("btn-first-page")

btnNextPage.addEventListener("click", (e) => {
    e.preventDefault()
    if(userName.value===""){
        err.innerText=""
        err.innerText=" Your Name is Required"
        // alert("your name is required")
  }else if(userNumber.value==="" ){
    err.innerText="Your Number is required"
   }else if (img.value===""){
    err.innerText="image is required"
   }else if(dateOfBirth.value===""){
err.innerText="Date of birth is required"
   }
    else{
        err.innerText=""
         secoundPage.style.display = "block";
        firstPage.style.display = "none";}
});

//chatgpt

const btnLogin = document.getElementById("btn-login");
const loadingSpinner = document.getElementById("loading-spinner");

btnLogin.addEventListener("click", async () => {
    // Show loading spinner
    showLoadingSpinner();

    // Simulate some asynchronous task (e.g., API call, form submission)
    await simulateAsyncTask();

    // Hide loading spinner after the task is completed
    hideLoadingSpinner();
});

function showLoadingSpinner() {
    btnLogin.style.display = "none";
    loadingSpinner.style.display = "block";
}

function hideLoadingSpinner() {
    btnLogin.style.display = "block";
    loadingSpinner.style.display = "none";
}

// Function to simulate an asynchronous task
function simulateAsyncTask() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000); // Simulating a 2-second asynchronous task
    });
}
