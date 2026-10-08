import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || '';
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

function LoginPage({ onGoogleSuccess, onProfileSuccess, onCancel, googleUser }) {
  const [name, setName] = useState(googleUser?.name || '');
  const [phone, setPhone] = useState(googleUser?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState('');

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
        <h1>{googleUser?.phone ? 'Welcome back' : googleUser ? 'Complete your account' : 'Sign in with Google'}</h1>
        <p className="login-intro">
          {googleUser?.phone
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

        {googleUser && !googleUser.phone && (
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

        {googleUser && googleUser.phone && (
          <button className="button login-submit" type="button" onClick={() => onProfileSuccess(googleUser)}>
            Continue
          </button>
        )}
      </div>
    </section>
  );
}

function CheckoutPage({ product, userPhone, accountId, onBack, onPlaced, onPhoneChange }) {
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

  async function placeOrder(event) {
    event.preventDefault();
    if (!product) return;
    setPlacing(true);
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
      const response = await fetch(`${API}/api/store/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: normalizedPhone, address: address.trim() },
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
        phone: normalizedPhone,
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
                    <button className="text-button cancel-button" onClick={() => { setSelectedOrder(order); setConfirmationPhone(''); setCancelError(''); }}>Cancel order</button>
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
                <p>Enter the mobile number for this order to confirm cancellation. This action returns the product quantity to stock.</p>
                <label htmlFor="cancel-phone-confirmation">Mobile number</label>
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
                  <button className="button button-secondary" type="button" onClick={closeDetails}>Keep order</button>
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

  function finishLogin(user) {
    const phone = user?.phone || '';
    localStorage.setItem('diva_phone', phone);
    setUserPhone(phone);
    setGoogleUser(user);
    setAccountId(user?.id || accountId);
    showSignInSuccess();
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
      if (user.phone) {
        finishLogin(user);
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
            <span className="brand-mark">D</span><span>Diva <small>STORE</small></span>
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
          />
        )}
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
