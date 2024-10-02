import * as React from 'react'
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'


export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()


  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in')
    }
  }, [isLoaded])

  if (!isLoaded) return 'Loading...'

  return <Outlet />
} //