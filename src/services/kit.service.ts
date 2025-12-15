import Kit, { IKit } from "../models/kit.model";
import fs from "fs-extra";
import AppError from "../utils/appError.util";

// CREATE KIT
const createKit = async (kitData: Partial<IKit>) => {
    return await Kit.create(kitData);
};

// GET ALL KITS
const getAllKits = async () => {
    return await Kit.find().sort({ level: 1 });
};

// GET KIT BY ID
const getKitById = async (id: string) => {
    const kit = await Kit.findById(id);
    return AppError.try(kit, "Kit not found", 404);
};

// UPDATE KIT
const updateKit = async (
    id: string,
    updateData: Partial<IKit>,
    newImageFilename?: string
) => {
    const kit = await Kit.findById(id);
    if (!kit) throw new AppError("Kit not found", 404);

    if (newImageFilename) {
        kit.image = newImageFilename;
    }

    Object.assign(kit, updateData);
    await kit.save();
    return kit;
};

// DELETE KIT
const deleteKit = async (id: string) => {
    const kit = await Kit.findByIdAndDelete(id);
    if (!kit) throw new AppError("Kit not found", 404);
    return kit;
};

export default { createKit, getAllKits, getKitById, updateKit, deleteKit };