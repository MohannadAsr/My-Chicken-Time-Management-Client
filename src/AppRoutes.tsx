import Branches from '@components/Users';
import BranchDetails from '@components/Users/WorkerDetails';
import Login from '@components/LogIn';
import Settings from '@components/Settings';
import TimeSlotsPage from '@components/TimeManagement';
import TimerPage from '@components/TimerPage';
import MainLayout from '@src/layouts/MainLayout';
import RouteLayout from '@src/layouts/RouteLayout';
import { Route, Routes } from 'react-router-dom';
import DeviceAuthProvider from './layouts/DeviceAuthProvider';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/workers"
        element={
          <MainLayout>
            <Branches />
          </MainLayout>
        }
      />
      <Route
        path="/TimerPage"
        element={
          <MainLayout hideMenu>
            <TimerPage />
          </MainLayout>
        }
      />
      <Route
        path="/timeManagement"
        element={
          <MainLayout>
            <TimeSlotsPage />
          </MainLayout>
        }
      />
      <Route
        path="/workers/:id"
        element={
          <MainLayout>
            <BranchDetails />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />

      <Route path="/signin" element={<Login />} />
      <Route path="/" element={<RouteLayout />} />
    </Routes>
  );
}

export default AppRoutes;
