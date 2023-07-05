import { HospitalInterface } from 'interfaces/hospital';
import { GetQueryInterface } from 'interfaces';

export interface ScreeningQuestionInterface {
  id?: string;
  question: string;
  hospital_id?: string;
  created_at?: any;
  updated_at?: any;

  hospital?: HospitalInterface;
  _count?: {};
}

export interface ScreeningQuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  question?: string;
  hospital_id?: string;
}
