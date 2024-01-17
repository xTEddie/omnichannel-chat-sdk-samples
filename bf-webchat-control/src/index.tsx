import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WebChat from './components/WebChat/WebChat';
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StateProvider>
      <WebChat />
    </StateProvider>    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
