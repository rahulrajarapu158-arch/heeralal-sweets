/**
 * RAMNIVAS SWEETS & NAMKEENS - MAIN INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initMobileDrawer();
  initCategoryFiltering();
  initSearch();
  initWhatsAppOrderModal();
  initGiftBoxBuilder();
  initReviewsCarousel();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS & HEADER
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progressPercent = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER MENU
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. PRODUCT CATEGORY FILTERING & SEARCH
   -------------------------------------------------------------------------- */
function initCategoryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const noResults = document.getElementById('no-results');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const inlineSearchInput = document.getElementById('inline-search-input');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const categoryMatch = (currentCategory === 'all') || (card.dataset.category === currentCategory);
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const searchMatch = !currentSearchQuery || name.includes(currentSearchQuery.toLowerCase());

      if (categoryMatch && searchMatch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  if (inlineSearchInput) {
    inlineSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      applyFilters();
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      currentCategory = 'all';
      currentSearchQuery = '';
      if (inlineSearchInput) inlineSearchInput.value = '';
      filterBtns.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.filter === 'all') b.classList.add('active');
      });
      applyFilters();
    });
  }
}

/* --------------------------------------------------------------------------
   4. LIVE SEARCH OVERLAY MODAL
   -------------------------------------------------------------------------- */
function initSearch() {
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchModal = document.getElementById('search-modal');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const liveSearchInput = document.getElementById('live-search-input');
  const quickTagBtns = document.querySelectorAll('.quick-tag-btn');
  const inlineSearchInput = document.getElementById('inline-search-input');

  if (searchTriggerBtn && searchModal) {
    searchTriggerBtn.addEventListener('click', () => {
      searchModal.showModal();
      if (liveSearchInput) liveSearchInput.focus();
    });

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', () => {
        searchModal.close();
      });
    }

    quickTagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        if (inlineSearchInput) {
          inlineSearchInput.value = query;
          inlineSearchInput.dispatchEvent(new Event('input'));
        }
        searchModal.close();
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    if (liveSearchInput) {
      liveSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = liveSearchInput.value.trim();
          if (inlineSearchInput) {
            inlineSearchInput.value = query;
            inlineSearchInput.dispatchEvent(new Event('input'));
          }
          searchModal.close();
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

/* --------------------------------------------------------------------------
   5. WHATSAPP QUICK ORDER MODAL
   -------------------------------------------------------------------------- */
function initWhatsAppOrderModal() {
  const orderModal = document.getElementById('order-modal');
  const orderModalClose = document.getElementById('order-modal-close');
  const orderTriggers = document.querySelectorAll('.order-trigger-btn');
  
  const modalItemTitle = document.getElementById('modal-item-title');
  const modalUnitRate = document.getElementById('modal-unit-rate');
  const modalCalculatedPrice = document.getElementById('modal-calculated-price');
  const itemQtySelect = document.getElementById('item-qty-select');
  const confirmWaOrderBtn = document.getElementById('confirm-wa-order-btn');

  let activeItemName = '';
  let activeItemUnitPrice = 0;

  function updateCalculatedPrice() {
    const qty = parseFloat(itemQtySelect.value) || 1.0;
    const total = Math.round(activeItemUnitPrice * qty);
    modalCalculatedPrice.textContent = `₹${total}`;
  }

  orderTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      activeItemName = btn.dataset.name || 'Sweets';
      activeItemUnitPrice = parseFloat(btn.dataset.price) || 450;

      if (modalItemTitle) modalItemTitle.textContent = `Order ${activeItemName}`;
      if (modalUnitRate) modalUnitRate.textContent = `₹${activeItemUnitPrice}/kg`;
      
      updateCalculatedPrice();
      if (orderModal) orderModal.showModal();
    });
  });

  if (itemQtySelect) {
    itemQtySelect.addEventListener('change', updateCalculatedPrice);
  }

  if (orderModalClose && orderModal) {
    orderModalClose.addEventListener('click', () => orderModal.close());
  }

  if (confirmWaOrderBtn) {
    confirmWaOrderBtn.addEventListener('click', () => {
      const qtyText = itemQtySelect.options[itemQtySelect.selectedIndex].text;
      const totalAmount = modalCalculatedPrice.textContent;
      
      const message = `Hi Ramnivas Sweets! I would like to order:\n\n` +
                      `• Item: ${activeItemName}\n` +
                      `• Quantity: ${qtyText}\n` +
                      `• Total Estimated: ${totalAmount}\n\n` +
                      `Please confirm availability & delivery details. Thank you!`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/917032976159?text=${encodedMsg}`, '_blank');
      
      if (orderModal) orderModal.close();
    });
  }
}

/* --------------------------------------------------------------------------
   6. CUSTOM GIFT BOX BUILDER
   -------------------------------------------------------------------------- */
function initGiftBoxBuilder() {
  const boxTypeSelect = document.getElementById('gift-box-type');
  const boxWeightSelect = document.getElementById('gift-box-weight');
  const sweetCheckboxes = document.querySelectorAll('input[name="gift-sweet"]');
  const giftTotalPriceEl = document.getElementById('gift-total-price');
  const orderGiftBoxBtn = document.getElementById('order-gift-box-btn');

  function calculateGiftBoxPrice() {
    const weight = parseFloat(boxWeightSelect.value) || 1.0;
    
    // Base sweet price per kg (average premium sweet mix)
    let baseRate = 500;
    let packagingFee = 100;

    if (boxTypeSelect.value.includes('Diwali')) packagingFee = 150;
    if (boxTypeSelect.value.includes('Wedding')) packagingFee = 200;

    const total = Math.round((baseRate * weight) + packagingFee);
    if (giftTotalPriceEl) giftTotalPriceEl.textContent = `₹${total}`;
  }

  if (boxTypeSelect) boxTypeSelect.addEventListener('change', calculateGiftBoxPrice);
  if (boxWeightSelect) boxWeightSelect.addEventListener('change', calculateGiftBoxPrice);
  sweetCheckboxes.forEach(cb => cb.addEventListener('change', calculateGiftBoxPrice));

  if (orderGiftBoxBtn) {
    orderGiftBoxBtn.addEventListener('click', () => {
      const boxType = boxTypeSelect.options[boxTypeSelect.selectedIndex].text;
      const weightText = boxWeightSelect.options[boxWeightSelect.selectedIndex].text;
      
      const selectedSweets = Array.from(sweetCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .join(', ');

      const totalPrice = giftTotalPriceEl.textContent;

      const message = `Hi Ramnivas Sweets! I would like to order a Custom Mithai Gift Box:\n\n` +
                      `🎁 Box Type: ${boxType}\n` +
                      `⚖️ Weight: ${weightText}\n` +
                      `🍬 Sweets Included: ${selectedSweets || 'Assorted Pure Ghee Sweets'}\n` +
                      `💰 Total Estimated: ${totalPrice}\n\n` +
                      `Please contact me to confirm the custom packaging details. Thank you!`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/917032976159?text=${encodedMsg}`, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   7. REVIEWS CAROUSEL
   -------------------------------------------------------------------------- */
function initReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('rev-prev-btn');
  const nextBtn = document.getElementById('rev-next-btn');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.review-card');
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Auto-play slide every 6 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 6000);
}
