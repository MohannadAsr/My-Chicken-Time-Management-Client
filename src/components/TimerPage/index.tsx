import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { CircularProgress } from '@mui/material';
import {
  MutateCreateTimeSlot,
  useUserTimeSlotQuery,
} from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { useAuth } from '@src/hooks/useAuth';
import { Successbtn } from '@src/styles/globalMuiStyls';
import TimeCounter from './TimeCounter';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TimerPage() {
  const { GetUserData } = useAuth();
  const navigate = useNavigate();
  const { isLoading, data, isError, isFetching, refetch } =
    useUserTimeSlotQuery(GetUserData()?.id);

  React.useEffect(() => {
    GetUserData()?.role == 'admin' ? navigate('/workers') : null;
  }, [GetUserData()]);

  if (isLoading)
    return (
      <div className=" min-h-[70vh] flex items-center flex-col justify-center">
        <CircularProgress />
      </div>
    );

  return (
    <div className=" min-h-[70vh] flex items-center flex-col justify-center">
      <TimeCounter data={data} isFetching={isFetching} />
    </div>
  );
}

export default TimerPage;
