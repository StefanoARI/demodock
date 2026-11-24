import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SiteDataProvider } from './context/SiteDataContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SiteDataProvider>
    <App />
  </SiteDataProvider>
);
