import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || '';
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 480%22%3E%3Crect width=%22640%22 height=%22480%22 fill=%22%23f3ebe5%22/%3E%3Ctext x=%2250%25%22 y=%2252%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23793444%22 font-family=%22Georgia%22 font-size=%2244%22%3EDiva%3C/text%3E%3C/svg%3E';
const HERO_SLIDES = [
  {
    eyebrow: 'Deepak presents',
    title: 'Your Trust, Our Commitment',
    description: 'Beautiful Diwali décor, carefully chosen with care for your home and celebrations.',
    theme: 'trust'
  },
  {
    eyebrow: 'From Deepak’s collection',
    title: 'Brighten Every Moment',
    description: 'Handpicked décor and handcrafted treasures that add warmth, color, and joy.',
    theme: 'brighten'
  },
  {
    eyebrow: 'Deepak’s Diwali stories',
    title: 'Celebrate Tradition, Create Memories',
    description: 'Bring home timeless festive beauty with personal service and a welcoming shopping experience.',
    theme: 'tradition'
  }
];

function getProductImageUrl(image) {
  if (!image) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API}${image}`;
}

function handleImageError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [isPaused, activeSlide]);

  return (
    <section className="hero" data-theme={HERO_SLIDES[activeSlide].theme} aria-label="Diva Diwali collection highlights">
      <div className="hero-slides">
        {HERO_SLIDES.map((slide, index) => (
          <article
            key={slide.theme}
            className={`hero-slide hero-slide-${slide.theme}${index === activeSlide ? ' active' : ''}`}
            aria-hidden={index !== activeSlide}
          >
            <div className="hero-copy">
              <p className="eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <p className="hero-signature">— Deepak</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              {slide.theme === 'trust' && (
                <svg className="hero-artwork trust-artwork" viewBox="0 0 200 200">
                  <circle className="artwork-ring" cx="100" cy="100" r="82" />
                  <path className="artwork-line" d="M100 148V94M100 117c-22-3-34-18-35-39 21 1 36 13 35 39Zm0-15c2-25 17-39 39-40-1 22-14 37-39 40Zm-1 46c-23-1-37-13-42-33 20-1 36 10 42 33Zm2 0c5-23 21-34 42-33-5 20-20 32-42 33Zm-1-48c-7-7-11-15-11-25 10 3 17 10 20 20 3-10 10-17 20-20 0 10-4 18-12 25" />
                  <path className="artwork-line artwork-shield" d="M100 38 119 46v18c0 14-8 25-19 31-11-6-19-17-19-31V46l19-8Z" />
                  <path className="artwork-check" d="m92 63 6 6 12-14" />
                  <circle className="artwork-dot" cx="39" cy="89" r="3" />
                  <circle className="artwork-dot" cx="160" cy="106" r="3" />
                </svg>
              )}
              {slide.theme === 'brighten' && (
                <svg className="hero-artwork brighten-artwork" viewBox="0 0 200 200">
                  <circle className="artwork-sun" cx="100" cy="105" r="54" />
                  <path className="artwork-line" d="M100 20v16m0 138v16M20 105h16m128 0h16M43 48l12 12m90 90 12 12m0-114-12 12m-90 90-12 12" />
                  <path className="artwork-lantern" d="M76 76h48l-7 16v52l-17 13-17-13V92l-7-16Zm12 16h24m-24 42h24M91 65c0-6 4-10 9-10s9 4 9 10m-12-10v-9h6v9" />
                  <path className="artwork-flame" d="M100 101c-9 11 4 15 0 24 10-5 13-15 0-24Z" />
                  <circle className="artwork-dot" cx="48" cy="134" r="3" />
                  <circle className="artwork-dot" cx="151" cy="63" r="3" />
                </svg>
              )}
              {slide.theme === 'tradition' && (
                <svg className="hero-artwork tradition-artwork" viewBox="0 0 200 200">
                  <circle className="artwork-ring" cx="100" cy="100" r="78" />
                  <circle className="artwork-ring inner-ring" cx="100" cy="100" r="55" />
                  <path className="rangoli-petal" d="M100 35c10 15 10 28 0 39-10-11-10-24 0-39Zm0 91c10 12 10 25 0 39-10-14-10-27 0-39Zm-65-26c15-10 28-10 39 0-11 10-24 10-39 0Zm91 0c12-10 25-10 39 0-14 10-27 10-39 0ZM54 54c17 5 26 14 27 29-15-1-24-10-27-29Zm65 65c15 1 24 10 27 27-17-3-26-12-27-27Zm27-65c-3 17-12 26-27 29 1-15 10-24 27-29Zm-65 65c-1 15-10 24-27 27 3-17 12-26 27-27Z" />
                  <circle className="artwork-center" cx="100" cy="100" r="12" />
                  <circle className="artwork-dot" cx="100" cy="14" r="3" />
                  <circle className="artwork-dot" cx="100" cy="186" r="3" />
                  <circle className="artwork-dot" cx="14" cy="100" r="3" />
                  <circle className="artwork-dot" cx="186" cy="100" r="3" />
                </svg>
              )}
              <span className="hero-art-caption">
                {slide.theme === 'trust' && <>Chosen with<br />care and trust</>}
                {slide.theme === 'brighten' && <>A brighter home<br />for every moment</>}
                {slide.theme === 'tradition' && <>Tradition made<br />to be treasured</>}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="hero-controls" aria-label="Slogan slides">
        <div className="hero-dots">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.theme}
              type="button"
              className={`hero-dot${index === activeSlide ? ' active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-pressed={index === activeSlide}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero-pause"
          onClick={() => setIsPaused(paused => !paused)}
          aria-label={isPaused ? 'Play slogan slides' : 'Pause slogan slides'}
        >
          {isPaused ? '▶' : 'Ⅱ'}
        </button>
      </div>
    </section>
  );
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img
          className="product-image"
          src={getProductImageUrl(product.images && product.images[0])}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />
        {product.quantity <= 0 && <span className="stock-badge sold-out">Sold out</span>}
        {product.quantity > 0 && product.quantity <= 5 && <span className="stock-badge">Only {product.quantity} left</span>}
      </button>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">Diva collection</p>
          <h3>{product.name}</h3>
        </div>
        <div className="product-card-bottom">
          <span className="price">₹{product.price}</span>
          <button className="button button-small" onClick={() => onOpen(product)} disabled={product.quantity <= 0}>
            {product.quantity <= 0 ? 'Unavailable' : 'View product'}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductList({ onOpen }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchProducts(query = '') {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/store/products?limit=50&search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('We could not load products. Please try again.');
      const result = await response.json();
      setProducts(result.products || []);
    } catch (err) {
      setError(err.message || 'We could not load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    fetchProducts(search.trim());
  }

  return (
    <>
      <HeroCarousel />

      <section className="catalog-section" aria-label="Shop products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The collection</p>
            <h2>Shop all products</h2>
          </div>
          <span className="collection-caption">A little something for you</span>
        </div>
        <form className="search-bar" onSubmit={submitSearch} role="search">
          <label className="search-field">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              className="search-input"
              type="search"
              placeholder="Search the collection"
              value={search}
              onChange={event => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </label>
          <button className="button search-button" type="submit" disabled={loading}>Search</button>
        </form>

        {loading && <div className="notice-state" role="status">Finding lovely things for you…</div>}
        {!loading && error && (
          <div className="notice-state error-state" role="alert">
            <p>{error}</p>
            <button className="button button-secondary" onClick={() => fetchProducts(search.trim())}>Try again</button>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="notice-state">No products found. Try a different search.</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} onOpen={onOpen} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProductPage({ product, onBack, onBuy }) {
  if (!product) return null;

  const images = product.images && product.images.length ? product.images : [null];
  const available = product.quantity > 0;
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product?._id]);

  const maxQuantity = Math.min(product.quantity, 10);
  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxQuantity;
  const image = getProductImageUrl(images[activeImageIndex]);

  return (
    <section className="content-page product-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Back to the collection</button>
      <div className="product-layout">
        <div className="product-photo-wrap">
          <img className="product-photo" src={image} alt={product.name} onError={handleImageError} />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="product-image-arrow previous"
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                aria-label="Show previous product image"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                type="button"
                className="product-image-arrow next"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                aria-label="Show next product image"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              <div className="product-image-dots" role="group" aria-label="Choose product image">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`product-image-dot${index === activeImageIndex ? ' active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show image ${index + 1} of ${images.length}`}
                    aria-pressed={index === activeImageIndex}
                  />
                ))}
              </div>
            </>
          )}
          <span className={`detail-stock ${available ? '' : 'sold-out'}`}>
            {available ? `${product.quantity} in stock` : 'Currently unavailable'}
          </span>
        </div>
        <div className="product-info">
          <p className="eyebrow">The Diva collection</p>
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <div className="detail-rule" />
          <p className="description">{product.description || 'A thoughtful find, selected with care for the Diva collection.'}</p>
          <div className="delivery-note"><span aria-hidden="true">♡</span> Easy ordering, personal service, and cash on delivery.</div>
          <div className="quantity-selector" aria-label={`Select quantity for ${product.name}`}>
            <span>Quantity</span>
            <div className="quantity-controls">
              <button
                type="button"
                className="quantity-button"
                onClick={() => setQuantity(current => Math.max(1, current - 1))}
                disabled={!canDecrease}
                aria-label="Decrease quantity"
              >−</button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                className="quantity-button"
                onClick={() => setQuantity(current => Math.min(maxQuantity, current + 1))}
                disabled={!canIncrease}
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>
          <button className="button buy-button" onClick={() => onBuy(product, quantity)} disabled={!available}>
            {available ? `Buy ${quantity} product${quantity > 1 ? 's' : ''}` : 'Out of stock'}
            {available && <span aria-hidden="true">→</span>}
          </button>
          <p className="secure-note">You can review your details before placing your order.</p>
        </div>
      </div>
    </section>
  );
}

function LoginPage({ onGoogleSuccess, onProfileSuccess, onCancel, googleUser, requireProfile }) {
  const [name, setName] = useState(googleUser?.name || '');
  const [phone, setPhone] = useState(googleUser?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    if (!googleUser) return;
    setName(current => current || googleUser.name || '');
    setPhone(current => current || googleUser.phone || '');
  }, [googleUser]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '467903913101-evfpbnn8eb4i5n09diidu44vfgcdn1ft.apps.googleusercontent.com';
    const existingScript = document.querySelector('script[data-google-identity]');

    function renderGoogleButton() {
      if (!window.google?.accounts?.id || !document.getElementById('diva-google-signin')) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: response => {
          if (!response.credential) {
            setGoogleError('Google sign-in was cancelled.');
            return;
          }
          setGoogleError('');
          onGoogleSuccess(response.credential);
        }
      });
      window.google.accounts.id.renderButton(
        document.getElementById('diva-google-signin'),
        { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', logo_alignment: 'left' }
      );
      setGoogleReady(true);
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    const script = existingScript || document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';

    if (!existingScript) {
      script.onload = renderGoogleButton;
      document.head.appendChild(script);
    }

    return () => {
      if (!existingScript && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [onGoogleSuccess]);

  async function saveProfile(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const trimmedName = name.trim();
      const normalizedPhone = normalizePhone(phone);
      if (trimmedName.length < 2) throw new Error('Enter your name using at least 2 characters.');
      if (!normalizedPhone) throw new Error('Enter a valid mobile number.');

      const response = await fetch(`${API}/api/store/account/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: googleUser?.id, name: trimmedName, phone: normalizedPhone })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not save your account details.');

      const user = { ...googleUser, name: result.customer.name, phone: result.customer.phone };
      localStorage.setItem('diva_google_user', JSON.stringify(user));
      onProfileSuccess(user);
    } catch (err) {
      setError(err.message || 'We could not save your account details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="content-page login-page">
      <button className="back-link" onClick={onCancel}><span aria-hidden="true">←</span> Back to shopping</button>
      <div className="login-card">
        <span className="login-mark" aria-hidden="true">D</span>
        <p className="eyebrow">Welcome to Diva</p>
        <h1>
          {googleUser
            ? requireProfile
              ? 'Confirm your details'
              : googleUser.phone
                ? 'Welcome back'
                : 'Complete your account'
            : 'Sign in with Google'}
        </h1>
        <p className="login-intro">
          {googleUser && requireProfile
            ? 'Confirm your name and mobile number before continuing with your order.'
            : googleUser?.phone
              ? `You are signed in as ${googleUser.name}. Your account is ready to continue.`
              : googleUser
                ? `You are signed in as ${googleUser.name}. Enter your details so you can buy products and view your orders.`
                : 'Sign in with Google to continue. New accounts must provide a mobile number and name before buying.'}
        </p>

        {!googleUser && (
          <div className="login-methods">
            <div className="google-login-panel">
              <div id="diva-google-signin" aria-live="polite" />
              {googleError && <p className="form-error" role="alert">{googleError}</p>}
              {!googleReady && !googleError && <p className="login-status">Preparing Google sign-in…</p>}
            </div>
          </div>
        )}

        {googleUser && (requireProfile || !googleUser.phone) && (
          <form className="login-form" onSubmit={saveProfile}>
            <label htmlFor="login-name">Full name</label>
            <input
              id="login-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
            <label htmlFor="login-phone">Mobile number</label>
            <input
              id="login-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              required
              aria-describedby="login-phone-note"
            />
            <p id="login-phone-note" className="login-note">
              Enter a valid Indian mobile number. This will become your account’s default number for orders and delivery.
            </p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button login-submit" type="submit" disabled={submitting}>
              {submitting ? 'Saving your details…' : 'Save details and continue'}
            </button>
          </form>
        )}

        {googleUser && googleUser.phone && !requireProfile && (
          <button className="button login-submit" type="button" onClick={() => onProfileSuccess(googleUser)}>
            Continue
          </button>
        )}
      </div>
    </section>
  );
}

function CheckoutPage({ product, quantity, userPhone, accountId, onBack, onPlaced, onPhoneChange }) {
  const [name, setName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [society, setSociety] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState(userPhone);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmingOrder, setConfirmingOrder] = useState(false);

  const orderTotal = product ? product.price * quantity : 0;

  async function placeOrder() {
    if (!product) return;
    setPlacing(true);
    setError('');
    setError('');
    try {
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) throw new Error('Enter a valid mobile number.');
      if (normalizedPhone !== normalizePhone(userPhone) && accountId) {
        const response = await fetch(`${API}/api/store/account/phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: accountId, phone: normalizedPhone })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'We could not save your mobile number.');
        onPhoneChange(result.customer.phone);
      }
      const address = [
        houseNumber.trim(),
        society.trim(),
        area.trim(),
        landmark.trim() ? `Landmark: ${landmark.trim()}` : '',
        `${city.trim()}, ${state.trim()} ${pincode.trim()}`
      ].filter(Boolean).join(', ');
      const selectedQuantity = Math.max(1, Math.min(quantity || 1, product.quantity || quantity || 1));
      if (selectedQuantity > (product.quantity || 0)) {
        throw new Error('The selected quantity is no longer available.');
      }

      const response = await fetch(`${API}/api/store/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: normalizedPhone, address: address.trim() },
          items: [{ productId: product._id, quantity: selectedQuantity }]
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not place your order.');

      const history = JSON.parse(localStorage.getItem('diva_orders') || '[]');
      history.unshift({
        placedAt: new Date().toISOString(),
        product: { _id: product._id, name: product.name, price: product.price },
        quantity: selectedQuantity,
        name: name.trim(),
        phone: normalizedPhone,
        address: address.trim()
      });
      localStorage.setItem('diva_orders', JSON.stringify(history));
      setConfirmingOrder(false);
      onPlaced();
    } catch (err) {
      setError(err.message || 'We could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  function openConfirmation(event) {
    event.preventDefault();
    setConfirmingOrder(true);
  }

  if (!product) return null;

  return (
    <section className="content-page checkout-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Back to product</button>
      <div className="checkout-heading">
        <p className="eyebrow">Just a few details</p>
        <h1>Complete your order</h1>
        <p>Tell us where to send your find. Payment is cash on delivery.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery details</h2>
          <div className="form-group">
            <label htmlFor="customer-name">Full name</label>
            <input id="customer-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="customer-phone">Phone number</label>
            <input
              id="customer-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              placeholder="+91 98765 43210"
              required
            />
            <span className="field-hint">This is your account phone number for this order. You can change it before placing the order.</span>
          </div>
          <div className="form-group">
            <label htmlFor="house-number">House / flat number</label>
            <input
              id="house-number"
              autoComplete="address-line1"
              placeholder="e.g. Flat 204, House 12"
              value={houseNumber}
              onChange={event => setHouseNumber(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="society-name">Society / building name</label>
            <input
              id="society-name"
              autoComplete="address-line2"
              placeholder="Apartment or building name"
              value={society}
              onChange={event => setSociety(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="area-name">Area / locality</label>
            <input
              id="area-name"
              placeholder="Area or locality"
              value={area}
              onChange={event => setArea(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="landmark">Landmark or delivery instructions <span className="optional-label">(optional)</span></label>
            <input
              id="landmark"
              placeholder="Nearby landmark, gate, or delivery note"
              value={landmark}
              onChange={event => setLandmark(event.target.value)}
            />
          </div>
          <div className="address-city-state">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                autoComplete="address-level2"
                value={city}
                onChange={event => setCity(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                autoComplete="address-level1"
                value={state}
                onChange={event => setState(event.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pincode">PIN code</label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="6-digit PIN code"
              value={pincode}
              onChange={event => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              title="Enter a valid 6-digit PIN code"
              required
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button place-order-button" type="button" onClick={openConfirmation} disabled={placing}>
            {placing ? 'Placing your order…' : 'Place order'}
          </button>
          <p className="secure-note">Your order is only confirmed after checking the cash-on-delivery total.</p>
        </form>
        <aside className="order-summary">
          <p className="eyebrow">Your order</p>
          <div className="summary-product">
            <img
              src={getProductImageUrl(product.images && product.images[0])}
              alt=""
              onError={handleImageError}
            />
            <div><strong>{product.name}</strong><span>Quantity: {quantity}</span></div>
          </div>
          <div className="summary-line"><span>Subtotal</span><strong>₹{product.price * quantity}</strong></div>
          <div className="summary-line"><span>Delivery</span><strong>To be confirmed</strong></div>
          <div className="summary-total"><span>Total</span><strong>₹{orderTotal}</strong></div>
          <div className="payment-note"><span aria-hidden="true">♡</span> Cash on delivery</div>
        </aside>
      </div>

      {confirmingOrder && (
        <div className="order-confirmation" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title">
          <div className="order-confirmation-backdrop" onClick={() => setConfirmingOrder(false)} />
          <div className="order-confirmation-card">
            <span className="order-confirmation-icon" aria-hidden="true">₹</span>
            <p className="eyebrow">Cash on delivery</p>
            <h2 id="order-confirmation-title">Confirm your order</h2>
            <p className="order-confirmation-message">You should pay <strong>₹{orderTotal}</strong> when your order is delivered.</p>
            <div className="order-confirmation-breakdown">
              <span>{product.name}</span>
              <span>{quantity} × ₹{product.price}</span>
            </div>
            <div className="order-confirmation-actions">
              <button className="button button-secondary" type="button" onClick={() => setConfirmingOrder(false)}>Cancel</button>
              <button className="button" type="button" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing your order…' : 'Confirm and place order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return `+${digits}`;
}

function getOrderStatus(order) {
  if (order.status === 'cancelled') return 'Cancelled';
  if (order.status === 'rejected') return 'Rejected';
  if (order.status === 'accepted' || order.isAccepted === true) return 'Accepted';
  return 'Waiting';
}

function getStatusHistoryLabel(status) {
  const label = String(status || 'Updated');
  if (label === 'processing') return 'Accepted';
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDeliveryDate(dateValue) {
  if (!dateValue) return 'Delivery time will be confirmed';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Delivery time unavailable';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);
}

function History({ onShop, userPhone }) {
  const [allHistory, setAllHistory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('waiting');
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [confirmationPhone, setConfirmationPhone] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [counts, setCounts] = useState({ active: 0, cancelled: 0, waiting: 0, accepted: 0, rejected: 0 });

  const visibleOrders = activeTab === 'cancelled'
    ? allHistory.filter(order => order.status === 'cancelled')
    : allHistory.filter(order => order.status !== 'cancelled');

  function fetchOrders(status = activeTab) {
    setLoading(true);
    setError('');
    fetch(`${API}/api/store/orders?phone=${encodeURIComponent(userPhone)}&status=${encodeURIComponent(status)}`)
      .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not load your orders.');
        setAllHistory(result.orders || []);
        setCounts(result.counts || { active: 0, cancelled: 0, waiting: 0, accepted: 0, rejected: 0 });
      })
      .catch(err => {
        setError(err.message || 'Could not load your orders.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!userPhone) return;
    fetchOrders(activeTab);
  }, [userPhone]);

  useEffect(() => {
    if (!userPhone) return;
    fetchOrders(activeTab);
  }, [activeTab]);

  async function cancelOrder(order) {
    if (!order || !order._id) return;
    setCancelError('');
    setCancelingOrderId(order._id);
    try {
      const response = await fetch(`${API}/api/store/orders/${order._id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: confirmationPhone })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not cancel this order.');
      setConfirmationPhone('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      setCancelError(err.message || 'We could not cancel this order.');
    } finally {
      setCancelingOrderId(null);
    }
  }

  function closeDetails() {
    setSelectedOrder(null);
    setConfirmationPhone('');
    setCancelError('');
    setShowCancelForm(false);
  }

  function openCancelForm() {
    setShowCancelForm(true);
    setCancelError('');
    setConfirmationPhone('');
  }

  const activeCounts = {
    waiting: counts.waiting || 0,
    accepted: counts.accepted || 0,
    rejected: counts.rejected || 0,
    cancelled: counts.cancelled || 0
  };

  return (
    <section className="content-page history-page">
      <div className="section-heading">
        <div><p className="eyebrow">Your Diva account</p><h1>Order history</h1></div>
        <button className="button button-secondary" onClick={onShop}>Continue shopping</button>
      </div>

      <nav className="order-tabs" aria-label="Order status navigation">
        {[
          { id: 'waiting', label: 'Waiting', count: activeCounts.waiting },
          { id: 'accepted', label: 'Accepted', count: activeCounts.accepted },
          { id: 'rejected', label: 'Rejected', count: activeCounts.rejected },
          { id: 'cancelled', label: 'Cancelled', count: activeCounts.cancelled }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`order-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}<span>{tab.count}</span>
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="notice-state" role="status">Loading your orders…</div>
      ) : error ? (
        <div className="notice-state error-state" role="alert"><p>{error}</p></div>
      ) : visibleOrders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">♡</span>
          <h2>No {activeTab === 'cancelled' ? 'cancelled' : activeTab} orders</h2>
          <p>{activeTab === 'cancelled' ? 'Cancelled orders will appear here.' : `Your ${activeTab} orders will appear here.`}</p>
          <button className="button" onClick={onShop}>Explore the collection</button>
        </div>
      ) : (
        <div className="history-list">
          {visibleOrders.map(order => {
            const productName = order.items?.[0]?.productName || 'Diva product';
            const itemTotal = order.items?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || order.total || 0;
            const customer = order.customer || {};

            return (
              <article key={order._id} className="history-item">
                <button className="history-item-button" onClick={() => setSelectedOrder(order)}>
                  <div className="history-topline">
                    <div><p className="eyebrow">Placed {new Date(order.createdAt).toLocaleString()}</p><h2>{productName}</h2></div>
                    <strong className="price">₹{itemTotal}</strong>
                  </div>
                  <div className="history-details">
                    <span>Delivering to {customer.name}</span><span>{customer.phone}</span><span>{customer.address}</span>
                  </div>
                  <div className="history-footer">
                    <span className={`order-status ${order.status === 'cancelled' ? 'cancelled' : order.status === 'rejected' ? 'rejected' : order.status === 'accepted' || order.isAccepted ? 'accepted' : ''}`}>
                      {getOrderStatus(order)}
                    </span>
                    <span className="order-detail-link">View order details <span aria-hidden="true">→</span></span>
                  </div>
                </button>
                {order.status !== 'cancelled' && order.status !== 'rejected' && (
                  <div className="history-actions">
                    <button className="text-button cancel-button" onClick={() => { setSelectedOrder(order); setShowCancelForm(false); setConfirmationPhone(''); setCancelError(''); }}>Cancel order</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-details-title">
          <div className="order-modal-backdrop" onClick={closeDetails} />
          <div className="order-modal-card">
            <button className="order-modal-close" onClick={closeDetails} aria-label="Close order details">×</button>
            <div className="order-detail-hero">
              <div>
                <p className="eyebrow">Your order</p>
                <h2 id="order-details-title">{selectedOrder.orderNumber || 'Diva order'}</h2>
              </div>
              <span className={`order-badge ${selectedOrder.status === 'cancelled' ? 'cancelled' : selectedOrder.status === 'rejected' ? 'rejected' : selectedOrder.status === 'accepted' || selectedOrder.isAccepted ? 'accepted' : 'pending'}`}>
                {getOrderStatus(selectedOrder)}
              </span>
            </div>

            <div className="order-detail-grid">
              <section className="order-card-panel">
                <div className="panel-icon accent" aria-hidden="true">✓</div>
                <h3>Order summary</h3>
                <div className="detail-row"><span>Placed on</span><strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong></div>
                <div className="detail-row"><span>Order number</span><strong>{selectedOrder.orderNumber || 'Not available'}</strong></div>
                <div className="detail-row"><span>Items</span><strong>{selectedOrder.items?.map(item => `${item.productName} × ${item.quantity}`).join(', ') || 'Not available'}</strong></div>
                <div className="detail-row"><span>Total paid</span><strong>₹{selectedOrder.total}</strong></div>
              </section>

              <section className="order-card-panel">
                <div className="panel-icon" aria-hidden="true">✦</div>
                <h3>Delivery time</h3>
                <div className="delivery-time-card">
                  <small>Expected delivery</small>
                  <strong>{formatDeliveryDate(selectedOrder.deliveryDateTime)}</strong>
                </div>
                <p className="delivery-message">{selectedOrder.status === 'accepted' || selectedOrder.isAccepted ? 'Your order is accepted and scheduled for delivery.' : selectedOrder.status === 'cancelled' ? 'This order has been cancelled.' : selectedOrder.status === 'rejected' ? 'This order was rejected.' : 'Your order is waiting for acceptance.'}</p>
                {selectedOrder.statusHistory?.length > 0 && (
                  <div className="order-status-history" aria-label="Order status history">
                    {selectedOrder.statusHistory.map((entry, index) => (
                      <div className="detail-row" key={`${entry.status}-${entry.changedAt}-${index}`}>
                        <span>{getStatusHistoryLabel(entry.status)}</span>
                        <strong>{formatDeliveryDate(entry.changedAt)}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="order-card-panel customer-panel">
              <div className="panel-icon accent" aria-hidden="true">⌂</div>
              <h3>Delivery details</h3>
              <div className="detail-row"><span>Customer</span><strong>{selectedOrder.customer?.name || 'Not provided'}</strong></div>
              <div className="detail-row"><span>Phone</span><strong>{selectedOrder.customer?.phone || 'Not provided'}</strong></div>
              <div className="detail-row"><span>Address</span><strong>{selectedOrder.customer?.address || 'Not provided'}</strong></div>
            </section>

            {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'rejected' && (
              <div className="cancel-confirmation" aria-live="polite">
                <h3>Cancel this order</h3>
                <p>This action returns the product quantity to stock.</p>
                {!showCancelForm ? (
                  <button className="button cancel-order-button" type="button" onClick={openCancelForm}>
                    Cancel order
                  </button>
                ) : (
                  <>
                    <label htmlFor="cancel-phone-confirmation">Enter the mobile number for this order</label>
                    <input
                      id="cancel-phone-confirmation"
                      type="tel"
                      inputMode="tel"
                      value={confirmationPhone}
                      onChange={event => setConfirmationPhone(event.target.value)}
                      placeholder={userPhone}
                    />
                    {cancelError && <p className="form-error">{cancelError}</p>}
                    <div className="order-modal-actions">
                      <button className="button button-secondary" type="button" onClick={() => setShowCancelForm(false)}>Back</button>
                      <button
                        className="button cancel-confirm-button"
                        type="button"
                        disabled={
                          cancelingOrderId !== null ||
                          normalizePhone(confirmationPhone) !== normalizePhone(userPhone)
                        }
                        onClick={() => cancelOrder(selectedOrder)}
                      >
                        {cancelingOrderId === selectedOrder._id ? 'Cancelling…' : 'Confirm cancellation'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="order-modal-actions">
              <button className="button button-secondary" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AboutPage({ onShop }) {
  const [shop, setShop] = useState(null);
  const [shopError, setShopError] = useState('');

  async function loadShopDetails() {
    setShopError('');
    try {
      const response = await fetch(`${API}/api/store/shop`);
      if (!response.ok) throw new Error('We could not load the shop details.');
      const result = await response.json();
      setShop(result.shop);
    } catch (err) {
      setShopError(err.message || 'We could not load the shop details.');
    }
  }

  useEffect(() => {
    loadShopDetails();
  }, []);

  return (
    <section className="content-page about-page">
      <button className="back-link" onClick={onShop}><span aria-hidden="true">←</span> Back to the store</button>
      <div className="about-card">
        <p className="eyebrow">A little about us</p>
        <h1>Welcome to Diva Store</h1>
        <p className="about-intro">
          We bring together thoughtful finds and make it easy to discover something lovely for your everyday.
          We’re here to make your shopping experience feel personal, simple, and delightful.
        </p>
        <div className="detail-rule" />
        <div className="contact-section">
          <p className="eyebrow">We’d love to hear from you</p>
          <h2>Get in touch</h2>
          <div className="contact-links">
            <a className="contact-link" href="mailto:princep4732355@gmail.com">
              <span className="contact-icon" aria-hidden="true">@</span>
              <span><small>Email us</small><strong>princep4732355@gmail.com</strong></span>
            </a>
            <a className="contact-link" href="tel:+918980255345">
              <span className="contact-icon" aria-hidden="true">☎</span>
              <span><small>Call us</small><strong>+91 89802 55345</strong></span>
            </a>
          </div>
          {shopError && (
            <div className="shop-details-error" role="alert">
              <span>{shopError}</span>
              <button className="text-button" type="button" onClick={loadShopDetails}>Try again</button>
            </div>
          )}
          {shop && (
            <div className="shop-visit-card">
              <img
                className="shop-photo"
                src={getProductImageUrl(shop.photoUrl)}
                alt="Diva Diwali Decor and Handicrafts shop"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/shop-photo.jpg';
                }}
              />
              <div className="shop-visit-details">
                <p className="eyebrow">Come visit us</p>
                <h3>Diva Diwali Decor &amp; Handicrafts</h3>
                <p>Find us at our shop and explore our Diwali décor and handcrafted collection.</p>                <a className="button shop-directions" href={shop.locationUrl} target="_blank" rel="noreferrer">
                  Get directions <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfilePage({ user, onBack, onLogout }) {
  return (
    <section className="content-page profile-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Back to shopping</button>
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">{(user?.name || 'D').charAt(0).toUpperCase()}</div>
        <p className="eyebrow">Your Diva profile</p>
        <h1>{user?.name || 'Your profile'}</h1>
        <div className="profile-details">
          <div className="profile-detail"><span>Name</span><strong>{user?.name || 'Not available'}</strong></div>
          <div className="profile-detail"><span>Email</span><strong>{user?.email || 'Not available'}</strong></div>
          <div className="profile-detail"><span>Mobile number</span><strong>{user?.phone || 'Not available'}</strong></div>
        </div>
        <button className="button profile-logout-button" type="button" onClick={onLogout}>Log out</button>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [pendingCheckoutProduct, setPendingCheckoutProduct] = useState(null);
  const [pendingHistory, setPendingHistory] = useState(false);
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('diva_phone') || '');
  const [accountId, setAccountId] = useState(() => localStorage.getItem('diva_account_id') || '');
  const [googleUser, setGoogleUser] = useState(() => {
    try {
      const value = localStorage.getItem('diva_google_user');
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  });
  const [signInSuccess, setSignInSuccess] = useState(false);

  useEffect(() => {
    if (!signInSuccess) return undefined;

    const timer = window.setTimeout(() => setSignInSuccess(false), 3000);
    return () => window.clearTimeout(timer);
  }, [signInSuccess]);

  function showSignInSuccess() {
    setSignInSuccess(true);
  }

  function showProduct(product) {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo(0, 0);
  }

  function startCheckout(product, quantity = 1) {
    setCheckoutProduct(product);
    setCheckoutQuantity(Math.min(quantity, product.quantity || quantity));
    setPage('checkout');
    window.scrollTo(0, 0);
  }

  function buyProduct(product, quantity = 1) {
    if (userPhone) {
      startCheckout(product, quantity);
      return;
    }
    setPendingCheckoutProduct({ product, quantity });
    setPage('login');
    window.scrollTo(0, 0);
  }

  function finishLogin(user) {
    const phone = user?.phone || '';
    localStorage.setItem('diva_phone', phone);
    setUserPhone(phone);
    setGoogleUser(user);
    setAccountId(user?.id || accountId);
    showSignInSuccess();
    if (pendingCheckoutProduct) {
      const { product, quantity } = pendingCheckoutProduct;
      setPendingCheckoutProduct(null);
      startCheckout(product, quantity);
      return;
    }
    if (pendingHistory) {
      setPendingHistory(false);
      setPage('history');
      window.scrollTo(0, 0);
      return;
    }
    setPage('shop');
    window.scrollTo(0, 0);
  }

  async function handleGoogleSuccess(credential) {
    try {
      const response = await fetch(`${API}/api/store/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Google sign-in failed.');

      const user = {
        id: result.customer.id,
        name: result.customer.name,
        email: result.customer.email,
        phone: result.customer.phone || ''
      };
      localStorage.setItem('diva_google_user', JSON.stringify(user));
      localStorage.setItem('diva_account_id', user.id);
      setGoogleUser(user);
      setAccountId(user.id);
      if (user.phone && !pendingCheckoutProduct) {
        finishLogin(user);
      } else {
        setPage('login');
      }
    } catch (error) {
      setGoogleUser(null);
      console.error(error);
      setPage('login');
      window.scrollTo(0, 0);
    }
  }

  function cancelLogin() {
    setPendingCheckoutProduct(null);
    setPendingHistory(false);
    setPage(selectedProduct ? 'product' : 'shop');
    window.scrollTo(0, 0);
  }

  function signOut() {
    localStorage.removeItem('diva_phone');
    localStorage.removeItem('diva_google_user');
    localStorage.removeItem('diva_account_id');
    setUserPhone('');
    setAccountId('');
    setGoogleUser(null);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.revoke(googleUser?.email || '', () => {});
    }
    setPage('shop');
    window.scrollTo(0, 0);
  }

  function handlePhoneChange(phone) {
    localStorage.setItem('diva_phone', phone);
    setUserPhone(phone);
  }

  function goToShop() {
    setPage('shop');
    window.scrollTo(0, 0);
  }

  function goToAbout() {
    setPage('about');
    window.scrollTo(0, 0);
  }

  function goToHistory() {
    if (!userPhone) {
      setPendingHistory(true);
      setPage('login');
      window.scrollTo(0, 0);
      return;
    }
    setPage('history');
    window.scrollTo(0, 0);
  }

  function returnToProduct() {
    setPage('product');
    window.scrollTo(0, 0);
  }

  function finishOrder() {
    setCheckoutProduct(null);
    setSelectedProduct(null);
    setPage('history');
    window.scrollTo(0, 0);
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={goToShop} aria-label="Diva Store home">
            <img src="/diva-logo.png" alt="" />
          </button>
          <nav className="main-nav" aria-label="Main navigation">
            <button className={page !== 'history' ? 'nav-link active' : 'nav-link'} onClick={goToShop}>Shop</button>
            <button className={page === 'history' ? 'nav-link active' : 'nav-link'} onClick={goToHistory}>My orders</button>
            {googleUser || userPhone ? (
              <button className={page === 'profile' ? 'nav-link active account-link' : 'nav-link account-link'} onClick={() => setPage('profile')} aria-label={`Open profile for ${googleUser?.email || userPhone}`}>
                <span className="account-phone">{googleUser?.name || `•••• ${userPhone.slice(-4)}`}</span><span>Profile</span>
              </button>
            ) : (
              <button
                className={page === 'login' ? 'nav-link active' : 'nav-link'}
                onClick={() => { setPendingCheckoutProduct(null); setPage('login'); window.scrollTo(0, 0); }}
              >
                Sign in
              </button>
            )}
          </nav>
          <span className="header-note">A little joy, delivered.</span>
        </div>
      </header>
      {signInSuccess && (
        <div className="sign-in-popup" role="status" aria-live="polite">
          <div className="sign-in-popup-content">
            <span className="sign-in-popup-icon" aria-hidden="true">✓</span>
            <div>
              <strong>Login complete</strong>
              <p>You can now buy products and view your orders.</p>
            </div>
            <button className="sign-in-popup-close" type="button" aria-label="Close sign-in confirmation" onClick={() => setSignInSuccess(false)}>
              ×
            </button>
          </div>
        </div>
      )}
      <main className="container">
        {page === 'shop' && <ProductList onOpen={showProduct} />}
        {page === 'product' && (
          <ProductPage product={selectedProduct} onBack={goToShop} onBuy={buyProduct} />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            product={checkoutProduct}
            quantity={checkoutQuantity}
            userPhone={userPhone}
            accountId={accountId}
            onBack={returnToProduct}
            onPlaced={finishOrder}
            onPhoneChange={handlePhoneChange}
          />
        )}
        {page === 'history' && userPhone && <History onShop={goToShop} userPhone={userPhone} />}
        {page === 'profile' && googleUser && (
          <ProfilePage user={googleUser} onBack={goToShop} onLogout={signOut} />
        )}
        {page === 'login' && (
          <LoginPage
            onGoogleSuccess={handleGoogleSuccess}
            onProfileSuccess={finishLogin}
            onCancel={cancelLogin}
            googleUser={googleUser}
            requireProfile={Boolean(pendingCheckoutProduct)}
          />
        )}
        {page === 'about' && <AboutPage onShop={goToShop} />}
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img className="footer-brand-logo" src="/diva-logo.png" alt="Diva Diwali Decor and Handicrafts" />
            <div>
              <strong>Diva Store</strong>
              <p>Thoughtful finds, made simple.</p>
            </div>
          </div>
          <div className="footer-contact-group">
            <h2>Get in touch</h2>
            <a className="footer-contact" href="mailto:princep4732355@gmail.com">
              <span aria-hidden="true">@</span> princep4732355@gmail.com
            </a>
            <a className="footer-contact" href="tel:+918980255345">
              <span aria-hidden="true">☎</span> +91 89802 55345
            </a>
          </div>
          <div className="footer-about">
            <h2>Discover Diva</h2>
            <p>A little joy, thoughtfully picked for your everyday.</p>
            <button className="footer-link" onClick={goToAbout}>About &amp; contact <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Diva Store</span>
          <span>Made with care for you.</span>
        </div>
      </footer>
    </div>
  );
}
