// @interface
// interface ListValueProps {
//   type: string,
//   t: any
// }


// @function
export const getListValues: (t: any, type: string) => Array<{ value: string, label: string }> = (t, type) => {
  const expertiseLevel = [
    { value: 'student', label: t('student')},
    { value: 'junior', label: t('junior')},
    { value: 'mid', label: t('mid')},
    { value: 'senior', label: t('senior')},
  ];

  const contractType = [
    { value: 'indifferent', label: t('indifferent')},
    { value: 'internship', label: t('internship')},
    { value: 'full-time', label: t('full-time')},
    { value: 'part-time', label: t('part-time')},
    { value: 'contractor', label: t('contractor')},
  ];

  const legalAvailability = [
    { value: 'now', label: t('now')},
    { value: '0to15', label: t('0to15')},
    { value: '15to30', label: t('15to30')},
    { value: '30to90', label: t('30to90')},
    { value: '90+', label: t('90+')},
  ];

  const categories = [
    { value: 'commercial', label: t('commercial') },
    { value: 'tech-it', label: t('tech') },
    { value: 'marketing', label: t('marketing') },
    { value: 'finance', label: t('finance') },
    { value: 'engineering', label: t('engineering') },
    { value: 'legal', label: t('legal') },
    { value: 'retail', label: t('retail') },
    { value: 'logistic', label: t('logistic') },
    { value: 'direction', label: t('direction') },
    { value: 'design', label: t('design') }
  ];

  const employeeNb = [
    { value: '0to5', label: t('0to5') },
    { value: '5to25', label: t('5to25') },
    { value: '25to100', label: t('25to100') },
    { value: '100to250', label: t('100to250') },
    { value: '250to1000', label: t('250to1000') },
    { value: '1000+', label: t('1000+') },
  ];

  if (type === 'expertiseLevel')
    return expertiseLevel;
  if (type === 'contractType')
    return contractType;
  if (type === 'legalAvailability')
    return legalAvailability;
  if (type === 'category')
    return categories;
  if (type === 'employeeNb')
    return employeeNb;
}