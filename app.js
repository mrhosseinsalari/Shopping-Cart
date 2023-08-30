import { productsData } from "./products.js";

let cart = [];
let buttonsDOM = [];

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

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
           add to cart
         </button>
       </div>`;
    });

    productsDOM.innerHTML = result;
  }

  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;

    addToCartBtns.forEach((btn) => {
      const id = Number(btn.dataset.id);

      // check if this product id is in cart or not !
      const isInCart = cart.find((product) => product.id === id);

      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        btn.innerText = "In Cart";
        btn.disabled = true;

        // get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        // add to cart
        cart = [...cart, addedProduct];

        // save cart to local storage
        Storage.saveCart(cart);

        // update cart value
        this.setCartValue(cart);

        // add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;

    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);

    cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
    </div>
    <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;

    cartContent.appendChild(div);
  }

  setupApp() {
    // get cart from storage
    cart = Storage.getCart() || [];

    // add to cart item
    cart.forEach((cartItem) => this.addCartItem(cartItem));

    // set cart value
    this.setCartValue(cart);
  }

  cartLogic() {
    // clear cart :
    clearCart.addEventListener("click", () => this.clearCart());
  }

  clearCart() {
    // remove : Don't Repeat Yourself (DRY)
    cart.forEach((item) => this.removeCartItem(item.id));

    // remove cart content children :
    while (cartContent.children.length) cartContent.children[0].remove();

    closeModalFunction();
  }

  removeCartItem(id) {
    // update cart
    cart = cart.filter((cItem) => cItem.id !== id);

    // update cart values
    this.setCartValue(cart);

    // update storage
    Storage.saveCart(cart);

    // get add to cart btns => update text and disable
    this.getSingleButton(id);
  }

  getSingleButton(id) {
    const button = buttonsDOM.find((btn) => Number(btn.dataset.id) === id);
    button.innerText = "add to cart";
    button.disabled = false;
  }
}

// 3. storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();

  // set up : get cart and set up app :
  ui.setupApp();

  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();

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
