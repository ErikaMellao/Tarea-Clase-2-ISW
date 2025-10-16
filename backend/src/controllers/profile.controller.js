import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { User } from "../entities/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcrypt";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getPrivateProfile(req, res) {
  const userRepository = AppDataSource.getRepository(User);
  const userId = req.user.sub;
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) return handleErrorClient(res, 404, "Usuario no encontrado");

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updatePrivateProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userId = req.user.sub;
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado");

    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await userRepository.save(user);

    handleSuccess(res, 200, "Perfil actualizado exitosamente", {
      message: `Tu perfil ha sido actualizado.`,
      userData: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar perfil", error);
  }
}
export async function deletePrivateProfile(req, res){
  try{
    const userRepository = AppDataSource.getRepository(User);

    const userId = req.user.sub;
    const user = await userRepository.findOne ({where: {id: userId}});
    
    if(!user) return handleErrorClient(res, 404, "Perfil no encontrado");

    await userRepository.remove(user);

    handleSuccess(res, 200, "Perfil eliminado exitosamente", {message: `Tu perfil ${user.email} ha sido eliminado.`});

  }catch(error){
    handleErrorServer(res, 500, "Error al eliminar perfil", error);
  }
}