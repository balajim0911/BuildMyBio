import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting application mount...');

try {
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

  console.log('Application mount instruction sent to React.');
} catch (error) {
  console.error('Failed to mount application:', error);
  // Re-throw to trigger global error handler if possible, or manually show UI
  const errDiv = document.createElement('div');
  errDiv.style.color = 'red';
  errDiv.style.padding = '20px';
  errDiv.innerText = 'Failed to mount application: ' + String(error);
  document.body.prepend(errDiv);
}
