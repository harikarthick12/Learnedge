import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3001/api'
            : '/api'),
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

export const authApi = {
    signup: (data: any) => api.post('/auth/signup', data),
    login: (data: any) => api.post('/auth/login', data),
};

export const materialsApi = {
    upload: (formData: FormData) => api.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: () => api.get('/materials'),
    getOne: (id: string) => api.get(`/materials/${id}`),
};

export const quizApi = {
    generate: (materialId: string) => api.post(`/quiz/generate/${materialId}`),
    submit: (questionId: string, answer: string) => api.post(`/quiz/submit/${questionId}`, { answer }),
    getPerformance: () => api.get('/quiz/performance'),
    getMistakes: () => api.get('/quiz/mistakes'),
};
