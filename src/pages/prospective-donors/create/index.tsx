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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createProspectiveDonor } from 'apiSdk/prospective-donors';
import { Error } from 'components/error';
import { prospectiveDonorValidationSchema } from 'validationSchema/prospective-donors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { ProspectiveDonorInterface } from 'interfaces/prospective-donor';

function ProspectiveDonorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ProspectiveDonorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createProspectiveDonor(values);
      resetForm();
      router.push('/prospective-donors');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ProspectiveDonorInterface>({
    initialValues: {
      demographic_details: '',
      contact_information: '',
      physical_details: '',
      hemoglobin: 0,
      vitals: 0,
      photo: '',
      signature: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: prospectiveDonorValidationSchema,
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
            Create Prospective Donor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="demographic_details" mb="4" isInvalid={!!formik.errors?.demographic_details}>
            <FormLabel>Demographic Details</FormLabel>
            <Input
              type="text"
              name="demographic_details"
              value={formik.values?.demographic_details}
              onChange={formik.handleChange}
            />
            {formik.errors.demographic_details && (
              <FormErrorMessage>{formik.errors?.demographic_details}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="contact_information" mb="4" isInvalid={!!formik.errors?.contact_information}>
            <FormLabel>Contact Information</FormLabel>
            <Input
              type="text"
              name="contact_information"
              value={formik.values?.contact_information}
              onChange={formik.handleChange}
            />
            {formik.errors.contact_information && (
              <FormErrorMessage>{formik.errors?.contact_information}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="physical_details" mb="4" isInvalid={!!formik.errors?.physical_details}>
            <FormLabel>Physical Details</FormLabel>
            <Input
              type="text"
              name="physical_details"
              value={formik.values?.physical_details}
              onChange={formik.handleChange}
            />
            {formik.errors.physical_details && <FormErrorMessage>{formik.errors?.physical_details}</FormErrorMessage>}
          </FormControl>
          <FormControl id="hemoglobin" mb="4" isInvalid={!!formik.errors?.hemoglobin}>
            <FormLabel>Hemoglobin</FormLabel>
            <NumberInput
              name="hemoglobin"
              value={formik.values?.hemoglobin}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('hemoglobin', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.hemoglobin && <FormErrorMessage>{formik.errors?.hemoglobin}</FormErrorMessage>}
          </FormControl>
          <FormControl id="vitals" mb="4" isInvalid={!!formik.errors?.vitals}>
            <FormLabel>Vitals</FormLabel>
            <NumberInput
              name="vitals"
              value={formik.values?.vitals}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('vitals', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.vitals && <FormErrorMessage>{formik.errors?.vitals}</FormErrorMessage>}
          </FormControl>
          <FormControl id="photo" mb="4" isInvalid={!!formik.errors?.photo}>
            <FormLabel>Photo</FormLabel>
            <Input type="text" name="photo" value={formik.values?.photo} onChange={formik.handleChange} />
            {formik.errors.photo && <FormErrorMessage>{formik.errors?.photo}</FormErrorMessage>}
          </FormControl>
          <FormControl id="signature" mb="4" isInvalid={!!formik.errors?.signature}>
            <FormLabel>Signature</FormLabel>
            <Input type="text" name="signature" value={formik.values?.signature} onChange={formik.handleChange} />
            {formik.errors.signature && <FormErrorMessage>{formik.errors?.signature}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
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
    entity: 'prospective_donor',
    operation: AccessOperationEnum.CREATE,
  }),
)(ProspectiveDonorCreatePage);
