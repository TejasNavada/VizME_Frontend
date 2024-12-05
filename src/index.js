import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from "./context/AuthContext"
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProblemProvider } from './context/ProblemContext';
import { MessageProvider } from './context/MessageContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ProblemProvider>
      <MessageProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </MessageProvider>
    </ProblemProvider>
  </AuthContextProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
