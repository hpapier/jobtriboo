export const salaryFormat = (salary: number) => {
  const element = salary.toString()
  let finalTxt = '';

  let e = 0;
  for (let i = element.length; i !== 0; i--) {

    if (e % 3 === 0 && e !== 0)
      finalTxt =  element[i - 1] + '.' + finalTxt;
    else
      finalTxt = element[i - 1] + finalTxt;

    e++;
  }

  return finalTxt;
}