// client/src/hooks/usePushNotifications.js
import { useState, useCallback } from 'react';
import * as pushService from '../services/pushService';

// Converts the VAPID public key (base64url string) into the Uint8Array
// format the browser's PushManager API requires.
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const usePushNotifications = () => {
  const [status, setStatus] = useState('idle'); // idle | subscribing | subscribed | denied | unsupported | error
  const [error, setError] = useState('');

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }

    setStatus('subscribing');
    setError('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const { data } = await pushService.getVapidPublicKey();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      const parsed = subscription.toJSON();
      await pushService.saveSubscription({ endpoint: parsed.endpoint, keys: parsed.keys });

      setStatus('subscribed');
    } catch (err) {
      setError(err.message || 'Could not enable notifications');
      setStatus('error');
    }
  }, []);

  return { status, error, subscribe };
};
