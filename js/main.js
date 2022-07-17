let bars = document.querySelector(".fa-bars");
let close = document.querySelector(".fa-xmark")
let nav = document.querySelector("nav");

bars.addEventListener("click", function() {
    nav.classList.add("active");
})

close.addEventListener("click", function() {
    nav.classList.remove("active");
})

/****************************************/
let containerImgs = document.querySelector(".photo-player .imgs"); 
let mainImgs = Array.from(document.querySelectorAll(".photo-player .imgs img"));
let sliderImgs = Array.from(document.querySelectorAll(".slider div"));

let realWidth = (mainImgs[0].getBoundingClientRect().width + 40);
//To prevent the imgWidth become equal 40 (0 + 40) because the getBoundingClientRect() method make the width equal zero after reload the page
if(realWidth > 40) {
    window.sessionStorage.setItem("imgWidth", realWidth);
}
let imgWidth = +window.sessionStorage.getItem("imgWidth");
let currentWidth = 0;
let maxWidth = imgWidth * (mainImgs.length - 1);

//Sliding when imgslide is clicked 
for(let div of sliderImgs) {
    div.addEventListener("click", function() {
        //Active img slide
        sliderImgs.forEach(function(e) {
            e.classList.remove("active")
        })
        div.classList.add("active");
        
        //Active main img 
        mainImgs.forEach(function(img) {
            img.classList.remove("active");
            if(img.id === div.dataset.photo) {
                img.classList.add("active");
                currentWidth = imgWidth * mainImgs.indexOf(img);
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`;
                checkCurrentWidth();
            }
        })
    })
}

/****************************************/
let right = document.querySelector(".fa-angle-right");
let left = document.querySelector(".fa-angle-left");

//Add display class to left arrow when the page load first time
for(let img of mainImgs) {
    if(mainImgs.indexOf(img) === 0) {
        left.classList.add("display");
    }
}

left.addEventListener("click", function() {
    if(currentWidth > 0) {
        for(let img of mainImgs) {
            if(img.classList.contains("active")) {
                img.classList.remove("active");
                mainImgs[mainImgs.indexOf(img) - 1].classList.add("active");
                currentWidth -= imgWidth;
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`;
                checkCurrentWidth();
                //To stop looping after finding active img
                break;
            }
        }
        check()
    }
})

right.addEventListener("click", function() {
    if(currentWidth < maxWidth) {
        for(let img of mainImgs) {
            if(img.classList.contains("active")) {
                img.classList.remove("active");
                mainImgs[mainImgs.indexOf(img) + 1].classList.add("active");
                currentWidth = imgWidth * (mainImgs.indexOf(img) + 1);
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`;
                checkCurrentWidth();
                //To stop looping when active img is found
                break;
            }
        }
        check();
    }
})
/****************************************/

/****************************************/
let isDragging = false;
let startPostion = 0;
let currentTranslate = 0;
let distance = 0;
let currentIndex = 0;

//Add mouse slide events and touch slide events
mainImgs.forEach(function(img, index) {
    //To Prevent drag event
    img.addEventListener("dragstart", function(e) {
        e.preventDefault();
    })

    //Mouse Events
    {
        img.addEventListener("mousedown", start(index));
        img.addEventListener("mousemove", move);
        img.addEventListener("mouseup", end);
        img.addEventListener("mouseleave", end);
    }

    //Touch Events 
    {
        img.addEventListener("touchstart", start(index))
        img.addEventListener("touchmove", move)
        img.addEventListener("touchend", end)
    }
})

//To detect the postion of mouse when it is clicked down and active swiping effect
function start(index) {
    return function(event) {
        isDragging = true;
        currentIndex = index;
        startPostion = getPostion(event);
        this.classList.add("grabbing");
    }
}

//To make target img 
function move(event) {
    if(isDragging) {   
        let currentPosition = getPostion(event);
        currentTranslate = -currentWidth + currentPosition - startPostion;
        distance = currentPosition - startPostion;
        containerImgs.style.cssText = `
        transition: 0s;
        transform: translateX(${currentTranslate}px);
        `
    }
}

function end() {
    if(isDragging) {
        this.classList.remove("active");
                
        //right direction
        if(distance < -120) {
            if(currentIndex < mainImgs.length - 1) {
                mainImgs[currentIndex + 1].classList.add("active");
                currentWidth = imgWidth * (mainImgs.indexOf(this) + 1);
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`;
            }
            else {
                //Prevent scrolling when the last img active
                currentWidth = maxWidth;
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`
            }
        }
        //left direction
        else if(distance > 120) {
            if(currentIndex === 0) {
                //prevent scroll when the first img active
                currentWidth = 0;
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`
            }
            else {
                // Continue scrolling back normally
                mainImgs[currentIndex - 1].classList.add("active");
                currentWidth -= imgWidth;
                containerImgs.style.cssText = `transform: translateX(-${currentWidth}px)`
            }
        }
        else {
            containerImgs.style.cssText = `transform: translateX(-${imgWidth * currentIndex}px)`
        }
    }
    check();
    checkCurrentWidth();
    this.classList.remove("grabbing");
    isDragging = false;
}

//To detect the position where the mouse clickdown, move, clickup  
function getPostion(event){
    //To detect the postion when touch events are used
    if(event.type.includes("touch")) {
        return event.touches[0].clientX;
    }
    //To detect the position when mouse events are used
    else {
        return event.pageX;
    }
}
/****************************************/

/****************************************/
//Update imgwidth and slide to active img after resize
window.addEventListener("resize", function() {
    //Update the imgwidth variable on every screen 
    realWidth = (mainImgs[0].getBoundingClientRect().width + 40);
    if(realWidth > 40) {
        window.sessionStorage.setItem("imgWidth", realWidth);
    }
    imgWidth = window.sessionStorage.getItem("imgWidth");

    //Slide to the img that is active before resize
    mainImgs.forEach(function(img, index) {
        if(img.classList.contains("active")) {
            if(index < mainImgs.length - 1) {
                containerImgs.style.cssText = `transform: translateX(-${imgWidth * index}px)`;
            }
            else {
                containerImgs.style.cssText = `transform: translateX(-${imgWidth * (mainImgs.length - 1)}px)`;
            }
        }
    })
    console.log(imgWidth);
})
/****************************************/

/****************************************/
let cart = document.querySelector(".fa-cart-shopping");
let cartBox = document.querySelector(".market-car .adding");

cart.addEventListener("click", function() {
    cart.classList.toggle("active");
    cartBox.classList.toggle("active");
})

let spanNumber = document.querySelector(".controls .number");
spanNumber.textContent = 1;

let minusControl = document.querySelector(".controls .fa-minus");
let plusControl = document.querySelector(".controls .fa-plus");

plusControl.addEventListener("click", function() {
    spanNumber.textContent = ++spanNumber.textContent;
    checkAddButton();
})

minusControl.addEventListener("click", function() {
    if(spanNumber.textContent > 0) {
        spanNumber.textContent = --spanNumber.textContent;
    }
    checkAddButton();
})


let addButton = document.querySelector(".add-to-cart button");
let productTitle = document.querySelector(".product-title").textContent;
let productPrice = document.querySelector(".final-price span").textContent;
let addedContent = document.querySelector(".adding .content");

//Create span count of cart
let spanCount = document.createElement("span");
spanCount.classList.add("count");

//Create empty message paragraph
let p = document.createElement("p");
p.classList.add("empty");
p.textContent = "Your Cart is Empty";
if(addedContent.innerHTML == "") {
    addedContent.appendChild(p);
}

//Restore selected products after reload the page
window.addEventListener("load", function() {
    if(window.sessionStorage.getItem("cart")) {
        addedContent.innerHTML = window.sessionStorage.getItem("cart");

        if(+window.sessionStorage.getItem("count") > 0) {
            spanCount.textContent = window.sessionStorage.getItem("count");
            cart.appendChild(spanCount);
        }

        let trashes = Array.from (addedContent.querySelectorAll(".fa-trash-can"));
        trashes.forEach(function(trash) {
            trash.addEventListener("click", function() {
                spanCount.textContent -=  +trash.parentElement.querySelector(".number").textContent;
                trash.parentElement.remove();
                ckeckSpanCount()
                window.sessionStorage.setItem("count", spanCount.textContent);
                window.sessionStorage.setItem("cart", addedContent.innerHTML)
            });
        })
    }
})

//Add a product to cart
addButton.addEventListener("click", function() {
    if(!addButton.classList.contains("disable")) {
        checkEmpty() 
        createMainProduct();
        cartCount();
    }
})
/****************************************/


//Take the image src
function CreatImageContainer() {
    let activePhoto = document.createElement("img");
    activePhoto.src = document.querySelector(".slider div.active img").src;

    let photo = document.createElement("div");
    photo.classList.add("photo");
    photo.appendChild(activePhoto);

    return photo;
}

//Create the header the contain the info of the product
function CreateInfo() {
    let headerProduct = document.createElement("h5");
    headerProduct.textContent = productTitle;
    
    //Calculate the total price of the product
    let totalPrice = document.createElement("p");
    if(+spanNumber.textContent === 0) {
        +spanNumber.textContent++;
        totalPrice.innerHTML = `$${productPrice} x <span class = "number">${spanNumber.textContent}</span>  <span class = "total">$${+productPrice * spanNumber.textContent}.00</span>`;
    }
    else {
        totalPrice.innerHTML = `$${productPrice} x <span class = "number">${spanNumber.textContent}</span>  <span class = "total">$${+productPrice * spanNumber.textContent}.00</span>`
    }
    
    //Append info and total price in separated div
    let infoContainer = document.createElement("div");
    infoContainer.classList.add("info");
    infoContainer.appendChild(headerProduct);
    infoContainer.appendChild(totalPrice);

    return infoContainer;
}

//Create Trash icon with its remove event
function trashs() {
    //Create Trash icon
    let trash = document.createElement("i");
    trash.classList.add("fa-solid");
    trash.classList.add("fa-trash-can");
        
    //Add remove event
    trash.addEventListener("click", function() {
        spanCount.textContent -=  +trash.parentElement.querySelector(".number").textContent;
        trash.parentElement.remove();
        ckeckSpanCount()
        window.sessionStorage.setItem("count", spanCount.textContent);
        window.sessionStorage.setItem("cart", addedContent.innerHTML)
    });

    return trash;
}

//Appending the info of the product to main Product
function appending() {
    let selectedProduct = document.createElement("div");
    selectedProduct.classList.add("selected-product");
    selectedProduct.appendChild(CreatImageContainer());
    selectedProduct.appendChild(CreateInfo());
    selectedProduct.appendChild(trashs());
        
    return selectedProduct;
}

//Check if the cart contains empty message or not
function checkEmpty() {
    if(addedContent.childNodes.length == 1) {
        addedContent.innerHTML = "";
    }
}

//Take the numbe of the quntaty of product
function cartCount() {
    if(window.sessionStorage.getItem("count")) {
        spanCount.textContent = +window.sessionStorage.getItem("count") + +spanNumber.textContent; 
    }
    else {
        spanCount.textContent = spanNumber.textContent;
    }
    cart.appendChild(spanCount);
    window.sessionStorage.setItem("count", spanCount.innerHTML);
}

//Create main product
function createMainProduct() {
    //Create checkout button
    let chechout = document.createElement("button");
    chechout.classList.add("checkout");
    chechout.textContent = "Checkout";

    //Append the order in the content box
    if(addedContent.innerHTML == "") {
        addedContent.appendChild(appending());
        addedContent.appendChild(chechout);
    }
    else {
        addedContent.prepend(appending());
    }
    window.sessionStorage.setItem("cart", addedContent.innerHTML);
}

//Check if span count zero or not
function ckeckSpanCount() {
    spanCount.style.display = "flex";
    if(addedContent.children.length <= 1) {
        spanCount.style.display = "none";
        addedContent.innerHTML = "";
        addedContent.appendChild(p);
    }
}

//To add or remove display class from the left and right arrow
function checkCurrentWidth() {
    if(currentWidth === 0) {
        left.classList.add("display");
        right.classList.remove("display");
    }
    else if(currentWidth === maxWidth) {
        right.classList.add("display");
        left.classList.remove("display");
    }
    else {
        right.classList.remove("display");
        left.classList.remove("display");
    }
}

//Check Add button
function checkAddButton() {
    if(spanNumber.textContent <= 0) {
        addButton.classList.add("disable");
    }
    else {
        addButton.classList.remove("disable");
    }
}

//Check if small img of large img is active or not
function check() {
    mainImgs.forEach(function(img) {
        if(img.classList.contains("active")) {
            sliderImgs.forEach(function(div) {
                div.classList.remove("active")
                if(img.id === div.dataset.photo) {
                    div.classList.add("active");
                }
            })
        }
    })
}