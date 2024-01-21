import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    auth,
    db
} from "../config.js";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  
  
  
  
  //user-see-box
  const phoneNumer = document.getElementById('UpdatephoneNumer');
  const Email = document.getElementById("email")
const userage=  document.getElementById("user-age");
  const userImg = document.querySelector('#profile-user-img');
  const username = document.getElementById("username")
  const ProfileImgheder = document.getElementById("Profile-Img-heder")
const arr = []
  //function display
 

  onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            userImg.src = doc.data().profileUrl
            username.innerHTML =` ${doc.data().name}`
            phoneNumer.innerHTML = `Your Number:${doc.data().userPhoneNum}`
            Email.innerHTML =`Your Email: ${doc.data().email}`
            userage.innerHTML = `Your Birth Date:${doc.data().dateOfBirth}`
            ProfileImgheder.src =doc.data().profileUrl
        });
        // getDataFromFirestore(user.uid)
    } else {
        setTimeout(showAlert,3000)
    }
});
function showAlert(){
    $(document).ready( ()=> {
        $('#orderConfirmationsModal').modal('show');
      });
}

const goSignup = document.getElementById("btnGOCret")
goSignup.addEventListener("click",()=>{
    window.location="../signup/signup.html"
})


const logout = document.querySelector('#logoutbtn');

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
       
        window.location = '../index.html'
    }).catch((error) => {
        // console.log(error);
    });
})
const headerdiv= document.getElementById("header-div")
headerdiv.addEventListener("mouseover",()=>{
  Window.location="../home/home.html"
  headerdiv.style.cursor="pointer"
})