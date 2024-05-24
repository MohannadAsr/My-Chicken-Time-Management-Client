import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from '@mui/material';
import { TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { useCountDown } from '@src/hooks/useCountDown';
import { format } from 'date-fns';
import { t } from 'i18next';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

const headers = [
  { label: t('Worker Name'), key: 'name' },
  { label: t('Start Time'), key: 'quantity' },
  { label: t('End Time'), key: 'dateCreated' },
  { label: t('Total Time'), key: 'lastUpdated' },
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
