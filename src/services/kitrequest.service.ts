import KitRequest, { IKitRequest } from "../models/kitrequest.model";
import { sendEmail } from "../utils/email.util";
import AppError from "@/utils/appError.util";

const adminEmail = process.env.EMAIL_USER || "soleelcaminohaciadentro@gmail.com";

const createKitRequest = async (data: Partial<IKitRequest>) => {

    const newRequest = await KitRequest.create(data);

    if (!newRequest) {
        throw new AppError('Error saving data request', 500);}


        const adminEmailHTML = `
        <h3>¡Nuevo Contacto de Kit: ${newRequest.kitName}!</h3>
        <p><strong>Nombre:</strong> ${newRequest.name}</p>
        <p><strong>Email:</strong> ${newRequest.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${newRequest.message}</p>
        <br>
        <p>Por favor, contacta con el cliente a la brevedad.</p>
        <p>Fecha de solicitud: ${newRequest.createdAt.toLocaleString()}</p>`

        sendEmail(
            adminEmail, 
            `[LEAD] Nuevo Contacto para Kit: ${newRequest.kitName},
        Nuevo contacto de ${newRequest.name} (${newRequest.email}) para el kit ${newRequest.kitName}.`,
            adminEmailHTML);


        const newRequestEmailHTML = `<h3>¡Gracias por tu interés, ${newRequest.name}!</h3>
        <p>Hemos recibido tu solicitud de contacto para el kit <strong>${newRequest.kitName}</strong>.</p>
        <p>Uno de nuestros asesores te contactará al email <strong>${newRequest.email}</strong> en breve.</p>
        <p>¡Gracias por tu paciencia!</p>
        <br>
        <p>Atentamente, El Equipo de SOL-e.</p>`
        
        sendEmail(
            newRequest.email,
            'Confirmación de Solicitud de Contacto SOL-e',
            'Hemos recibido tu solicitud de contacto y te llamaremos pronto.',
            newRequestEmailHTML

        );

    

    return newRequest;
};

const getAllRequests = async () => {
const request = await KitRequest.find().sort({ createdAt: -1 });
if (!request || request.length === 0) {
    throw new AppError('No requests found', 404);
} 
return request;
};

export default { createKitRequest, getAllRequests };