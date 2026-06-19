import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase-client';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && router.pathname !== '/login') {
        router.push('/login');
      } else if (user && router.pathname === '/login') {
        router.push('/');
      }
      setAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Login page without layout
  if (router.pathname === '/login') {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }

  // Authenticated pages with layout
  if (authenticated) {
    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }

  return null;
}