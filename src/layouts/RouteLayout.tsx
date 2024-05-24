import { useAuth } from '@src/hooks/useAuth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function RouteLayout() {
  const { GetUserData, isLoggedIn } = useAuth();
  const naviagte = useNavigate();
  React.useEffect(() => {
    if (!isLoggedIn()) return naviagte('/signin');
    if (GetUserData()?.role == 'admin') return naviagte('/workers');

    return naviagte('/TimerPage');
  }, []);
  return <></>;
}

export default RouteLayout;
