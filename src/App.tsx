import ToastContainer from '@components/Toast/ToastContainer';
import DeleteContainer from '@components/shared/DeleteDialog/DeleteContainer';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppDispatch, RootState } from '@store/store';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import useLang from './hooks/useLang';
import { darkTheme, lightTheme } from './main';
import { switchMode } from './reducers/AppSlice';
import AppRoutes from './AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import DeviceAuthProvider from './layouts/DeviceAuthProvider';

function App() {
  const { t, i18n } = useTranslation();
  const { changeHtml } = useLang();
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const { menuStatus, mode } = useSelector((state: RootState) => state.App);
  const handleBodyOverflow = React.useCallback(() => {
    document.body.style.overflow = menuStatus ? 'hidden' : 'auto';
  }, [menuStatus]);
  const { GetUserData, isLoggedIn } = useAuth();

  React.useEffect(() => {
    handleBodyOverflow();
  }, [handleBodyOverflow]);

  React.useEffect(() => {
    // Check for any existed theme mode and update it
    const siteMode = localStorage.getItem('site-mode');
    dispatch(switchMode(siteMode ? JSON.parse(siteMode) : 'dark'));

    // Chnage HTML dir onLaod
    changeHtml(i18n.language);
  }, [isLoggedIn()]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={mode == 'dark' ? darkTheme : lightTheme}>
          <CssBaseline />
          <DeviceAuthProvider>
            <div className=" relative  ">
              <DeleteContainer />
              <ToastContainer />
              <AppRoutes />
            </div>
          </DeviceAuthProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;
