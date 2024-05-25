import DashTable from '@components/shared/Table/DashTable';
import {
  AllTimeSlotsFilterDto,
  MutateDeleteAdminSlot,
  userAllTimeSlotsQuery,
} from '@src/hooks/Queries/TimeSlots/useTimeSlotsQuery';
import { useCountDown } from '@src/hooks/useCountDown';
import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import EditTimeSlot from './EditTimeSlot';
import TimeSlotFilter from './TimeSlotFilter';
import {
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
} from '@mui/material';
import { t } from 'i18next';
import { useCustomHooks } from '@src/hooks/useCustomHooks';
import AddTimeSlot from './AddTimeSlot';
import TotalHoursData from './TotalHoursData';
import DownloadCSVTimes from './DownloadTimesCSV';

const GapCalculate = ({
  startTime,
  EndTime,
}: {
  startTime: string;
  EndTime: string;
}) => {
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
  const { getGapIndays } = useCountDown();

  React.useEffect(() => {
    clearInterval(intervalTimer.current);
    if (!EndTime) {
      intervalTimer.current = setInterval(() => {
        const getGaps = getGapIndays(
          new Date(startTime).toISOString(),
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
    if (EndTime) {
      const getGaps = getGapIndays(
        new Date(startTime).toISOString(),
        new Date(EndTime).toISOString(),
        true
      );
      setCounter({
        hour: getGaps.hour,
        min: getGaps.minute,
        second: getGaps.second,
      });
    }
  }, [startTime, EndTime]);

  return (
    <div className="  ">
      <span>{Counter.hour.toString().padStart(2, '0')}</span> :{' '}
      <span>{Counter.min.toString().padStart(2, '0')}</span> :{' '}
      <span>{Counter.second.toString().padStart(2, '0')}</span>
    </div>
  );
};

function TimeSlotsTable({
  filterOptions = new AllTimeSlotsFilterDto(),
}: {
  filterOptions?: AllTimeSlotsFilterDto;
}) {
  const [FilterOptions, setFilterOptions] =
    React.useState<AllTimeSlotsFilterDto>(filterOptions);
  const { data, isLoading, isFetching, refetch } =
    userAllTimeSlotsQuery(FilterOptions);
  const { mutate } = MutateDeleteAdminSlot();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { useTimerFn } = useCustomHooks();

  const handleDelete = () => {
    mutate(selectedIds, { onSuccess: () => setSelectedIds([]) });
  };

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <DashTable
        actions={
          <div className=" flex items-center gap-3 flex-wrap">
            <AddTimeSlot userId={FilterOptions.userId} />
            <DownloadCSVTimes currentData={data?.List || []} />
          </div>
        }
        name="TimeSlots"
        filterOptions={
          <TimeSlotFilter
            initialFilters={filterOptions}
            refetch={() => refetch()}
            FilterOptions={FilterOptions}
            setFilterOptions={setFilterOptions}
          />
        }
        data={data?.List?.map((item) => {
          return {
            id: item?.id,
            cells: [
              <>
                <Link to={`/workers/${item?.user?.id}`}>
                  {item?.user?.name || '...'}
                </Link>
              </>,
              <>{format(new Date(item?.startTime), 'yyyy-MM-dd HH:mm')}</>,
              <>
                {item?.endTime ? (
                  format(new Date(item?.endTime), 'yyyy-MM-dd HH:mm')
                ) : (
                  <>
                    <Chip color="success" label={t('In Progress')} />
                  </>
                )}
              </>,
              <>
                <GapCalculate
                  EndTime={item.endTime}
                  startTime={item.startTime}
                />{' '}
              </>,
              <>
                <EditTimeSlot TimeSlot={item} />
              </>,
            ],
          };
        })}
        onDelete={handleDelete}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        titles={[
          t('Worker'),
          t('Start Time'),
          t('End Time'),
          t('Total Hours'),
          t('Actions'),
        ]}
        isLoading={isLoading}
        isFetching={isFetching}
      />
      {data?.pagination?.totalCount !== 0 && !isLoading && (
        <Paper className=" flex items-center justify-between mt-3 px-1 lg:px-2 p-4">
          <Pagination
            count={data?.pagination?.totalPages || 1}
            page={data?.pagination?.page || 0}
            onChange={(_e, page) =>
              setFilterOptions({ ...FilterOptions, pageIndex: page })
            }
          />
          <div>
            <FormControl>
              <InputLabel>{t('Page Size')}</InputLabel>
              <Select
                sx={{ minWidth: 90 }}
                size="small"
                label={t('Page Size')}
                value={Number(data?.pagination?.pageSize) || 10}
                onChange={(e) => {
                  setFilterOptions((prev) => {
                    return {
                      ...prev,
                      pageSize: Number(e.target.value) as number,
                    };
                  });
                }}
              >
                {[10, 20, 30, 50, 100].map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Paper>
      )}
      <Divider />
      {!isLoading && data?.pagination?.totalCount !== 0 && (
        <div>
          <TotalHoursData data={data?.List || []} />
        </div>
      )}
    </>
  );
}

export default TimeSlotsTable;
