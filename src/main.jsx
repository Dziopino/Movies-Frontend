import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n';
import App from './App.jsx'
import ScrollToTop from "./components/ScrollToTop.js";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ScrollToTop></ScrollToTop>
        <App />
    </BrowserRouter>,
)
