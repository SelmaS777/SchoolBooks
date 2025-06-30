//can delete

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Extend Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
  interface ImportMeta {
    env: Record<string, string>;
  }
}

// Make Pusher available globally
window.Pusher = Pusher;

// Initialize Laravel Echo
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true
});

export default echo;