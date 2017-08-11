import moment from 'moment';

// returns [filename]_edited_[year-month-day_hour-second]
export default function rename(filename, extension) {
  const timeString = moment().format('YYYY-MM-DD_h-ss');
  return `${filename}_EDITED_${timeString}.${extension}`;
}
