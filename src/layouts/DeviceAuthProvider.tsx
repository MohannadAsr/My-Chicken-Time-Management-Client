import MuiIcon from '@components/shared/MuiIcon';
import { FormLabel, TextField } from '@mui/material';
import { useAuth } from '@src/hooks/useAuth';
import React from 'react';

function DeviceAuthProvider({ children }: { children }) {
  const [isAuthed, setIsAuthed] = React.useState(true);
  const [pass, SetPass] = React.useState('');
  const { isDevicedAuthed, AuthDevice } = useAuth();

  React.useEffect(() => {
    if (isDevicedAuthed()) setIsAuthed(true);
    else setIsAuthed(false);
  }, []);

  const handlePassUpdate = (newVal: string) => {
    SetPass(newVal);
    if (newVal == 'MYCHICKENTIMER') {
      AuthDevice();
      setIsAuthed(true);
    }
  };

  if (!isAuthed)
    return (
      <div className=" h-[100dvh] w-full container flex items-center justify-center px-4 flex-col gap-5">
        <MuiIcon name="Key" color="warning" sx={{ fontSize: 200 }} />
        <TextField
          className=" max-w-[550px]"
          label="Neues Gerät erkannt. Bitte geben Sie das Passwort ein"
          fullWidth
          value={pass}
          onChange={(e) => handlePassUpdate(e.target.value)}
          color="warning"
        />
      </div>
    );
  return <div>{children}</div>;
}

export default DeviceAuthProvider;
