import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getScreeningQuestionById, updateScreeningQuestionById } from 'apiSdk/screening-questions';
import { Error } from 'components/error';
import { screeningQuestionValidationSchema } from 'validationSchema/screening-questions';
import { ScreeningQuestionInterface } from 'interfaces/screening-question';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { HospitalInterface } from 'interfaces/hospital';
import { getHospitals } from 'apiSdk/hospitals';

function ScreeningQuestionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ScreeningQuestionInterface>(
    () => (id ? `/screening-questions/${id}` : null),
    () => getScreeningQuestionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ScreeningQuestionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateScreeningQuestionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/screening-questions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ScreeningQuestionInterface>({
    initialValues: data,
    validationSchema: screeningQuestionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Screening Question
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="question" mb="4" isInvalid={!!formik.errors?.question}>
              <FormLabel>Question</FormLabel>
              <Input type="text" name="question" value={formik.values?.question} onChange={formik.handleChange} />
              {formik.errors.question && <FormErrorMessage>{formik.errors?.question}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<HospitalInterface>
              formik={formik}
              name={'hospital_id'}
              label={'Select Hospital'}
              placeholder={'Select Hospital'}
              fetcher={getHospitals}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'screening_question',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ScreeningQuestionEditPage);
