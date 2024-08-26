import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {ToastContainer} from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <App />
        <ToastContainer />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
