
const keyData = 'selectedProduct';
const arr = [];

function renderOrderDetail(){
      // Retrieve the selected product details from local storage
      const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
      arr.unshift(selectedProduct);
      // Display the order details on the page
      const orderDetailsContainer = document.getElementById('orderDetailsContainer');
      const productName = selectedProduct.products[0].ProductName;
console.log(arr)
      if (selectedProduct) {
          const orderItem = document.createElement('div');
          orderItem.classList.add('order-item');

          const orderDetails = document.createElement('div');
          orderDetails.classList.add('order-details');
          orderDetails.innerHTML = `
            <h2>Order Details :</h2>
              <p><strong>Order Number:</strong> ${selectedProduct.orderNumber}</p>
              <p><strong>Total Delivery Fee:</strong> ${selectedProduct.TotalDeliveryFee}</p>
              <p><strong>Total Product Price:</strong> ${selectedProduct.TotalProductPrice}</p>
              <p class='TotalCostDeli'><strong>Total Cost with Delivery:</strong> ${selectedProduct.TotalCostWithDelivery}</p>
              `;

          const customerDetails = document.createElement('div');
          customerDetails.classList.add('customer-details');
          customerDetails.innerHTML = `
          <h2>Custommer Details :</h2>
          <p><strong>Full Name:</strong> ${selectedProduct.FullName}</p>
          <p><strong>Full Address:</strong> ${selectedProduct.Fulladress}</p>
          <p><strong>House Number:</strong> ${selectedProduct.HouseNumber}</p>
          <p><strong>Mobile Number:</strong> ${selectedProduct.MobileNumber}</p>
          <p><strong>Province:</strong> ${selectedProduct.Provence}</p>
          <p><strong>Town or Any Area:</strong> ${selectedProduct.Townoranyarea}</p>
          <p><strong>Any Nearest Point:</strong> ${selectedProduct.anynearestpoint}</p>
          <p><strong>City:</strong> ${selectedProduct.city}</p>
          <p><strong>Sector:</strong> ${selectedProduct.sector}</p>
          
          `;

          const productDetails = document.createElement('div');
          productDetails.classList.add('product-details');
          productDetails.innerHTML = `<h2><strong>Product Details:</strong></h2>`;
          
          selectedProduct.products.forEach(product => {
              productDetails.innerHTML += `
                  <div>
                      <img src="${product.productImgUrl}" alt="${product.ProductName}" class="product-image">
                      <p><strong>Total Items:</strong> ${selectedProduct.totalItem}</p>
                      <p><strong>Product Name:</strong> ${product.ProductName} </p>
                  </div>
              `;
          });

          orderItem.appendChild(orderDetails);
          orderItem.appendChild(customerDetails);
          orderItem.appendChild(productDetails);
          orderDetailsContainer.appendChild(orderItem);
      } else {
          // Handle the case when there are no selected product details
          orderDetailsContainer.innerHTML = '<p>No order details found.</p>';
      }
}

renderOrderDetail()
const sellCenter = document.getElementById("homebtn");
sellCenter.addEventListener("click", () => {
    console.log(keyData);
    window.location = './sellCenter.html';
    const keyToDelete = "selectedProduct";
    localStorage.removeItem(keyToDelete);
});

