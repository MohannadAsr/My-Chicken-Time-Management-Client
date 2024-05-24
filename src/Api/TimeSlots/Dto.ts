import { userDto } from '@src/hooks/useAuth';

export class TimeSlotDto {
  id: string = '';
  startTime: string = '';
  endTime: string = '';
  userId: string = '';
  user: userDto;
}

export class CreateTimeSlotDto {
  startTime: string = '';
  endTime: string = '';
  userId: string = '';
}
