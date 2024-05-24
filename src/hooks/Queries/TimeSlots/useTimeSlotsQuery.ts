import { CreateTimeSlotDto, TimeSlotDto } from '@src/Api/TimeSlots/Dto';
import { TIMESLOTS_API } from '@src/Api/TimeSlots/EndPoints';
import { useApi } from '@src/hooks/useApi';
import { useToast } from '@src/hooks/useToast';
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

export class PaginationDto {
  page: number = 0;
  pageSize: number = 0;
  totalPages: number = 0;
  totalCount: number = 0;
}

const { GET, POST, DELETE } = useApi();
const { toast } = useToast();

// getAll tIME Slots

export class AllTimeSlotsFilterDto {
  pageIndex: number = 1;
  pageSize: number = 0;
  startDate: string | null = null;
  endDate: string | null = null;
  userId: string = '';
  timeRange: 'this_month' | 'last_month' | 'custom_date' = 'this_month';
}

const getAllTimeSlots = async (querys: AllTimeSlotsFilterDto) => {
  const response = await GET<{
    data: { List: TimeSlotDto[]; pagination: PaginationDto };
  }>(TIMESLOTS_API.Main, querys);
  return response.data.data;
};

export const userAllTimeSlotsQuery = (querys: AllTimeSlotsFilterDto) => {
  return useQuery({
    queryKey: ['AllTimeSlots', querys?.pageIndex, querys?.pageSize],
    queryFn: () => getAllTimeSlots(querys),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

// get Time Slot For User Today

const getUserTimeSlot = async () => {
  const response = await GET<{ data: null | TimeSlotDto }>(
    TIMESLOTS_API.getUserTimeSlots
  );
  return response.data.data;
};

export const useUserTimeSlotQuery = (id: string) => {
  return useQuery({
    queryKey: ['UserTimeSlot', id],
    queryFn: getUserTimeSlot,
  });
};

// Start Time Slot For User Today

const createTimeSlot = async () => {
  const response = await POST(TIMESLOTS_API.Main);
  return response.data.data;
};

export const MutateCreateTimeSlot = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['CreateTimeSlot'],
    mutationFn: createTimeSlot,
    onSuccess: (data) => {
      if (data)
        queryClient.invalidateQueries({ queryKey: ['UserTimeSlot', id] });
    },
  });
};

// End Time Slot For User

const EndTimeSlot = async (id: string) => {
  const response = await POST(TIMESLOTS_API.endTimeSlots, { id });
  return response.data.data;
};

export const MutateEndTimeSlot = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['EndTimeSlot'],
    mutationFn: (id: string) => EndTimeSlot(id),
    onSuccess: (data) => {
      if (data)
        queryClient.invalidateQueries({ queryKey: ['UserTimeSlot', id] });
    },
  });
};

// Update TimeSlot From Admin

const updateTimeSlot = async (payload: TimeSlotDto) => {
  const response = await POST(TIMESLOTS_API.updateTimeSlot, payload);
  return response.data.data;
};

export const MutateUpdateTimeSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['UpdateTimeSlot'],
    mutationFn: (payload: TimeSlotDto) => updateTimeSlot(payload),
    onSuccess: (data) => {
      if (data) queryClient.invalidateQueries({ queryKey: ['AllTimeSlots'] });
    },
  });
};

// ADMIN CREATE TimeSlot From

const createAdminSlot = async (payload: CreateTimeSlotDto) => {
  const response = await POST(TIMESLOTS_API.CreateAdminSlot, payload);
  return response.data.data;
};

export const MutateCreateAdminSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['CreateAdminSlot'],
    mutationFn: (payload: CreateTimeSlotDto) => createAdminSlot(payload),
    onSuccess: (data) => {
      if (data) queryClient.invalidateQueries({ queryKey: ['AllTimeSlots'] });
    },
  });
};

// Delete TimeSlots

const deleteTimeSlots = async (payload: string[]) => {
  const response = await DELETE(TIMESLOTS_API.Main, { id: payload });
  return response.data.data;
};

export const MutateDeleteAdminSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['DeleteSlots'],
    mutationFn: (payload: string[]) => deleteTimeSlots(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AllTimeSlots'] });
    },
  });
};
