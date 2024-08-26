const fs = require('fs');
const sharp = require('sharp');

// Tamanho das imagens originais
const originalWidth = 813;
const originalHeight = 1185;

// Tamanho da nova imagem em branco
const newWidth = 2032;
const newHeight = 1355;

const cartasFolder = './cartas/';
const combinadasFolder = './combinadas/';

// Lista todos os arquivos na pasta "cartas"
fs.readdir(cartasFolder, (err, files) => {
    if (err) {
        console.error('Erro ao ler a pasta "cartas":', err);
        return;
    }

    // Filtra apenas os arquivos de imagem (assumindo que todas as imagens são .png)
    const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

    // Loop para combinar as imagens em pares
    for (let i = 0; i < imageFiles.length; i += 2) {
        const firstImage = imageFiles[i];
        const secondImage = imageFiles[i + 1];

        // Verifica se há um segundo arquivo
        if (!secondImage) {
            console.log(`Apenas uma imagem restante: ${firstImage}`);
            break;
        }

        // Combina as duas imagens
        const combinedImage = sharp({
            create: {
                width: newWidth,
                height: newHeight,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        }).composite([{ input: cartasFolder + firstImage, left: 0, top: 0 }, { input: cartasFolder + secondImage, left: originalWidth+2, top: 0 }])


        // Salva a imagem combinada na pasta "combinadas"
        combinedImage.toFile(`${combinadasFolder}${Math.ceil((i + 2) / 2)}.png`, (err, info) => {
            if (err) {
                console.error(`Erro ao salvar a imagem ${Math.ceil((i + 2) / 2)}:`, err);
            } else {
                console.log(`Imagem ${Math.ceil((i + 2) / 2)} combinada com sucesso!`);
            }
        });
    }
});
