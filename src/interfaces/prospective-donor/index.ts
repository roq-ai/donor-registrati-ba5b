import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ProspectiveDonorInterface {
  id?: string;
  demographic_details: string;
  contact_information: string;
  physical_details: string;
  hemoglobin: number;
  vitals: number;
  photo?: string;
  signature?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ProspectiveDonorGetQueryInterface extends GetQueryInterface {
  id?: string;
  demographic_details?: string;
  contact_information?: string;
  physical_details?: string;
  photo?: string;
  signature?: string;
  user_id?: string;
}
