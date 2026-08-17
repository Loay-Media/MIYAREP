// --- Global Cart State ---
let cart = [];

// --- Dynamic Price Updates ---
// Listens to radio button changes and updates the displayed price
document.querySelectorAll('.size-selector').forEach(selector => {
    const radios = selector.querySelectorAll('input[type="radio"]');
    const priceDisplay = selector.nextElementSibling.querySelector('.price-val');
    
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Add a small fade animation on price change
            priceDisplay.style.opacity = 0;
            setTimeout(() => {
                priceDisplay.textContent = e.target.value;
                priceDisplay.style.opacity = 1;
            }, 200);
        });
    });
});

// --- Cart Logic ---
function addToCart(itemName, radioGroupName) {
    // Get the selected size and price
    const selected = document.querySelector(`input[name="${radioGroupName}"]:checked`);
    const price = parseInt(selected.value);
    const size = selected.dataset.size;
    
    const item = {
        id: Date.now(),
        name: itemName,
        size: size,
        price: price
    };
    
    cart.push(item);
    updateCartUI();
    showToast();
}

function addSingleItemToCart(itemName, price) {
    const item = {
        id: Date.now(),
        name: itemName,
        size: 'Regular',
        price: price
    };
    
    cart.push(item);
    updateCartUI();
    showToast();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    
    // Update Badge
    cartCount.textContent = cart.length;
    
    // Clear Container
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--gray-400); text-align:center; margin-top: 2rem;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item fade-up visible'; // Reuse animation class
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} | EGP ${item.price}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    
    totalPriceEl.textContent = total;
}

// --- Cart Sidebar Toggle ---
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Visual feedback when adding to cart
function showToast() {
    const cartIcon = document.querySelector('.cart-icon i');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// --- Checkout Logic ---
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload
    
    if(cart.length === 0) {
        alert("Please add items to your cart first.");
        return;
    }
    
    // Pattern validation is handled by HTML5, if it gets here, it's valid.
    toggleCart();
    
    // Show success modal
    const successModal = document.getElementById('success-modal');
    successModal.classList.add('active');
    
    // Clear cart
    cart = [];
    updateCartUI();
    this.reset(); // Reset form fields
});

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
}

// --- Scroll Animations (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.fade-up');
    elementsToAnimate.forEach(el => observer.observe(el));
});
