import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Manager from './pages/Manager';
import CalendarPage from './pages/CalendarPage';
import MyLeaves from './pages/Myleaves';
import RequestLeave from './pages/RequestLeave';
import PendingRequests from './pages/PendingRequests';
import AllLeaves from './pages/AllLeaves';
import ManagerCalendar from './pages/ManagerCalendar';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

const router = createBrowserRouter([

  {
    path:"/",
    element:<Home/>
  },

  {
    path:"/login",
    element:<Login/>
  },

  // Employee Routes
  {
    path:"/dashboard",
    element:(
      <ProtectedRoute allowedRole="EMPLOYEE">
        <Dashboard/>
      </ProtectedRoute>
    ),
    children:[
      {
        path:"calendar",
        element:<CalendarPage/>
      },
      {
        path:"leaves",
        element:<MyLeaves/>
      },
      {
        path:"request-leave",
        element:<RequestLeave/>
      }
    ]
  },

  // Manager Routes
  {
    path:"/manager",
    element:(
      <ProtectedRoute allowedRole="MANAGER">
        <Manager/>
      </ProtectedRoute>
    ),
    children:[
      {
        path:"pending",
        element:<PendingRequests/>
      },
      {
        path:"all-leaves",
        element:<AllLeaves/>
      },
      {
        path:"calendar",
        element:<ManagerCalendar/>
      }
    ]
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);