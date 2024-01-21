
import { auth, db, storage } from "../config.js";
import { collection, addDoc, getDocs, doc,
    deleteDoc, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";




onAuthStateChanged(auth, async (user) => {
    if (user) {
        
        var userEmail = user.email;

        
        var allowedEmails = ['muhummadbilawal@gmail.com','sharjeelhafiz123@gmail.com', 'alziyarah18@gmail.com'];

       
        if (allowedEmails.includes(userEmail)) {
            
            if (window.location.href.indexOf('sellCenter.html') === -1) {
                window.location.href = 'sellCenter.html';
            }
        } else {
            
            if (window.location.href.indexOf('../index.html') === -1) {
                window.location.href = '../index.html';
            }
        }
    } else {
        
        if (window.location.href.indexOf('../index.html') === -1) {
            window.location.href = '../index.html';
        }
    }
});














const productName = document.getElementById("productName")
const productPrice = document.getElementById("productPrice")
const productDiscountPrice = document.getElementById("productdiscountprice")
const productDiscraption = document.getElementById("productDiscraption")
const img = document.getElementById("productImg")
const form = document.getElementById("product-form")



const arr = []

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = img.files[0]
    const storageRef = ref(storage, productName.value);

    try {
        // Upload the file to storage
        await uploadBytes(storageRef, file);

        // Get the download URL
        const url = await getDownloadURL(storageRef);

        // Add the document to the "products" collection
        const newProductRef = await addDoc(collection(db, "products"), {
            ProductName: productName.value,
            productPrice: productPrice.value,
            productDiscountPrice: productDiscountPrice.value,
            productImgUrl: url,
            productDiscraption: productDiscraption.value,

        });

        arr.unshift({
            docId: newProductRef.id,
        });
        const serializedArr = JSON.stringify(arr);
        localStorage.setItem('productId', serializedArr);

        console.log("Document written with ID: ", newProductRef.id);
        // Do any additional tasks with the document ID here
        form.reset()
    } catch (error) {
        console.error("Error adding document: ", error);
        // Handle the error here (e.g., show a message to the user)
    }

});



///raf use
const ordersBox = document.getElementById("orders");
const ProductArr = [];

async function getDataOrders() {
    const querySnapshot = await getDocs(collection(db, "order"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const productData = doc.data();
        const productId = doc.id; // Get the document ID

        ProductArr.push({ ...productData, docId: productId });

        console.log(ProductArr, "arr he ye")
    });

    ProductArr.forEach((item) => {
        // Assuming there is at least one product in the order
        // const productImageUrl = item.products[0].productImgUrl;
        const productN = item.products[0].ProductName;
        ordersBox.innerHTML += `
        <li class="order-item">
        <div class="order-details">
        <span>${`Product Name : ${productN}`}</span>
            <span>${`Order #${item.orderNumber}`}</span>
            <span class="order-status">${`Status: ${"pending"}`}</span>
        </div>
        <button  class="Click-To-Shiped-Order" >Shipped Order</button>
        <button id="details" class="Click-To-Detail-Order" >Check  Order Details</button>
    </li>
        `;

        const getProductIndex = document.querySelectorAll('#details');
        getProductIndex.forEach((item, index) => {
            item.addEventListener('click', () => {
                console.log('delete called', index);
                moreDetails(index)
            })
        })

    });



    //order shipped and delet pending


    const shippedProdInd = document.querySelectorAll(".Click-To-Shiped-Order")
    shippedProdInd.forEach((item, index) => {
        item.addEventListener('click', () => {
            // console.log('delete called', index);
            orderShipped(index)
        })
    })
}



async function orderShipped(index) {
    try {
        const item = ProductArr[index];

        // Add the order to the "order-shipped" collection
        const docRef = await addDoc(collection(db, "order-shipped"), {
            FullName: item.FullName,
            MobileNumber: item.MobileNumber,
            Provence: item.Provence,
            city: item.city,
            Townoranyarea: item.Townoranyarea,
            Fulladress: item.Fulladress,
            sector: item.sector,
            HouseNumber: item.HouseNumber,
            anynearestpoint: item.anynearestpoint,
            totalItem: item.totalItem,
            TotalProductPrice: item.TotalProductPrice,
            TotalDeliveryFee: item.TotalDeliveryFee,
            TotalCostWithDelivery: item.TotalCostWithDelivery,
            productName: item.products[0].ProductName,
            productImage: item.products[0].productImgUrl,
            orderNumber: item.orderNumber,
            orderStatus: "Shipped"
        });

        // Remove the item from the array
        ProductArr.splice(index, 1);

        // Delete the document from the "order" collection
        const deletePromise = deleteDoc(doc(db, "order", item.docId));

        // After deletion, update the UI using the modified ProductArr
        console.log("ProductArr after deletion:", ProductArr);

        // Wait for the deletion to complete before updating the UI
        await deletePromise;

        // Update the UI using the modified ProductArr
        await getDataOrders();

        console.log("Document written with ID: ", docRef.id);
        // Reload the page to reflect the changes in the UI
        location.reload();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


const deliveryFeeForm= document.getElementById("deliveryFeeForm")
const DeliveryoneOrder =  document.getElementById("DeliveryoneOrder")
const DeliveryTwoOrder =  document.getElementById("DeliveryTwoOrder")
deliveryFeeForm.addEventListener("submit", async (event) =>{
    event.preventDefault()

    // Add a new document with a generated id.
const docRef = await addDoc(collection(db, "DELIVERY-CHARGES"), {
    DeliveryFeeOneProduct :DeliveryoneOrder.value,
       DeliveryFeeTwoProduct :DeliveryTwoOrder.value,
  });
  console.log("Document written with ID: ", docRef.id);
  DeliveryoneOrder.value=''
  DeliveryTwoOrder.value=''
})
















// ... (previous code)

function moreDetails(index) {
    // Get the product details based on the index
    const selectedProduct = ProductArr[index];

    // Set local storage data for the selected product
    localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));

    // Redirect or perform any other actions based on your requirement
    // For example, redirect to a details page
    window.location.href = './OrderDetailPage.html';
}

// ... (rest of your code)





getDataOrders();

