import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './redux/store';
import '../css/app.css'; // Assurez-vous que ce fichier existe

const container = document.getElementById('react-app');
if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
  </Provider>
);
}
