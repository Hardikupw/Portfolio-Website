import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import CSS from JS entry so Vite runs PostCSS/Tailwind pipeline.
import './index.css';

const normalizeEmptyQueryUrl = () => {
  const { pathname, search, hash, href } = window.location;
  if (!search && href.endsWith('?')) {
    window.history.replaceState({}, '', `${pathname}${hash}`);
  }
};

normalizeEmptyQueryUrl();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
