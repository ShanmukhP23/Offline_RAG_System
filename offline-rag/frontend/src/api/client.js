import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const sendChatMessage = async (message, sessionId = "default") => {
    return apiClient.post('/chat', { message, session_id: sessionId });
};

export const getDocuments = async () => {
    return apiClient.get('/documents');
};
