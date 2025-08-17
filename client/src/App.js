import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/HomePage';

import Contact from './pages/Contact/Contact';
import AuthenticationPage from './pages/AuthenticationPage';
import RootLayout from './pages/Root';
import Profile from './components/Profile';
import CareersPage from './pages/Careers/Careers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'contact', element: <Contact /> },
      { path: 'auth', element: <AuthenticationPage />},
      { path: 'profile', element: <Profile />},
      { path: 'careers', element: <CareersPage />}
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
