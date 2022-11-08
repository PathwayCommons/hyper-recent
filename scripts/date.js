import { format, sub } from 'date-fns';

const startOffset = { months: 1 };
const arg = process.argv[2];
const now = new Date();

let date;

switch (arg) {
  case 'start':
    date = sub(now, startOffset);
    break;
  case 'end':
  default:
    date = now;
    break;
}

const formattedDate = format(date, 'yyyy-MM-dd');

console.log(formattedDate);
