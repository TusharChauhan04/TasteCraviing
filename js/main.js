/**
 * TasteCraviing — js/main.js
 *
 * Main JavaScript for all pages. Handles:
 *  1. Auto copyright year
 *  2. Cart state + badge + "Add to Cart" feedback
 *  3. Cart page rendering + quantity/remove controls
 *  4. Menu category filter tabs (menu.html)
 *  5. Contact form submit handler + toast
 *  6. Countdown timers (offers.html)
 *  7. Mobile hamburger nav drawer (all pages)
 *
 * Load before </body> on every page.
 */

/* ============================================================
   UTILITY: Run code after DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    initCopyrightYear();
    initMobileNav();
    initCart();
    initMenuFilter();
    initContactForm();
    initCountdownTimers();
    initToast();
    initScrollAnimations();

    // Cart page — only runs if we're on cart.html
    if (document.getElementById('cart-page-root')) {
        initCartPage();
    }

});

/* ============================================================
   1. AUTO COPYRIGHT YEAR
   ============================================================ */
function initCopyrightYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.copyright-year').forEach(el => {
        el.textContent = year;
    });
}

/* ============================================================
   2. CART SYSTEM
      - cartItems: array of { id, name, price, qty }
      - Persisted to localStorage (survives page closes)
      - Badge updates on every page load
   ============================================================ */
let cartItems = [];

function initCart() {
    loadCart();
    updateCartBadge();
    bindAddToCartButtons();
}

function loadCart() {
    try {
        const saved = localStorage.getItem('tc_cart');
        cartItems = saved ? JSON.parse(saved) : [];
    } catch (e) {
        cartItems = [];
    }
}

function saveCart() {
    localStorage.setItem('tc_cart', JSON.stringify(cartItems));
}

function getCartId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function addToCart(name, price) {
    const id = getCartId(name);
    const existing = cartItems.find(i => i.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cartItems.push({ id, name, price: parseFloat(price), qty: 1 });
    }
    saveCart();
    updateCartBadge();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
}

function updateItemQty(id, delta) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartBadge();
    }
}

function clearCart() {
    cartItems = [];
    saveCart();
    updateCartBadge();
}

function getCartTotal() {
    return cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
    return cartItems.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden');
            badge.classList.add('flex');
        } else {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }
    });
}

function bindAddToCartButtons() {
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name  = btn.dataset.item  || 'Item';
            const price = btn.dataset.price || '0';
            addToCart(name, price);

            // Visual feedback
            const original = btn.innerHTML;
            btn.classList.add('added');
            btn.innerHTML = `<span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1">check_circle</span> Added!`;
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = original;
            }, 1400);

            showToast(`${name} added to cart! 🛒`);
        });
    });
}

/* ============================================================
   3. CART PAGE (cart.html only)
      Renders items from localStorage, handles qty and remove.
   ============================================================ */
function initCartPage() {
    renderCartPage();
}

function renderCartPage() {
    const root        = document.getElementById('cart-page-root');
    const emptyState  = document.getElementById('cart-empty');
    const filledState = document.getElementById('cart-filled');
    const itemsList   = document.getElementById('cart-items-list');
    const subtotalEl  = document.getElementById('cart-subtotal');
    const totalEl     = document.getElementById('cart-total');
    const countEl     = document.getElementById('cart-item-count');

    if (!root) return;

    const DELIVERY_FEE = 49;
    const subtotal = getCartTotal();
    const total    = subtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0);
    const count    = getCartCount();

    // Show/hide states
    if (cartItems.length === 0) {
        emptyState?.classList.remove('hidden');
        filledState?.classList.add('hidden');
        return;
    }

    emptyState?.classList.add('hidden');
    filledState?.classList.remove('hidden');

    // Update counts and totals
    if (countEl) countEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(0)}`;
    if (totalEl)    totalEl.textContent    = `₹${total.toFixed(0)}`;

    if (!itemsList) return;

    // Build the items list HTML
    itemsList.innerHTML = cartItems.map(item => `
        <div class="cart-item relative grid grid-cols-[auto_1fr] md:flex md:items-center gap-x-4 gap-y-3 md:gap-6 bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline-variant/10" data-id="${item.id}">
            <!-- Icon placeholder - Hide on tiny screens if needed, or keep small -->
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl md:text-3xl text-primary" style="font-variation-settings:'FILL' 1">breakfast_dining</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0 pr-8 md:pr-0">
                <h3 class="font-headline font-bold text-lg md:text-xl text-on-surface truncate">${item.name}</h3>
                <p class="text-primary font-black text-base md:text-lg mt-0.5 md:mt-1">₹${item.price.toFixed(0)} <span class="text-on-surface-variant font-normal text-xs md:text-sm">each</span></p>
            </div>

            <!-- Qty Controls & Line Total - Stacks on mobile, row on desktop -->
            <div class="col-start-2 flex flex-wrap items-center justify-between md:justify-end gap-4 md:gap-6 mt-1 md:mt-0">
                <!-- Qty Controls -->
                <div class="flex items-center gap-3 bg-surface-container-high md:bg-transparent px-2 md:px-0 py-1 md:py-0 rounded-full shrink-0">
                    <button type="button"
                        class="qty-btn w-8 h-8 md:w-9 md:h-9 rounded-full bg-surface-container-highest text-on-surface font-black text-lg flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90"
                        data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
                    <span class="qty-display w-6 text-center font-black text-on-surface text-base md:text-lg">${item.qty}</span>
                    <button type="button"
                        class="qty-btn w-8 h-8 md:w-9 md:h-9 rounded-full bg-surface-container-highest text-on-surface font-black text-lg flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90"
                        data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
                </div>
                
                <!-- Line Total -->
                <div class="text-right shrink-0 min-w-[70px]">
                    <p class="font-black text-lg md:text-xl text-on-surface">₹${(item.price * item.qty).toFixed(0)}</p>
                </div>
            </div>

            <!-- Remove Button - Positioned absolutely on mobile for cleaner look -->
            <button type="button"
                class="remove-btn absolute top-4 right-4 md:static material-symbols-outlined text-on-surface-variant hover:text-error transition-colors active:scale-90 shrink-0"
                data-id="${item.id}" aria-label="Remove ${item.name}">
                close
            </button>
        </div>
    `).join('');

    // Bind qty buttons
    itemsList.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id    = btn.dataset.id;
            const delta = parseInt(btn.dataset.delta);
            updateItemQty(id, delta);
            renderCartPage(); // re-render
        });
    });

    // Bind remove buttons
    itemsList.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id   = btn.dataset.id;
            const name = cartItems.find(i => i.id === id)?.name || 'Item';
            removeFromCart(id);
            renderCartPage(); // re-render
            showToast(`${name} removed from cart.`);
        });
    });
}

/* ============================================================
   4. MENU CATEGORY FILTER TABS (menu.html only)
   ============================================================ */
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const sections   = document.querySelectorAll('[data-category]');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.filter;

            filterBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary');
                b.classList.add('bg-surface-container-highest', 'text-on-surface');
            });
            btn.classList.remove('bg-surface-container-highest', 'text-on-surface');
            btn.classList.add('bg-primary', 'text-on-primary');

            if (target === 'all') {
                sections.forEach(s => { s.style.display = ''; });
            } else {
                sections.forEach(s => {
                    s.style.display = s.dataset.category === target ? '' : 'none';
                });
            }
        });
    });
}

/* ============================================================
   5. CONTACT FORM HANDLER (contact.html only)
   ============================================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = form.querySelector('#name')?.value.trim();
        const phone   = form.querySelector('#phone')?.value.trim();
        const message = form.querySelector('#message')?.value.trim();

        if (!name)    { showToast('Please enter your name 😊', 'error'); return; }
        if (!phone)   { showToast('Please enter your phone number 📞', 'error'); return; }
        if (!message) { showToast('Please write a message 💬', 'error'); return; }

        form.reset();
        showToast("Message sent! We'll craving-back soon 🧇");
    });
}

/* ============================================================
   6. COUNTDOWN TIMERS (offers.html only)
   ============================================================ */
function initCountdownTimers() {
    const timers = [
        { id: 'timer-1', key: 'tc_timer_1', initial: 4 * 3600 + 22 * 60 + 10 },
        { id: 'timer-2', key: 'tc_timer_2', initial: 2 * 3600 + 15 * 60 + 45 },
        { id: 'timer-3', key: 'tc_timer_3', initial: 6 * 3600 + 0  * 60 +  0 },
    ];

    timers.forEach(({ id, key, initial }) => {
        const el = document.getElementById(id);
        if (!el) return;

        let remaining = parseInt(localStorage.getItem(key)) || initial;

        function tick() {
            if (remaining <= 0) {
                el.textContent = 'Offer Ended';
                el.classList.add('opacity-40', 'line-through');
                return;
            }
            const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
            const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
            const s = String(remaining % 60).padStart(2, '0');
            el.textContent = `${h}:${m}:${s}`;
            remaining--;
            localStorage.setItem(key, remaining);
        }

        tick();
        setInterval(tick, 1000);
    });
}

/* ============================================================
   7. MOBILE HAMBURGER NAV DRAWER (all pages)
   ============================================================ */
function initMobileNav() {
    const btn     = document.getElementById('hamburger-btn');
    const nav     = document.getElementById('mobile-nav');
    const overlay = document.getElementById('mobile-nav-overlay');

    if (!btn || !nav) return;

    function openNav() {
        nav.classList.add('open');
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
        btn.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
        nav.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
        btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', () => {
        nav.classList.contains('open') ? closeNav() : openNav();
    });

    overlay?.addEventListener('click', closeNav);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });
}

/* ============================================================
   8. TOAST NOTIFICATION SYSTEM
   ============================================================ */
function initToast() {
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Clear any existing timer
    if (toast._hideTimer) clearTimeout(toast._hideTimer);

    toast.textContent = message;
    toast.style.background = type === 'error' ? '#ba1a1a' : '#b0004a';
    toast.classList.add('show');

    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ============================================================
   9. SCROLL-TRIGGERED ANIMATIONS
      Detects when elements enter the viewport.
   ============================================================ */
function initScrollAnimations() {
    console.log('Initializing scroll animations Observer (0.05 threshold)...');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Trigger early as soon as 5% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element in view:', entry.target);
                entry.target.classList.add('is-in-view');
            } else {
                entry.target.classList.remove('is-in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
