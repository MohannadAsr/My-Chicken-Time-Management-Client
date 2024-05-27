import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AllTimeSlotsFilterDto } from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { fetchUsersList } from '@src/hooks/Queries/Users/useUsersQuery';
import { t } from 'i18next';
import { useLocation } from 'react-router-dom';
import { startOfMonth, endOfMonth, parseISO, subMonths } from 'date-fns';
import React from 'react';
import { Successbtn } from '@src/styles/globalMuiStyls';
import MuiIcon from '@components/shared/MuiIcon';

function TimeSlotFilter({
  initialFilters,
  refetch,
  FilterOptions,
  setFilterOptions,
}: {
  initialFilters: AllTimeSlotsFilterDto;
  refetch: () => void;
  FilterOptions: AllTimeSlotsFilterDto;
  setFilterOptions: React.Dispatch<React.SetStateAction<AllTimeSlotsFilterDto>>;
}) {
  const { pathname } = useLocation();
  const { data: users } = fetchUsersList();
  const chnageTimeRange = React.useCallback(() => {
    // Make Him Chooese Time Range
    if (FilterOptions.timeRange == 'custom_date') {
      return setFilterOptions({
        ...FilterOptions,
        startDate: null,
        endDate: null,
      });
    }
    // set Time Range for this month or last month
    setFilterOptions({
      ...FilterOptions,
      startDate: startOfMonth(
        subMonths(new Date(), FilterOptions.timeRange == 'this_month' ? 0 : 1)
      ).toISOString(),
      endDate: endOfMonth(
        subMonths(new Date(), FilterOptions.timeRange == 'this_month' ? 0 : 1)
      ).toISOString(),
    });
  }, [FilterOptions.timeRange]);

  React.useEffect(() => {
    chnageTimeRange();
  }, [chnageTimeRange]);

  return (
    <div className=" grid grid-cols-2 lg:grid-cols-3 items-center xl:grid-cols-7 gap-3">
      <FormControl>
        <InputLabel>{t('Worker')}</InputLabel>
        <Select
          disabled={!pathname.startsWith('/timeManagement')}
          label={t('Worker')}
          value={FilterOptions.userId || 'null'}
          onChange={(e) => {
            setFilterOptions((prev) => {
              return {
                ...prev,
                userId: e.target.value == 'null' ? '' : e.target.value,
              };
            });
          }}
        >
          <MenuItem value={'null'}>{t('All')}</MenuItem>
          {users
            ?.filter((item) => item.role !== 'admin')
            .map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>{t('Time Range')}</InputLabel>
        <Select
          disabled={
            pathname.startsWith('/branches') ||
            pathname.startsWith('/suppliers')
          }
          label={t('Time Range')}
          value={FilterOptions.timeRange}
          onChange={(e) => {
            setFilterOptions((prev) => {
              return {
                ...prev,
                timeRange: e.target.value as AllTimeSlotsFilterDto['timeRange'],
              };
            });
          }}
        >
          {[
            { title: t('This Month'), value: 'this_month' },
            { title: t('Last Month'), value: 'last_month' },
            { title: t('Custom Date'), value: 'custom_date' },
          ].map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className=" col-span-1 xl:col-span-2">
        <FormControl fullWidth>
          <DatePicker
            disabled={FilterOptions.timeRange !== 'custom_date'}
            value={FilterOptions.startDate}
            onChange={(val) => {
              setFilterOptions({
                ...FilterOptions,
                startDate: new Date(val).toISOString(),
              });
            }}
            label={t('startDate')}
          />
        </FormControl>
      </div>
      <div className=" col-span-1 xl:col-span-2">
        <FormControl fullWidth>
          <DatePicker
            disabled={FilterOptions.timeRange !== 'custom_date'}
            value={FilterOptions.endDate}
            onChange={(val) => {
              setFilterOptions({
                ...FilterOptions,
                endDate: new Date(val).toISOString(),
              });
            }}
            label={t('endDate')}
          />
        </FormControl>
      </div>
      <div className=" flex flex-wrap items-center gap-3 col-span-2 md:col-span-1">
        <Button
          className=" w-full"
          startIcon={<MuiIcon name="FilterAlt" />}
          onClick={() => refetch()}
        >
          {t('filter')}
        </Button>
        <Button
          className=" w-full"
          startIcon={<MuiIcon name="RestartAlt" />}
          onClick={() => {
            setFilterOptions({ ...initialFilters });
            setTimeout(() => {
              refetch();
            }, 300);
          }}
        >
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}

export default TimeSlotFilter;
