export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // CORS sorunlarını önlemek için
        image.src = url;
    });

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Bu fonksiyon, orijinal resmi ve react-easy-crop'tan gelen kırpma alanını (piksel cinsinden) alır.
 * Bir HTML Canvas oluşturur, resmi bu canvas üzerine çizer ve kırpılan alanı yeni bir Blob olarak döndürür.
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    const rotRad = getRadianAngle(rotation);

    // Döndürme işlemi sonrası yeni canvas boyutlarını hesapla
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // Canvas boyutlarını ayarla
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Canvas merkezine git ve döndür/çevir işlemlerini uygula
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Resmi canvas'a çiz
    ctx.drawImage(image, 0, 0);

    // Kırpılan alanı alacağımız yeni bir canvas oluştur
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
        return null;
    }

    // Kırpma boyutlarını ayarla
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    // Orijinal canvas'tan kırpılan bölgeyi yeni canvas'a kopyala
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // Sonucu Blob (dosya) olarak döndür
    return new Promise((resolve) => {
        croppedCanvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 0.95); // JPEG formatında, %95 kalite
    });
}

function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}