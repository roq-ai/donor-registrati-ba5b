import axios from 'axios';
import queryString from 'query-string';
import { ProspectiveDonorInterface, ProspectiveDonorGetQueryInterface } from 'interfaces/prospective-donor';
import { GetQueryInterface } from '../../interfaces';

export const getProspectiveDonors = async (query?: ProspectiveDonorGetQueryInterface) => {
  const response = await axios.get(`/api/prospective-donors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProspectiveDonor = async (prospectiveDonor: ProspectiveDonorInterface) => {
  const response = await axios.post('/api/prospective-donors', prospectiveDonor);
  return response.data;
};

export const updateProspectiveDonorById = async (id: string, prospectiveDonor: ProspectiveDonorInterface) => {
  const response = await axios.put(`/api/prospective-donors/${id}`, prospectiveDonor);
  return response.data;
};

export const getProspectiveDonorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/prospective-donors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteProspectiveDonorById = async (id: string) => {
  const response = await axios.delete(`/api/prospective-donors/${id}`);
  return response.data;
};
