import { useState } from 'react';
import Swal from 'sweetalert2';
import { getProfile, updatePrivateProfile, deletePrivateProfile } from '../services/profile.service.js';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const handleGetProfile = async () => { 
    setError(''); 
    try { 
      const data = await getProfile(); 
      const user = data.data.userData; 
      if (user) { 
        setProfileData(user); 
      } else { 
        setError('No se pudo obtener el perfil');
      } 
    } catch (error) { 
      setError('Error al conectar con el servidor'); 
    } 
  };
  const handleUpdateProfile = async () => {
    setError('');
    const { value: formValues } = await Swal.fire({
      title: 'Actualizar perfil',
      html:
        `<input id="swal-email" class="swal2-input" placeholder="Email" value="${profileData?.email || ''}">` +
        `<input id="swal-password" type="password" class="swal2-input" placeholder="Password">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const password = document.getElementById('swal-password').value;
        if (!email || !password) {
          Swal.showValidationMessage('Debes ingresar email y password');
        }
        return { email, password };
      }
    });
    if (formValues) {
      try {
        const data = await updatePrivateProfile(formValues);
        const user = data || data.data; 
        if (user) {
          setProfileData(data.userData);
          Swal.fire('Actualizado', user.message, 'success');
        } else {
          setError('No se pudo actualizar el perfil');
        }
      } catch (error) {
        setError('Error al conectar con el servidor');
      }
    }
  };
  const handleDeleteProfile = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        const data = await deletePrivateProfile();
        const user = data || data.data;
        if (user) {
          setProfileData(null);
          Swal.fire('Eliminado', user.message, 'success');
        } else {
          setError('No se pudo eliminar el perfil');
        }
      } catch (error) {
        setError('Error al conectar con el servidor');
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Inicio
        </h1>
        {!profileData && (
          <button
            onClick={handleGetProfile}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Obtener Perfil
          </button>
        )}
        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Password (encriptada):</strong> {profileData.password}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={handleUpdateProfile}
                className="w-60 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Actualizar Perfil
              </button>
              
              <button
                onClick={handleDeleteProfile}
                className="w-60 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Eliminar Perfil
              </button>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;