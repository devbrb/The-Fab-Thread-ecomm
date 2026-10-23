import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Analytics } from '@vercel/analytics/react';

import './App.css';
import './style/style.css'

import ScrollToTop from './components/ui/ScrollToTop';

import { SearchProductContextProvider } from './context/SearchProductContextApi';
import { getUser } from './context/CartSlice';
import { MediaQueryContextProvider } from './context/MediaQueryContextApi';
import Spinner from './components/ui/Spinner';
import ProtectedLayout from './layouts/ProtectedLayout';
import AppLayout from './layouts/AppLayout';
import Header from './components/Header/Header';

const Homepage = React.lazy(() => import('./pages/Homepage'));
const ProductListingPage = React.lazy(() => import('./pages/category-pages/ProductListingPage'));
const MenFashion = React.lazy(() => import('./pages/MenFashion'));
const WomenFashion = React.lazy(() => import('./pages/WomenFashion'));
const ProductDetailsPage = React.lazy(() => import('./pages/ProductDetailsPage'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Address = React.lazy(() => import('./pages/Address'));
const Payment = React.lazy(() => import('./pages/Payment'));
const OrderConfirmation = React.lazy(() => import('./pages/OrderConfirmation'));
const Login = React.lazy(() => import('./pages/Login'));
const YourOrders = React.lazy(() => import('./pages/YourOrders'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SignUp = React.lazy(() => import('./pages/SignUp'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0
    }
  }
})

function App() {
  const [DevTools, setDevTools] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(getUser());
  }, [dispatch])

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@tanstack/react-query-devtools").then((module) => {
        setDevTools(() => module.ReactQueryDevtools);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProductContextProvider>
      <MediaQueryContextProvider>
      {DevTools && <DevTools initialIsOpen={false} />}
      <Analytics />
      <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Suspense fallback={<Spinner />}>

        <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Homepage />} />
              <Route path='category/:categoryName' element={<ProductListingPage />} />
              <Route path=':searchQuery' element={<ProductListingPage />} />
              <Route path='men' element={<MenFashion />} />
              <Route path='women' element={<WomenFashion />} />
              <Route path=':productType/:brand/:productName/:productId' element={<ProductDetailsPage />} />
            </Route>
            <Route element={<ProtectedLayout />}>
              <Route path='cart' element={<Cart />} />
              <Route path='address' element={<Address />} />
              <Route path='payment' element={<Payment />} />
              <Route path='orderConfirmation/:orderId' element={<OrderConfirmation />} />
              <Route path='orders' element={<YourOrders />} />
              <Route path='orders/:orderId' element={<OrderDetails />} />
              <Route path='profile' element={<Profile />} />
            </Route>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
            
        </Routes>
      </Suspense>
      </BrowserRouter>
      <Toaster position="top-center" gutter={12} containerStyle={{margin: "8px"}} toastOptions={{
        success:{
          duration: 3000,
        },
        error: {
          duration: 5000
        },
        style: {
          fontSize: "16px",
          maxWidth: "500px",
          padding: "16px 24px",
          backgroundColor: "var(--color-grey-0)",
          color: "var(--color-grey-700)"
        }
      }} />
      </MediaQueryContextProvider>
    </SearchProductContextProvider>
    </QueryClientProvider>
  )
}

export default App;