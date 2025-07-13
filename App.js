import React from 'react';
import AppNavigator from './navigation/AppNavigator'; // Adjust path if needed
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
