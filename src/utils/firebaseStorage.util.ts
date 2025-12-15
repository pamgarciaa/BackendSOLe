import { bucket } from "../config/firebase.config";
import { cleanFileName } from "../middlewares/multer.middleware";
import path from "path";

/**
 * Sube un archivo a Firebase Storage
 * @param file Objeto file de Multer
 * @param folder Carpeta destino en el bucket (ej: "products", "users")
 * @param namePrefix Prefijo para el nombre (ej: nombre de usuario o producto)
 */
export const uploadImageToFirebase = async (
    file: Express.Multer.File,
    folder: string,
    namePrefix: string
): Promise<string> => {
    const cleanName = cleanFileName(namePrefix);
    const uniqueSuffix = Date.now();
    const fileName = `${folder}/${cleanName}-${uniqueSuffix}${path.extname(file.originalname)}`;

    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on("error", (error) => reject(error));

        blobStream.on("finish", async () => {
            await blob.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
};


export const deleteImageFromFirebase = async (imageUrl: string) => {
    if (!imageUrl) return;

    const bucketUrl = `https://storage.googleapis.com/${bucket.name}/`;
    if (imageUrl.startsWith(bucketUrl)) {
        const filePath = imageUrl.replace(bucketUrl, "");
        try {
            await bucket.file(filePath).delete();
        } catch (error) {
            console.error("Error eliminando imagen de Firebase:", error);
        }
    }
};