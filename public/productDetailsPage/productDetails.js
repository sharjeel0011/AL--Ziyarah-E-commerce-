import { db, auth } from "../config.js";
import { collection, addDoc, Timestamp, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



const keyData = 'productId';
const arr = [];
let userUid;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        userUid = uid;
        // console.log(uid);
    } else {
        setTimeout(showAlert,3000)
    }
});

function showAlert(){
    $(document).ready( ()=> {
        $('#orderConfirmationsModal').modal('show');
      });
}

const btnGoSignup=document.getElementById("btnGoSignup")
btnGoSignup.addEventListener("click",()=>{window.location="../signup/signup.html"})


function productDetailsRender() {
    const serializedData = localStorage.getItem(keyData);
    if (serializedData) {
        const parsedData = JSON.parse(serializedData);
        arr.unshift(parsedData);
    } else {
        // console.log('No data found in local storage');
    }

    const detailProduct = document.getElementById("detailProduct");

    arr.forEach((productData) => {
        // console.log(productData)
        const productElement = document.createElement("div");
        productElement.classList.add("detailProduct");
        productElement.innerHTML = `
           

            <div class="product-image">
                <img src="${productData.productImgUrl}" alt="Product Image">
            </div>
            <div class="product-content">
                <div class="product-title">${productData.ProductName}</div>
                <div class="product-description">
                   ${productData.productDiscraption
            }
                </div>
                <div class="discount-price"><s>${productData.productPrice}.000<sub>PKR</sub></s></div>
                <div class="product-price">${productData.productDiscountPrice}.00</div>
                
               
                <button id="homebtn" type="button" class=" btn-success addtoCartbtn " data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                 Add to Card
                </button>

              
            </div>

            
        `;

        detailProduct.appendChild(productElement);
    });

    // Call the function to add event listeners after rendering products
    addEventListenersToButtons();
}


function addEventListenersToButtons() {
    const addtoCartButtons = document.querySelectorAll(".addtoCartbtn");

    addtoCartButtons.forEach((productCart) => {
        productCart.addEventListener("click", () => {
            if (userUid) {
                // console.log("Add to Cart button clicked");
                // console.log(arr);
                arr.forEach(async (arr) => {
                    try {
                        const docRef = await addDoc(collection(db, "cartItem"), {
                            ProductName: arr.ProductName,
                            productPrice: arr.productPrice,
                            productDiscountPrice: arr.productDiscountPrice,
                            productImgUrl: arr.productImgUrl,
                            userId: userUid, // Include the user ID in the cart item
                            timestamp: Timestamp.fromDate(new Date()),

                        });
                        // console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        // console.error("Error adding document: ", e);
                    }
                });
            } else {
                alert("Please log in first to add products to the cart");
            }
        });
    });
}

const homebtn = document.getElementById("homebtn");
homebtn.addEventListener("click", () => {
    // console.log(keyData);
    window.location = '../index.html';
    const keyToDelete = keyData;
    localStorage.removeItem(keyToDelete);
});

productDetailsRender();

