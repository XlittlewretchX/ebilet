export const getMonthDays = (year: number, month: number) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const pad = (n: number) => n.toString().padStart(2, '0');

export const formatDate = (date: Date) => 
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; 