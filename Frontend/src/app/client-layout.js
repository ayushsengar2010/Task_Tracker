'use client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AuthProvider } from "../context/AuthContext";

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
