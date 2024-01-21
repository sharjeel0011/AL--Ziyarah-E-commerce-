


import { db, auth } from "../config.js";
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
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let arr = [];
let userUid;
let allPrice = [];
let selectedItemCount = 0;
let totalPrice = 0;
let totalDeliveryFee = 0;
let selectedProducts = []; // Array to store selected products

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        userUid = uid;
        // console.log(userUid);
        // Render data
        // console.log(arr);
        cart();
    } else {
        // alert("Please log in first to add products to the cart");
        // console.log("check")
        // $(document).ready( ()=> {
        //     $('#orderConfirmationsModal').modal('show');
        //   });

setTimeout(showAlert,3000)



    }
});

function showAlert(){
    $(document).ready( ()=> {
        $('#orderConfirmationsModal').modal('show');
      });
}




async function cart() {
    const querySnapshot = await getDocs(collection(db, "cartItem"));
    arr.length = 0;

    querySnapshot.forEach((doc) => {
        if (doc.data().userId === userUid) {
            const productData = doc.data();
            const productId = doc.id;

            arr.push({ ...productData, docId: productId, userId: userUid });
            // console.log(arr);
        }
    });

    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    let allItems = "";

    arr.forEach((item, index) => {
        allItems += `
        
            <div id='cartDiv'>
                <img width='100px' height='100px' src="${item.productImgUrl}" alt="">
                <p>${item.ProductName}</p>
                <div class="cart-price">
              <div> <s id="productPrice">${item.productPrice}</s></div>
              <div> <p>${item.productDiscountPrice}</p></div>
                </div>
                <input type="checkbox" class="checkBtn" data-index="${index}">
              <!--  <button class="deletebtn">Delete</button>-->

                <button id="homebtn" type="button" class=" btn-success deletebtn " data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Delete
              </button>

            </div>

           
        `;
    });

    cartItems.innerHTML = allItems;

    const checkBtns = document.querySelectorAll(".checkBtn");
    checkBtns.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const index = parseInt(checkbox.getAttribute('data-index'));
            checkout(index, checkbox.checked);
        });
    });

    const deleteBtn = document.querySelectorAll('.deletebtn');
    deleteBtn.forEach((item, index) => {
        item.addEventListener('click', () => {
            // console.log('delete called', index);
            deleteCartItem(index);
        });
    });
}

function deleteCartItem(index) {
    deleteDoc(doc(db, "cartItem", arr[index].docId))
        .then(() => {
            arr.splice(index, 1);
            renderCart();
        })
        .catch((err) => {
            // console.log(err);
        });
}


const deliveryCharg = [];
let deliveryFeeAdditionalItem = 0; // Define deliveryFeeAdditionalItem here or set it dynamically

async function deliveryfee() {
    try {
        const querySnapshot = await getDocs(collection(db, "DELIVERY-CHARGES"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            deliveryCharg.push(doc.data());
        });
        // console.log(deliveryCharg);
    } catch (error) {
        // console.error("Error fetching delivery charges:", error);
    }
}

function checkout(index, isChecked) {
    const discPrice = parseFloat(arr[index].productDiscountPrice) || 0;

    const deliveryFeeFirstItem = parseFloat(deliveryCharg[0]?.DeliveryFeeOneProduct) || 0;
    const deliveryFeeAdditionalItem = parseFloat(deliveryCharg[0]?.DeliveryFeeTwoProduct
        ) || 0;;
    arrindex(index);

    if (isChecked) {
        allPrice[index] = { amountAdd: discPrice };
        selectedItemCount++;

        selectedProducts.push({
            ProductName: arr[index].ProductName,
            productImgUrl: arr[index].productImgUrl,
        });

        totalDeliveryFee = deliveryFeeFirstItem + (selectedItemCount - 1) * deliveryFeeAdditionalItem;
    } else {
        allPrice[index] = { amountAdd: 0 };
        selectedItemCount--;

        if (selectedItemCount > 0) {
            totalDeliveryFee = deliveryFeeFirstItem + (selectedItemCount - 1) * deliveryFeeAdditionalItem;
        } else {
            totalPrice = 0;
            totalDeliveryFee = 0;
        }

        selectedProducts = selectedProducts.filter(
            (product) => product.ProductName !== arr[index].ProductName
        );
    }

    totalPrice = allPrice.reduce((total, price) => total + parseFloat(price.amountAdd), 0) || 0;
    const totalCostWithDelivery = totalPrice + totalDeliveryFee;

    const ProductTotalsPrice = document.getElementById("ProductPrice");
    const totalCost = document.getElementById("total-cost");
    const totalItem = document.getElementById("total-item");
    const deliveryFeeElement = document.getElementById("delivery-fee");

    ProductTotalsPrice.innerHTML = `Total Product Price: <span>${totalPrice}</span>`;
    totalCost.innerHTML = `Total Cost: <span>${totalCostWithDelivery.toFixed(2)} <sub>PKR</sub></span>`;
    totalItem.innerHTML = `Total Items: <span>${selectedItemCount}</span>`;
    deliveryFeeElement.innerHTML = `Total Delivery Fee: <span>${totalDeliveryFee.toFixed(2)}</span>`;
}

// Example of calling deliveryfee
deliveryfee();
















function arrindex(index){
// console.log("arrindex",index)
const LocalStoreArrIndex = JSON.stringify(index);
localStorage.setItem('productCartId', LocalStoreArrIndex);
}


const moreDetailBtn = document.getElementById("checkout-btn");
const confirmOrderBox = document.getElementById("userDetailsPage");
const FullName = document.getElementById("Full-Name");
const MobileNumber = document.getElementById("Mobile-Number");
const Provence = document.getElementById("Provence");
const city = document.getElementById("city");
const Townoranyarea = document.getElementById("Town-or-any-area");
const Fulladress = document.getElementById("Full-adress");
const sector = document.getElementById("sector");
const HouseNumber = document.getElementById("House-Number");
const anynearestpoint = document.getElementById("any-nearest-point");
const orderPlaceBtn = document.getElementById("order-place-btn");
const form = document.getElementById("form");

moreDetailBtn.addEventListener("click", (event) => {
    event.preventDefault()
    // console.log("function run");
    // moreDetailBtn.style.display = "none";
    confirmOrderBox.style.display="block"
    
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const orderNumber = generateOrderNumber();
   
    if (validateForm()) {
        
        try {
            const docRef = await addDoc(collection(db, "order"), {
                FullName: FullName.value,
                MobileNumber: MobileNumber.value,
                Provence: Provence.value,
                city: city.value,
                Townoranyarea: Townoranyarea.value,
                Fulladress: Fulladress.value,
                sector: sector.value,
                HouseNumber: HouseNumber.value,
                anynearestpoint: anynearestpoint.value,
                totalItem: selectedItemCount,
                TotalProductPrice: totalPrice,
                TotalDeliveryFee: totalDeliveryFee,
                TotalCostWithDelivery: totalPrice + totalDeliveryFee,
                products: selectedProducts,
                orderNumber:orderNumber,
            });
            // console.log("Document written with ID: ", docRef.id);
            
            
            FullName.value=''
            city.value=''
            Townoranyarea.value=''
            MobileNumber.value=''
            Fulladress.value=''
            sector.value=''
            HouseNumber.value=''
            anynearestpoint.value=''
            Provence.value=''
            // totalCost.value=''
            // totalItem.value=''
            // deliveryFee.value=''

            

            
        } catch (e) {
            // console.error("Error adding document: ", e);
        }
    } else {
        // Provide user feedback about the validation error
    }
});

const  arrIndextoDelKeyData = "productCartId"
orderPlaceBtn.addEventListener("click",()=> {
    const getData = localStorage.getItem(arrIndextoDelKeyData)
const arrindex = JSON.parse(getData);
// console.log(arrindex,"ye aya bhi kya")
    
    deleteDoc(doc(db, "cartItem", arr[arrindex].docId))
        .then(() => {

            arr.splice(arrindex, 1);
            renderCart();
            localStorage.removeItem(arrIndextoDelKeyData);
            renderCart();
        })
        .catch((err) => {
            // console.log(err);
        });
})


function generateOrderNumber() {
    // Prefix for your order numbers
    const prefix = "#";

    // Unique identifier (you can use a random number or any other unique identifier)
    const uniqueId = Math.floor(Math.random() * 10000);

    // Timestamp (convert to string for readability)
    const timestamp = new Date().getTime().toString();

    // Combine all parts to create the order number
    const orderNumber = `${prefix}-${uniqueId}-${timestamp}`;

    return orderNumber;
}

// Example usage



function validateForm() {
    // Implement your validation logic here
    // Return true if the form is valid, otherwise return false
    return true; // Placeholder for validation logic
}


const relodbtn = document.getElementById("relodbtn") 
relodbtn.addEventListener("click",()=>{
    location.reload();
    
})
// deliveryfee()