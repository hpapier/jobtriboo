export interface CandidateProps {
  _id: string
  state: string
  firstname: string
  lastname: string
  email: string
  password?: string
  phone: string
  creationDate?: Date
  picture: string
  description: string
  birthdate: string
  qualifications: Array<{
    _id: string
    title: string
    startingDate: string
    endDate: string
    inProgress: boolean
    school: string
  }>,
  experiences: Array<{
    _id: string
    jobTitle: string
    startingDate: string
    endDate: string
    inProgress: boolean
    company: string
    jobDescription: string
  }>,
  skills: Array<{
    _id: string,
    name: string,
  }>,
  job: string
  expertiseLevel: string
  desiredContract: string
  legalAvailability: string
  expectedSalary: string
  updated?: Date
  settings?: {
    emailOnMsg: boolean
  },
  publicId: string,
}