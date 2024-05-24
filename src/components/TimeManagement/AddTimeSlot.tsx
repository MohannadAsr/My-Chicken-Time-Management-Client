import DashDialog from '@components/shared/Dialog/DashDialog';
import MuiIcon from '@components/shared/MuiIcon';
import {
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import { CreateTimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { MutateCreateAdminSlot } from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { fetchUsersList } from '@src/hooks/Queries/Users/useUsersQuery';
import { ErrorButton, Successbtn } from '@src/styles/globalMuiStyls';
import { ErrorMessage, Form, Formik } from 'formik';
import { t } from 'i18next';
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  userId: yup.string().required(),
  startTime: yup.date().required(),
  endTime: yup.date().nullable(),
});

function AddTimeSlot({ userId = '' }: { userId?: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [TimeForm, setTimeForm] = useState<CreateTimeSlotDto>({
    ...new CreateTimeSlotDto(),
    userId: userId,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  });
  const { data: users } = fetchUsersList();

  const { mutate, isPending } = MutateCreateAdminSlot();

  const updateTimeSlot = () => {
    mutate(TimeForm, { onSuccess: () => setOpen(false) });
  };
  return (
    <>
      <DashDialog
        open={open}
        body={
          <>
            <Formik
              enableReinitialize
              initialValues={TimeForm}
              onSubmit={updateTimeSlot}
              validationSchema={validationSchema}
            >
              <Form>
                <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className=" col-span-1  lg:col-span-2">
                    <FormControl fullWidth>
                      <InputLabel>{t('Worker')}</InputLabel>
                      <Select
                        name="userId"
                        label={t('handler')}
                        value={TimeForm.userId || 'null'}
                        onChange={(e) => {
                          setTimeForm((prev) => {
                            return {
                              ...prev,
                              userId: e.target.value,
                            };
                          });
                        }}
                      >
                        {users
                          ?.filter((item) => item.role !== 'admin')
                          .map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <ErrorMessage
                        name="userId"
                        className="error-msg"
                        component={'div'}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <DesktopDateTimePicker
                      label={t('Start Time')}
                      value={new Date(TimeForm.startTime)}
                      onChange={(val: Date) => {
                        setTimeForm({
                          ...TimeForm,
                          startTime: new Date(val).toISOString(),
                        });
                      }}
                      ampm={false}
                      disableOpenPicker
                      closeOnSelect={false}
                      className=" w-full"
                    />
                    <ErrorMessage
                      name="startTime"
                      className="error-msg"
                      component={'div'}
                    />
                  </div>
                  <div>
                    <DesktopDateTimePicker
                      label={t('End Time')}
                      value={
                        TimeForm.endTime ? new Date(TimeForm.endTime) : null
                      }
                      disableOpenPicker
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
                    <ErrorMessage
                      name="endTime"
                      className="error-msg"
                      component={'div'}
                    />
                  </div>
                </div>
                <DialogActions className=" mt-5 flex items-center  justify-end gap-3">
                  <ErrorButton
                    onClick={() => setOpen(false)}
                    variant="contained"
                  >
                    {t('close')}
                  </ErrorButton>
                  <Successbtn
                    loading={isPending}
                    type="submit"
                    variant="contained"
                  >
                    {t('add')}
                  </Successbtn>
                </DialogActions>
              </Form>
            </Formik>
          </>
        }
        title={t('Add Time Slot')}
        handleClose={() => setOpen(false)}
      />
      <Successbtn
        startIcon={<MuiIcon name="Add" />}
        onClick={() => setOpen(true)}
      >
        {t('New Time Slot')}
      </Successbtn>
    </>
  );
}

export default AddTimeSlot;
