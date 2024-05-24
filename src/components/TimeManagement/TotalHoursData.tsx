import { TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { fetchUsersList } from '@src/hooks/Queries/Users/useUsersQuery';
import { useCountDown } from '@src/hooks/useCountDown';
import React from 'react';
import { parse, format, add, sub } from 'date-fns';
import { Card, Divider } from '@mui/material';
import ApexBarChart from '@components/shared/ApexBarChart';
import DownloadCSVUsersTimes from './DownloadUserTimeCSV';
import { t } from 'i18next';

function TotalHoursData({ data }: { data: TimeSlotDto[] }) {
  const { getGapIndays, getTotalHours } = useCountDown();
  const intervalRef = React.useRef(null);
  const { data: UsetList } = fetchUsersList();
  const [Records, setRecords] = React.useState<
    {
      name: string;
      totalHours: string;
    }[]
  >([]);
  const updateRecords = React.useCallback(() => {
    if (!data || !UsetList) return;
    const RecordSet = new Set();
    data.forEach((slot) => {
      RecordSet.add(slot.userId);
    });

    let FinalRecords = [];
    RecordSet.forEach((item) => {
      const userHours = data
        .filter((slots) => slots.userId == item)
        .map((slot) => {
          const time = getGapIndays(
            slot.startTime,
            slot.endTime || new Date().toISOString()
          );
          return `${time.hour.toString().padStart(2, '0')}:${time.minute
            .toString()
            .padStart(2, '0')}:${time.second.toString().padStart(2, '0')}`;
        });
      const finalTotalHours = getTotalHours(userHours);
      const userRecords = {
        name: UsetList?.find((user) => user.id == item).name,
        totalHours: finalTotalHours,
      };
      FinalRecords.push(userRecords);
    });

    setRecords(FinalRecords);
  }, [data, UsetList]);

  React.useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      updateRecords();
    }, 1000);
  }, [updateRecords]);

  return (
    <div className=" flex flex-col gap-4 mt-10 px-2">
      <div className=" flex items-center justify-between flex-wrap ">
        <h2 className=" text-6">{t('Workers Time Statstics')}</h2>
        <DownloadCSVUsersTimes currentData={Records} />
      </div>
      <Divider />
      <div className=" grid grid-cols-1 xl:grid-cols-4  gap-5 ">
        {Records?.map((record) => {
          return (
            <Card
              className=" flex items-center justify-between p-5 shadow-lg border-[2px] border-primary"
              key={record.name}
            >
              <span>{record.name}</span>
              <span>{record.totalHours}</span>
            </Card>
          );
        })}
      </div>
      <div>
        <ApexBarChart
          data={Records.map((record) => ({
            name: record.name,
            totalHours: record.totalHours.split(':')[0],
          }))}
        />
      </div>
    </div>
  );
}

export default TotalHoursData;
