import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div>
      {/* This is a basic layout for authentication pages */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
