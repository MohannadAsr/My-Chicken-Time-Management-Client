import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from '@mui/material';
import { t } from 'i18next';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

const headers = [
  { label: t('Worker Name'), key: 'name' },
  { label: t('Total Time'), key: 'lastUpdated' },
];

export const processesToCSVData = (
  data: { name: string; totalHours: string }[]
) => {
  if (data?.length == 0) return null;
  return [
    headers.map((head) => head.label), // Header row
    ...data?.map((item) => {
      return [item?.name || '', item.totalHours];
    }),
  ];
};

function DownloadCSVUsersTimes({
  currentData,
}: {
  currentData: { name: string; totalHours: string }[];
}) {
  const { t } = useTranslation();
  if (!processesToCSVData(currentData)) return <></>;
  return (
    <div>
      <Button
        startIcon={<FileUploadIcon />}
        style={{ backgroundImage: 'linear-gradient(45deg,#fe532d,#ef9719)' }}
      >
        <CSVLink
          data={processesToCSVData(currentData)}
          separator={';'}
          filename={`WorkersTotalHours-${new Date().toLocaleDateString(
            'en-GB'
          )}.csv`}
        >
          {t('export')}
        </CSVLink>
      </Button>
    </div>
  );
}

export default DownloadCSVUsersTimes;
