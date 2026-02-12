import React from 'react';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div>
      {/* This is a basic layout for the dashboard pages */}
      <header>
        {/* Could have a navbar here */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
