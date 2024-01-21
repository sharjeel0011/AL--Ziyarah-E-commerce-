import {auth, db } from "./config.js";
import { collection, getDocs, query,
    where,
    orderBy,
    Timestamp, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const allProducts = document.getElementById("all-products-upload");
const signOutbtn = document.getElementById("logoutbtn");
const signOutbtnWEB = document.getElementById("logoutbtnWeb");
const webLogoutBtnA = document.getElementById("webLogoutBtnA");
const appLogoutbtnA = document.getElementById("appLogoutbtn")

const arr = [];
let userUid;

// onauthstate chage
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    userUid = uid;
    // console.log(uid);

    const qProfile = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshotProfile = await getDocs(qProfile);
    querySnapshotProfile.forEach((doc) => {
    //   console.log(doc.data(), "profile");
      const ProfileImg = document.querySelector("#Profile-Img");
      const profileimgApp = document.getElementById("Profile-Img-app");
      ProfileImg.src = doc.data().profileUrl;
      profileimgApp.src = doc.data().profileUrl;
    });
  } else {
    // No user is signed in.
    webLogoutBtnA.href = "../login/login.html";
    appLogoutbtnA.href = "../login/login.html";
    signOutbtnWEB.style.backgroundColor="#28a745";
    signOutbtn.style.backgroundColor="#28a745";
    signOutbtn.innerText="Login";
    signOutbtnWEB.innerText="Login";
    setTimeout(showAlert,10000);
  }
});


















function showAlert(){
    
    $(document).ready( ()=> {
        $('#orderConfirmationModal').modal('show');
      });
}



async function renderProduct() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));

        let productHTML = ""; // Accumulate the HTML string

        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            const productId = doc.id; // Get the document ID

            arr.push({ ...productData, docId: productId,userId:userUid });
            productHTML += `
                <div class="product" data-product-id="${productId}">
                    <img src="${productData.productImgUrl}" class="images" alt="">
                    <p><b>${productData.ProductName}</b></p>
                    <div>
                    <p class='discount-price'><s>${productData.productPrice}.000<sub>PKR</sub></s></p>
                    <p class="product-price">${productData.productDiscountPrice}.00</p>
                </div>
                    </div>
            `;

        

        });

        allProducts.innerHTML = productHTML; // Set the accumulated HTML once

        // Query for .product elements after rendering
        const productElements = document.querySelectorAll(".product");

        productElements.forEach(product => {
            product.addEventListener("click", () => {
                const productId = product.getAttribute("data-product-id");
                const clickedProduct = arr.find(product => product.docId === productId);
                // console.log(clickedProduct);
                const LocalStoreDocId = JSON.stringify(clickedProduct);
                localStorage.setItem('productId', LocalStoreDocId);
                window.location="../productDetailsPage/productDetilsPage.html"
            });
        });

    } catch (error) {
        // console.error("Error fetching products:", error);
    }
}






signOutbtnWEB.addEventListener('click', () => {
    signOut(auth).then(() => {
      
    }).catch((error) => {
        // console.error("Error signing out:", error);
    });
});




signOutbtn.addEventListener('click', () => {
    signOut(auth).then(() => {
       signOutbtn.innerText="Login"
        signOutbtn.style.backgroundColor="#28a745"
    }).catch((error) => {
        // console.error("Error signing out:", error);
    });
});




renderProduct();












