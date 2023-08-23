import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");

// 1. get products

class Products {
  // get from api end point
  getProducts() {
    return productsData;
  }
}

// 2. display products

class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((product) => {
      result += `
       <div class="product">
         <div class="img-container">
           <img src=${product.imageUrl} class="product-img" />
         </div>
         <div class="product-desc">
           <p class="product-price">$ ${product.price}</p>
           <p class="product-title">${product.title}</p>
         </div>
         <button class="btn add-to-cart" data-id=${product.id}>
           <i class="fas fa-shopping-cart"></i>
           add to cart
         </button>
       </div>`;
    });

    productsDOM.innerHTML = result;
  }
}

// 3. storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();
  ui.displayProducts(productsData);

  Storage.saveProducts(productsData);
});

// Cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
