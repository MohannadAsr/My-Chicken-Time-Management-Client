export class countDownDto {
  day = 0 as number;
  hour = 0 as number;
  minute = 0 as number;
  second = 0 as number;
}

export const useCountDown = () => {
  const getGapIndays = (
    startDate: string,
    endDate: string,
    allowNegative: boolean = false
  ): countDownDto => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    let gap = end - start;

    // Time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Determine the sign of the gap
    const sign = Math.sign(gap);

    // Ensure gap is always positive for calculations
    gap = Math.abs(gap);

    if (gap < 0 && !allowNegative) {
      return { day: 0, hour: 0, minute: 0, second: 0 } as countDownDto;
    } else {
      return {
        day: sign * Math.floor(gap / day),
        hour: sign * Math.floor(gap / hour),
        minute: sign * Math.floor((gap % hour) / minute),
        second: sign * Math.floor((gap % minute) / second),
      } as countDownDto;
    }
  };

  const getTotalHours = (timeArray: string[]) => {
    let totalSeconds = 0;

    // Iterate through each time string in the array
    timeArray.forEach((timeString) => {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      totalSeconds += hours * 3600 + minutes * 60 + seconds; // Convert each time string to seconds and add
    });

    const totalHours = Math.floor(totalSeconds / 3600); // Convert total seconds to total hours
    const remainingSeconds = totalSeconds % 3600; // Remaining seconds after extracting hours
    const totalMinutes = Math.floor(remainingSeconds / 60); // Convert remaining seconds to total minutes
    const totalSecondsFinal = remainingSeconds % 60; // Remaining seconds after extracting minutes

    // Format the result
    const formattedResult = `${String(totalHours).padStart(2, '0')}:${String(
      totalMinutes
    ).padStart(2, '0')}:${String(totalSecondsFinal).padStart(2, '0')}`;
    return formattedResult;
  };

  const counter = (
    currentDate: string,
    allowNegative: boolean = false,
    TargetDate?: string
  ): countDownDto => {
    // return zeros if the currentDate was null
    if (!currentDate)
      return { day: 0, hour: 0, minute: 0, second: 0 } as countDownDto;
    const targetDate = TargetDate
      ? new Date(TargetDate).getTime()
      : new Date(currentDate).getTime();
    const nowDate = new Date().getTime();
    let gap = targetDate - nowDate;

    // Time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Determine the sign of the gap
    const sign = Math.sign(gap);

    // Ensure gap is always positive for calculations
    gap = Math.abs(gap);

    if (gap < 0 && !allowNegative) {
      return { day: 0, hour: 0, minute: 0, second: 0 } as countDownDto;
    } else {
      return {
        day: sign * Math.floor(gap / day),
        hour: sign * Math.floor((gap % day) / hour),
        minute: sign * Math.floor((gap % hour) / minute),
        second: sign * Math.floor((gap % minute) / second),
      } as countDownDto;
    }
  };
  return { counter, getGapIndays, getTotalHours };
};
