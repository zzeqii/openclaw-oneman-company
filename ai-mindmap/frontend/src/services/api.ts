import axios from 'axios';
import { MindMapData, ExportFormat } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 120000,
});

export const generateMindMap = async (topic: string, useMock = true): Promise<MindMapData> => {
  const response = await api.post('/generate', { topic, useMock });
  return response.data;
};

export const exportMindMap = async (format: ExportFormat, data: any): Promise<Blob> => {
  const response = await api.post('/export', { format, ...data }, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
