import { CompanyProps } from './company';
import { CandidateProps } from './candidate';

export interface AnnounceProps {
  _id: string
  title: string
  level: string
  company: string | null
  country: string
  city: string
  street: string
  formatedAddress?: string
  remote: boolean
  postDescription: string
  postResponsibilities: string
  profilDescription: string
  contractType: string
  salary: { min: number, max: number }
  startingDate: string
  visaSponsoring: boolean
  category: string
  benefits: Array<string>
  publicId: string
  candidates: Array<string>
  companyInfo?: CompanyProps
  candidateInfo?: Array<CandidateProps>
}