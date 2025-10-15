import axios from './root.service.js';

export async function getProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/profile/private', {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener perfil' };
    }
}

