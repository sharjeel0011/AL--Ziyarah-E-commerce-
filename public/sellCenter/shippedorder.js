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
                
                if (window.location.href.indexOf('shippedOrders.html') === -1) {
                    window.location.href = 'shippedOrders.html';
                    getDataOrders()
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
    














    const ordersBox = document.getElementById("ordersShipped");
    const ProductArr = [];
    
    async function getDataOrders() {
        const querySnapshot = await getDocs(collection(db, "order-shipped"));
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
            // const productN = item.products[0].ProductName;
            ordersBox.innerHTML += `
            <li class="order-item">
            <div class="order-details">
            <span>${`Product Name : ${item.productName
            }`}</span>
                <span>${`Order ${item.orderNumber}`}</span>
                <span class="order-status">${`Status: ${item.orderStatus}`}</span>
            </div>
            <button  type="button" class=" btn-success Click-To-Shiped-Order " data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Delete Order
          </button>
          <!--  <button   class="Click-To-Shiped-Order" >Delete Order</button>-->
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

            const getProductIndexDel = document.querySelectorAll('.Click-To-Shiped-Order');
            getProductIndexDel.forEach((item, index) => {
                item.addEventListener('click', () => {
                    console.log('delete called', index);
                    deleteOrder(index)
                })
            })
    
        });
}   
const deleteShippedOrder=document.getElementById("deleteShippedOrder")
deleteShippedOrder.addEventListener("click",()=>{
    location.reload()
})







function deleteOrder(index) {
    deleteDoc(doc(db, "order-shipped", ProductArr[index].docId))
      .then(() => {
        ProductArr.splice(index, 1);
        // alert("this order is delete succesfuly...")
        // location.reload()
        
      }).catch((err) => {
        console.log(err);
      })
  }

function moreDetails(index) {
    // Get the product details based on the index
    const selectedProduct = ProductArr[index];

    // Set local storage data for the selected product
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProduct));

    // Redirect or perform any other actions based on your requirement
    // For example, redirect to a details page
    window.location.href = './shippedorderDetail.html';
}

// ... (rest of your code)






getDataOrders()