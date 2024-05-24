import DashDialog from '@components/shared/Dialog/DashDialog';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import { TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import {
  MutateCreateTimeSlot,
  MutateEndTimeSlot,
} from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { useAuth } from '@src/hooks/useAuth';
import { useCountDown } from '@src/hooks/useCountDown';
import { ErrorButton, Successbtn } from '@src/styles/globalMuiStyls';
import { format } from 'date-fns';
import React from 'react';
const ConfirmEndTimer = ({ id }: { id: string }) => {
  const { GetUserData } = useAuth();
  const { mutate, isPending } = MutateEndTimeSlot(GetUserData()?.id);
  const [open, setOpen] = React.useState<boolean>(false);

  const endTimer = () => {
    mutate(id);
  };

  return (
    <>
      <DashDialog
        open={open}
        handleClose={() => setOpen(false)}
        title={'Ending Time Confirm'}
        body={
          <>
            <div className=" flex flex-col gap-4">
              <div>
                <p className=" text-6">
                  Are You Sure you want to End The Timer ?
                </p>
                <p className=" text-[13px]">
                  You Cannot Change Your Time Later.
                </p>
              </div>
              <div className=" flex items-center justify-center gap-4">
                <Successbtn loading={isPending} onClick={endTimer}>
                  Yes
                </Successbtn>
                <ErrorButton onClick={() => setOpen(false)}>No</ErrorButton>
              </div>
            </div>
          </>
        }
      />
      <ErrorButton onClick={() => setOpen(true)}>Stop</ErrorButton>
    </>
  );
};

function TimeCounter({
  data,
  isFetching,
}: {
  data: TimeSlotDto;
  isFetching: boolean;
}) {
  const { GetUserData } = useAuth();
  const { getGapIndays } = useCountDown();
  const [Counter, setCounter] = React.useState<{
    hour: number;
    min: number;
    second: number;
  }>({
    hour: 0,
    min: 0,
    second: 0,
  });
  const intervalTimer = React.useRef(undefined);
  const { mutate: createTimeSlot, isPending } = MutateCreateTimeSlot(
    GetUserData()?.id
  );

  // Create TimeSlot
  const CreateTimeSlot = () => {
    createTimeSlot();
  };

  React.useEffect(() => {
    if (!data) return;
    clearInterval(intervalTimer.current);
    if (data && !data.endTime) {
      intervalTimer.current = setInterval(() => {
        const getGaps = getGapIndays(
          new Date(data?.startTime).toISOString(),
          new Date().toISOString(),
          true
        );
        setCounter({
          hour: getGaps.hour,
          min: getGaps.minute,
          second: getGaps.second,
        });
      }, 1000);
    }
    if (data && data.endTime) {
      const getGaps = getGapIndays(
        new Date(data?.startTime).toISOString(),
        new Date(data?.endTime).toISOString(),
        true
      );
      setCounter({
        hour: getGaps.hour,
        min: getGaps.minute,
        second: getGaps.second,
      });
    }
  }, [data]);

  return (
    <div className=" flex flex-col gap-10">
      <div className=" text-1 flex items-center justify-center gap-2 ">
        <span className=" bg-black/10 dark:bg-white/10 p-3 rounded-lg">
          {Counter.hour.toString().padStart(2, '0')}
        </span>{' '}
        :{' '}
        <span className=" bg-black/10 dark:bg-white/10 p-3 rounded-lg">
          {Counter.min.toString().padStart(2, '0')}
        </span>{' '}
        :{' '}
        <span className=" bg-black/10 dark:bg-white/10 p-3 rounded-lg">
          {Counter.second.toString().padStart(2, '0')}
        </span>
      </div>

      {data?.startTime && data?.endTime && (
        <div className=" flex items-center justify-center gap-3">
          <span className=" bg-black/10 dark:bg-white/10 p-3 rounded-lg">
            {format(new Date(data.startTime), 'HH:mm')}
          </span>
          <span>
            <DoubleArrowOutlinedIcon />
          </span>
          <span className=" bg-black/10 dark:bg-white/10 p-3 rounded-lg">
            {format(new Date(data.endTime), 'HH:mm')}
          </span>
        </div>
      )}
      {data == null && (
        <>
          <Successbtn
            variant="contained"
            onClick={CreateTimeSlot}
            loading={isPending || isFetching}
          >
            Start Timer
          </Successbtn>
        </>
      )}

      {!data?.endTime && data?.startTime && <ConfirmEndTimer id={data?.id} />}
    </div>
  );
}

export default TimeCounter;
