// Check if the input is not empty or too long.
export const handleInputText = (input, lengthMax = 50) => {
  if (input === '' || input.length > lengthMax)
    return false;
  return true;
}


// Check the validity of the input email.
export const handleInputEmail = input => {
  const regExp = /^[\w\W]+@[\w\.]+\.\w+$/;

  if (input.match(regExp) === null)
    return false;

  return true;
}


// Check if there is only number in the input.
export const handleInputNumber = input => {
  const regExp = /^\d+$/;

  if (input.match(regExp) === null || input.length < 10)
    return false;

  return true;
}


// Check if there is only number in the input.
export const handleInputInt = (input, max, min) => {
  const regExp = /^\d+$/;

  if (input.match(regExp) === null)
    return false;
  else if (parseInt(input) > max || parseInt(input) < min)
    return false;

  return true;
}


// Check if the prefix format for a phone number is valid.
export const handleInputPrefix = input => {
  const regExpWithSign    = /^\+\d{2}$/;
  const regExpWhitoutSign = /^\d{2}$/;

  if (input.match(regExpWithSign) === null && input.match(regExpWhitoutSign) === null)
    return false;

  return true;
}


// Check Month
export const handleInputMonth = input => {
  if (
    input === 'january'   ||
    input === 'february'  ||
    input === 'march'     ||
    input === 'april'     ||
    input === 'may'       ||
    input === 'june'      ||
    input === 'july'      ||
    input === 'august'    ||
    input === 'september' ||
    input === 'october'   ||
    input === 'november'  ||
    input === 'december'
  )
    return true;

  return false;
}


// Check Phone
export const handleInputPhone = input => {
  const regexp = /^\+\d{2}\d{5,12}$/;

  if (input.match(regexp) === null)
    return false;

  return true;
}


// Day/Month Check
export const handleInputDayMonth = input => {
  // const regex = /$[0-9]{2}^/

}