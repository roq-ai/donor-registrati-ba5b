import * as yup from 'yup';

export const prospectiveDonorValidationSchema = yup.object().shape({
  demographic_details: yup.string().required(),
  contact_information: yup.string().required(),
  physical_details: yup.string().required(),
  hemoglobin: yup.number().integer().required(),
  vitals: yup.number().integer().required(),
  photo: yup.string(),
  signature: yup.string(),
  user_id: yup.string().nullable(),
});
