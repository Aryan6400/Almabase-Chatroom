import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from "./Features/Store"
import { Provider } from 'react-redux';
import ChatProvider from './context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatProvider >
      <Provider store={store}>
        <App />
      </Provider>
    </ChatProvider>
  </React.StrictMode>
);
