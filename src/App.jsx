import React from 'react';
import { AuthProvider } from './routers/utils/AuthContext';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/router';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  );
};

export default App;
