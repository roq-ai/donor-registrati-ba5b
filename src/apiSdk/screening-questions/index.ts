import axios from 'axios';
import queryString from 'query-string';
import { ScreeningQuestionInterface, ScreeningQuestionGetQueryInterface } from 'interfaces/screening-question';
import { GetQueryInterface } from '../../interfaces';

export const getScreeningQuestions = async (query?: ScreeningQuestionGetQueryInterface) => {
  const response = await axios.get(`/api/screening-questions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createScreeningQuestion = async (screeningQuestion: ScreeningQuestionInterface) => {
  const response = await axios.post('/api/screening-questions', screeningQuestion);
  return response.data;
};

export const updateScreeningQuestionById = async (id: string, screeningQuestion: ScreeningQuestionInterface) => {
  const response = await axios.put(`/api/screening-questions/${id}`, screeningQuestion);
  return response.data;
};

export const getScreeningQuestionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/screening-questions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteScreeningQuestionById = async (id: string) => {
  const response = await axios.delete(`/api/screening-questions/${id}`);
  return response.data;
};
