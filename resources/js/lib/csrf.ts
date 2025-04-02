import axios from 'axios';

// Function to get the CSRF token from the meta tag
export function getCSRFToken(): string {
    const tokenElement = document.head.querySelector('meta[name="csrf-token"]');
    return tokenElement ? (tokenElement as HTMLMetaElement).content : '';
}

// Set up axios to include the CSRF token in all requests
export function setupCSRF(): void {
    const token = getCSRFToken();

    if (token) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    } else {
        console.error('CSRF token not found');
    }
}

// Set up axios to include credentials with requests
export function setupCredentials(): void {
    axios.defaults.withCredentials = true;
}

// Initialize both CSRF and credentials
export function initializeAxios(): void {
    setupCSRF();
    setupCredentials();
}
