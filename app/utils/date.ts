/*
 * Date Converter
*/

export const DateConverter: (date: string) => string = date => {
  const ndate = new Date(date);
  return `${ndate.getDate() < 10 ? `0${ndate.getDate()}` : ndate.getDate()}/${(ndate.getMonth() + 1 < 10 ? `0${ndate.getMonth() + 1}` : ndate.getMonth() + 1)}/${ndate.getFullYear()}`;
}
