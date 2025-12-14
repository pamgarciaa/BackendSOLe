import { Request, Response, NextFunction } from "express";
import kitService from "../services/kitrequest.service";
import AppError from "../utils/appError.util";

export const requestKitInfoController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, kitName, message } = req.body;

        if (!name || !email) {
            return next(new AppError("Nombre y email son obligatorios", 400));
        }

        const newRequest = await kitService.createKitRequest({
            name,
            email,
            kitName,
            message,
        });

        res.status(201).json({
            status: "success",
            message: "Solicitud enviada correctamente",
            data: { request: newRequest },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllKitRequestsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requests = await kitService.getAllRequests();

        res.status(200).json({
            status: "success",
            results: requests.length,
            data: { requests },
        });
    } catch (error) {
        next(error);
    }
};