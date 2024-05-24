import { Button } from '@mui/material';
import { processDataDto } from '@src/Api/Processes/Dto';
import React from 'react';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';
import { TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { useCountDown } from '@src/hooks/useCountDown';

const headers = [
  { label: 'Worker Name', key: 'name' },
  { label: 'Start Time', key: 'quantity' },
  { label: 'End Time', key: 'dateCreated' },
  { label: 'Total Time', key: 'lastUpdated' },
];

export const processesToCSVData = (data: TimeSlotDto[], getGapIndays) => {
  if (data?.length == 0) return null;
  return [
    headers.map((head) => head.label), // Header row
    ...data?.map((item) => {
      const gapinHours = getGapIndays(
        item.startTime as string,
        (item?.endTime as string) || new Date().toISOString()
      );
      return [
        item?.user.name || '',
        format(new Date(item?.startTime), ' yyyy-MM-dd - HH:mm'),
        item.endTime
          ? format(new Date(item?.endTime), ' yyyy-MM-dd - HH:mm')
          : 'in Progress ....',
        `${gapinHours.hour}:${gapinHours.minute}:${gapinHours.second}`,
      ];
    }),
  ];
};

function DownloadCSVTimes({ currentData }: { currentData: TimeSlotDto[] }) {
  const { t } = useTranslation();
  const { getGapIndays } = useCountDown();
  if (!processesToCSVData(currentData, getGapIndays)) return <></>;
  return (
    <div>
      <Button
        startIcon={<FileUploadIcon />}
        style={{ backgroundImage: 'linear-gradient(45deg,#fe532d,#ef9719)' }}
      >
        <CSVLink
          data={processesToCSVData(currentData, getGapIndays)}
          separator={';'}
          filename={`WorkersTimeStatstics-${new Date().toLocaleDateString(
            'en-GB'
          )}.csv`}
        >
          {t('export')}
        </CSVLink>
      </Button>
    </div>
  );
}

export default DownloadCSVTimes;
