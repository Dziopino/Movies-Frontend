import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import {AuthProvider} from "./context/AuthContext.jsx";
import {FilmProvider} from "./context/FilmContext.jsx";
import './index.css'
import './i18n';
import App from './App.jsx'
import ScrollToTop from "./components/ScrollToTop.js";
import {WarningProvider} from "./context/WarningContext.jsx";
import {Toaster} from "react-hot-toast";


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000
            }}
        />
        <AuthProvider>
            <FilmProvider>
                <WarningProvider>
                    <ScrollToTop />
                    <App />
                </WarningProvider>
            </FilmProvider>
        </AuthProvider>
    </BrowserRouter>,
)
