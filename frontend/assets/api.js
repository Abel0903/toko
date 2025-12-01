// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function untuk fetch dengan header authentication
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API Error');
    }

    return await response.json();
};

// Auth API calls
const authAPI = {
    register: (name, email, password) => 
        fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        }).then(r => r.json()),

    login: (email, password) => 
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(r => r.json()),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn: () => !!localStorage.getItem('token'),

    isAdmin: () => {
        const user = authAPI.getCurrentUser();
        return user?.role === 'admin';
    }
};

// Product API calls
const productAPI = {
    getAll: () => 
        fetchWithAuth('/product'),

    getById: (id) => 
        fetchWithAuth(`/product/${id}`),

    create: (data) => 
        fetchWithAuth('/product', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (id, data) => 
        fetchWithAuth(`/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    delete: (id) => 
        fetchWithAuth(`/product/${id}`, {
            method: 'DELETE'
        }),

    updateStock: (id, stock) => 
        fetchWithAuth(`/product/${id}/stock`, {
            method: 'PUT',
            body: JSON.stringify({ stock })
        })
};

// Payment API calls
const paymentAPI = {
    getAll: () => 
        fetchWithAuth('/payment'),

    createQRIS: (user_id, product_id, amount) => 
        fetchWithAuth('/payment/qris', {
            method: 'POST',
            body: JSON.stringify({ user_id, product_id, amount })
        }),

    updateStatus: (id, status) => 
        fetchWithAuth(`/payment/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
};

// Cart management (localStorage)
const cartAPI = {
    getCart: () => {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    addToCart: (product) => {
        let cart = cartAPI.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.push({ ...product, quantity: product.quantity || 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    },

    removeFromCart: (productId) => {
        let cart = cartAPI.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    },

    updateQuantity: (productId, quantity) => {
        let cart = cartAPI.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return cartAPI.removeFromCart(productId);
            }
            item.quantity = quantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    },

    clearCart: () => {
        localStorage.removeItem('cart');
        return [];
    },

    getTotal: () => {
        return cartAPI.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getItemCount: () => {
        return cartAPI.getCart().reduce((sum, item) => sum + item.quantity, 0);
    }
};

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};
