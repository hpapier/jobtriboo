// Check if the candidate profil is complete for a candidate.
const checkCandidateProfil = (data) => {
  if (data.firstname === undefined || data.firstname === '' || data.firstname === null)
    return false;
  if (data.lastname === undefined || data.lastname === '' || data.lastname === null)
    return false;
  if (data.email === undefined || data.email === '' || data.email === null)
    return false;
  if (data.phone === undefined || data.phone === '' || data.phone === null)
    return false;
  if (data.picture === undefined || data.picture === '' || data.picture === null)
    return false;
  if (data.description === undefined || data.description === '' || data.description === null)
    return false;
  if (data.birthdate === undefined || data.birthdate === '' || data.birthdate === null)
    return false;
  if (data.qualifications === undefined || data.qualifications === null || data.qualifications.length === 0)
    return false;
  if (data.experiences === undefined || data.experiences === null || data.experiences.length === 0)
    return false;
  if (data.skills === undefined || data.skills === null || data.skills.length === 0)
    return false;
  if (data.job === undefined || data.job === '' || data.job === null)
    return false;
  if (data.expertiseLevel === undefined || data.expertiseLevel === '' || data.expertiseLevel === null)
    return false;
  if (data.desiredContract === undefined || data.desiredContract === '' || data.desiredContract === null)
    return false;
  if (data.legalAvailability === undefined || data.legalAvailability === '' || data.legalAvailability === null)
    return false;
  if (data.expectedSalary === undefined || data.expectedSalary === '' || data.expectedSalary === null)
    return false;
  return true;
}


module.exports = {
  checkCandidateProfil
}