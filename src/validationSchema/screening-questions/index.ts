import * as yup from 'yup';

export const screeningQuestionValidationSchema = yup.object().shape({
  question: yup.string().required(),
  hospital_id: yup.string().nullable(),
});
