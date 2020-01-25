// Check if the input is not empty or too long.
const handleInputText = (input, lengthMax = 50) => {
  if (input === '' || input.length > lengthMax)
    return false;
  return true;
}


// Check the validity of the input email.
const handleInputEmail = input => {
  const regExp = /^[\w\W]+@[\w\.]+\.\w+$/;

  if (input.match(regExp) === null)
    return false;

  return true;
}


// Check if there is only number in the input.
const handleInputNumber = input => {
  const regExp = /\d+/;

  if (input.match(regExp) === null || input.length < 10)
    return false;

  return true;
}


// Check if the prefix format for a phone number is valid.
const handleInputPrefix = input => {
  const regExp = /^\+\d{2}$/;

  if (input.match(regExp) === null)
    return false;

  return true;
}

// Check Phone
const handleInputPhone = input => {
  const regexp = /^\+\d{2}\d{5,12}$/;

  if (input.match(regexp) === null)
    return false;

  return true;
}

module.exports = {
  handleInputText,
  handleInputEmail,
  handleInputNumber,
  handleInputPrefix,
  handleInputPhone
}