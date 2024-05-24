import DashDialog from '@components/shared/Dialog/DashDialog';
import MuiIcon from '@components/shared/MuiIcon';
import { DialogActions, IconButton } from '@mui/material';
import {
  DesktopDateTimePicker,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { MutateUpdateTimeSlot } from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { ErrorButton, Successbtn } from '@src/styles/globalMuiStyls';
import { t } from 'i18next';
import React, { useState } from 'react';

function EditTimeSlot({ TimeSlot }: { TimeSlot: TimeSlotDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const [TimeForm, setTimeForm] = useState<TimeSlotDto>(TimeSlot);
  const updateFromState = React.useCallback(() => {
    setTimeForm(TimeSlot);
  }, [TimeSlot]);
  const { mutate, isPending } = MutateUpdateTimeSlot();

  React.useEffect(() => {
    updateFromState();
  }, [updateFromState]);

  const updateTimeSlot = () => {
    mutate(TimeForm, { onSuccess: () => setOpen(false) });
  };

  return (
    <>
      <DashDialog
        open={open}
        body={
          <>
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3">
              <DesktopDateTimePicker
                label={t('Start Time')}
                disableOpenPicker
                value={new Date(TimeForm.startTime)}
                onChange={(val: Date) => {
                  setTimeForm({
                    ...TimeForm,
                    startTime: new Date(val).toISOString(),
                  });
                }}
                ampm={false}
                closeOnSelect={false}
                className=" w-full"
              />
              <DesktopDateTimePicker
                label={t('End Time')}
                disableOpenPicker
                value={TimeForm.endTime ? new Date(TimeForm.endTime) : null}
                onChange={(val: Date) => {
                  setTimeForm({
                    ...TimeForm,
                    endTime: new Date(val).toISOString(),
                  });
                }}
                ampm={false}
                closeOnSelect={false}
                className=" w-full"
              />
            </div>
            <DialogActions className=" mt-5 flex items-center  justify-end gap-3">
              <ErrorButton onClick={() => setOpen(false)} variant="contained">
                {t('close')}
              </ErrorButton>
              <Successbtn
                loading={isPending}
                type="submit"
                variant="contained"
                onClick={updateTimeSlot}
              >
                {t('save')}
              </Successbtn>
            </DialogActions>
          </>
        }
        title={t('Edit Time Slot')}
        handleClose={() => setOpen(false)}
      />
      <IconButton onClick={() => setOpen(true)}>
        <MuiIcon name="Edit" />
      </IconButton>
    </>
  );
}

export default EditTimeSlot;
