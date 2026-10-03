import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API || 'http://localhost:4000';
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 480%22%3E%3Crect width=%22640%22 height=%22480%22 fill=%22%23f3ebe5%22/%3E%3Ctext x=%2250%25%22 y=%2252%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23793444%22 font-family=%22Georgia%22 font-size=%2244%22%3EDiva%3C/text%3E%3C/svg%3E';

function handleImageError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img
          className="product-image"
          src={product.images && product.images[0] ? `${API}${product.images[0]}` : FALLBACK_IMAGE}
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
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Thoughtfully chosen, made to be loved</p>
          <h1>Find something <em>beautiful.</em></h1>
          <p>Explore the Diva collection and find your next everyday favourite.</p>
        </div>
        <div className="hero-note" aria-hidden="true">
          <span>Made for</span>
          <strong>your<br />everyday</strong>
          <span className="hero-sparkle">✳</span>
        </div>
      </section>

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

  const image = product.images && product.images[0] ? `${API}${product.images[0]}` : FALLBACK_IMAGE;
  const available = product.quantity > 0;

  return (
    <section className="content-page product-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Back to the collection</button>
      <div className="product-layout">
        <div className="product-photo-wrap">
          <img className="product-photo" src={image} alt={product.name} onError={handleImageError} />
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
          <button className="button buy-button" onClick={() => onBuy(product)} disabled={!available}>
            {available ? 'Buy this product' : 'Out of stock'}
            {available && <span aria-hidden="true">→</span>}
          </button>
          <p className="secure-note">You can review your details before placing your order.</p>
        </div>
      </div>
    </section>
  );
}

function LoginPage({ onSuccess, onCancel }) {
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/store/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not save your number.');
      onSuccess(result.customer.phone);
    } catch (err) {
      setError(err.message || 'We could not sign you in. Please try again.');
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
        <h1>Sign in to continue</h1>
        <p className="login-intro">Use your mobile number to continue to checkout and keep your shopping simple.</p>
        <form className="login-form" onSubmit={signIn}>
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
            Enter a 10-digit Indian number or include your country code. We save it to MongoDB, but do not send a verification code, so ownership is not verified.
          </p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing you in…' : 'Continue with mobile'}
          </button>
        </form>
      </div>
    </section>
  );
}

function CheckoutPage({ product, userPhone, onBack, onPlaced }) {
  const [name, setName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [society, setSociety] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  async function placeOrder(event) {
    event.preventDefault();
    if (!product) return;
    setPlacing(true);
    setError('');
    try {
      const address = [
        houseNumber.trim(),
        society.trim(),
        area.trim(),
        landmark.trim() ? `Landmark: ${landmark.trim()}` : '',
        `${city.trim()}, ${state.trim()} ${pincode.trim()}`
      ].filter(Boolean).join(', ');
      const response = await fetch(`${API}/api/store/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: userPhone, address: address.trim() },
          items: [{ productId: product._id, quantity: 1 }]
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not place your order.');

      const history = JSON.parse(localStorage.getItem('diva_orders') || '[]');
      history.unshift({
        placedAt: new Date().toISOString(),
        product: { _id: product._id, name: product.name, price: product.price },
        name: name.trim(),
        phone: userPhone,
        address: address.trim()
      });
      localStorage.setItem('diva_orders', JSON.stringify(history));
      onPlaced();
    } catch (err) {
      setError(err.message || 'We could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
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
            <input id="customer-phone" type="tel" autoComplete="tel" value={userPhone} readOnly />
            <span className="field-hint">Saved to your account</span>
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
          <button className="button place-order-button" type="submit" disabled={placing}>
            {placing ? 'Placing your order…' : 'Place order'}
          </button>
          <p className="secure-note">Your order is only confirmed when you select “Place order”.</p>
        </form>
        <aside className="order-summary">
          <p className="eyebrow">Your order</p>
          <div className="summary-product">
            <img
              src={product.images && product.images[0] ? `${API}${product.images[0]}` : FALLBACK_IMAGE}
              alt=""
              onError={handleImageError}
            />
            <div><strong>{product.name}</strong><span>Quantity: 1</span></div>
          </div>
          <div className="summary-line"><span>Subtotal</span><strong>₹{product.price}</strong></div>
          <div className="summary-line"><span>Delivery</span><strong>To be confirmed</strong></div>
          <div className="summary-total"><span>Total</span><strong>₹{product.price}</strong></div>
          <div className="payment-note"><span aria-hidden="true">♡</span> Cash on delivery</div>
        </aside>
      </div>
    </section>
  );
}

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

function History({ onShop, userPhone }) {
  const [allHistory, setAllHistory] = useState([]);

  const history = allHistory
    .map((order, index) => ({ order, index }))
    .filter(({ order }) => normalizePhone(order.phone || '') === normalizePhone(userPhone));

  useEffect(() => {
    setAllHistory(JSON.parse(localStorage.getItem('diva_orders') || '[]'));
  }, [userPhone]);

  function cancelOrder(index) {
    const updated = [...allHistory];
    updated[index] = { ...updated[index], status: 'cancelled' };
    localStorage.setItem('diva_orders', JSON.stringify(updated));
    setAllHistory(updated);
  }

  return (
    <section className="content-page history-page">
      <div className="section-heading">
        <div><p className="eyebrow">Your Diva account</p><h1>Order history</h1></div>
        {history.length > 0 && <button className="button button-secondary" onClick={onShop}>Continue shopping</button>}
      </div>
      {history.length === 0 ? (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">♡</span>
          <h2>No orders on this account yet</h2>
          <p>Orders placed using {userPhone} will appear here. Find something lovely in the collection.</p>
          <button className="button" onClick={onShop}>Explore the collection</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map(({ order, index }) => (
            <article key={`${order.placedAt}-${index}`} className="history-item">
              <div className="history-topline">
                <div><p className="eyebrow">Placed {new Date(order.placedAt).toLocaleString()}</p><h2>{order.product.name}</h2></div>
                <strong className="price">₹{order.product.price}</strong>
              </div>
              <div className="history-details">
                <span>Delivering to {order.name}</span><span>{order.phone}</span><span>{order.address}</span>
              </div>
              <div className="history-footer">
                <span className={`order-status ${order.status === 'cancelled' ? 'cancelled' : ''}`}>
                  {order.status === 'cancelled' ? 'Cancelled' : 'Waiting for confirmation'}
                </span>
                {order.status !== 'cancelled' && (
                  <button className="text-button cancel-button" onClick={() => cancelOrder(index)}>Cancel order</button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AboutPage({ onShop }) {
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
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [pendingCheckoutProduct, setPendingCheckoutProduct] = useState(null);
  const [pendingHistory, setPendingHistory] = useState(false);
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('diva_phone') || '');

  function showProduct(product) {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo(0, 0);
  }

  function startCheckout(product) {
    setCheckoutProduct(product);
    setPage('checkout');
    window.scrollTo(0, 0);
  }

  function buyProduct(product) {
    if (userPhone) {
      startCheckout(product);
      return;
    }
    setPendingCheckoutProduct(product);
    setPage('login');
    window.scrollTo(0, 0);
  }

  function finishLogin(phone) {
    localStorage.setItem('diva_phone', phone);
    setUserPhone(phone);
    if (pendingCheckoutProduct) {
      const product = pendingCheckoutProduct;
      setPendingCheckoutProduct(null);
      startCheckout(product);
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

  function cancelLogin() {
    setPendingCheckoutProduct(null);
    setPendingHistory(false);
    setPage(selectedProduct ? 'product' : 'shop');
    window.scrollTo(0, 0);
  }

  function signOut() {
    localStorage.removeItem('diva_phone');
    setUserPhone('');
    setPage('shop');
    window.scrollTo(0, 0);
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
            <span className="brand-mark">D</span><span>Diva <small>STORE</small></span>
          </button>
          <nav className="main-nav" aria-label="Main navigation">
            <button className={page !== 'history' ? 'nav-link active' : 'nav-link'} onClick={goToShop}>Shop</button>
            <button className={page === 'history' ? 'nav-link active' : 'nav-link'} onClick={goToHistory}>My orders</button>
            {userPhone ? (
              <button className="nav-link account-link" onClick={signOut} aria-label={`Sign out from ${userPhone}`}>
                <span className="account-phone">•••• {userPhone.slice(-4)}</span><span>Sign out</span>
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
      <main className="container">
        {page === 'shop' && <ProductList onOpen={showProduct} />}
        {page === 'product' && (
          <ProductPage product={selectedProduct} onBack={goToShop} onBuy={buyProduct} />
        )}
        {page === 'checkout' && (
          <CheckoutPage product={checkoutProduct} userPhone={userPhone} onBack={returnToProduct} onPlaced={finishOrder} />
        )}
        {page === 'history' && userPhone && <History onShop={goToShop} userPhone={userPhone} />}
        {page === 'login' && <LoginPage onSuccess={finishLogin} onCancel={cancelLogin} />}
        {page === 'about' && <AboutPage onShop={goToShop} />}
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-brand-mark" aria-hidden="true">D</span>
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
