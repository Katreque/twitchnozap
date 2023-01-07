import { exec } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import Webp from 'node-webpmux';
import sharp from 'sharp';

import EMOTES_LIST from '../emotesData.json' assert { type: "json" };

const EMOTE_FOLDER_PATH = path.resolve(`../app/public/assets/emotes`);
const ANIMATED_FOLDER_PATH = path.resolve(EMOTE_FOLDER_PATH + `/animated`);
const STATIC_FOLDER_PATH = path.resolve(EMOTE_FOLDER_PATH + `/static`);
const TEMP_FOLDER_PATH = path.resolve(`./imgs/_temp/`);

async function improveEmotesQuality() {
    try {
        foldersSetup();
        const animatedEmotesNames = [];
        const staticEmotesNames = [];

        for (let i = 0; i < 50/*EMOTES_LIST.length*/; i++) {
            const emoteName = EMOTES_LIST[i].name;

            const originalEmotePath = path.resolve(`./imgs/${emoteName}.webp`);
            const tempEmoteFolderPath = path.resolve(TEMP_FOLDER_PATH + `/${emoteName}`);
            deleteFolder(tempEmoteFolderPath, true);

            const outputFrames = [];
            const outputSizes = { width: 512, height: 512 };
            const WebpImageInstance = await Webp.Image.getEmptyImage();
            await WebpImageInstance.load(fs.readFileSync(originalEmotePath))
            
            const loopLenght = WebpImageInstance.hasAnim ? WebpImageInstance.frames.length : 1;
            for (let j = 0; j < loopLenght; j++) {
                console.log(`PROCESSING: Emote ${i+1} de ${EMOTES_LIST.length} | Frame ${j+1} de ${loopLenght}.`);
                
                const framePath = path.resolve(tempEmoteFolderPath + `/${emoteName}_${j}.webp`);
                const upscaledFramePath = path.resolve(tempEmoteFolderPath + `/${emoteName}_${j}_upscaled.webp`);

                await sharp(fs.readFileSync(originalEmotePath), { page: j })
                .resize(
                    { 
                        width: 128,
                        fit: 'contain'
                    }
                )
                .webp()
                .toFile(framePath);

                await runImageUpscaling(framePath, upscaledFramePath);

                const upscaledFrameData = await sharp(upscaledFramePath)
                .webp({ quality: 50 })
                .toBuffer({ resolveWithObject: true });

                const finishedFrameData = await Webp.Image.generateFrame({ buffer: upscaledFrameData.data });
                finishedFrameData.delay = (loopLenght === 1) ? 0 : WebpImageInstance.frames[j].delay;
                outputFrames.push(finishedFrameData);

                outputSizes.width = upscaledFrameData.info.width;
                outputSizes.height = upscaledFrameData.info.height;
            }
    
            await Webp.Image.save(
                path.resolve(
                    (loopLenght === 1) ?
                    STATIC_FOLDER_PATH + `/${emoteName}.webp` :
                    ANIMATED_FOLDER_PATH + `/${emoteName}.webp`
                ),
                {
                    frames: outputFrames,
                    width: outputSizes.width,
                    height: outputSizes.height,
                    blend: false
                }
            );

            WebpImageInstance.hasAnim ?
            animatedEmotesNames.push(emoteName) :
            staticEmotesNames.push(emoteName);
        }

        createConfigJsonForAPP(animatedEmotesNames, staticEmotesNames);
    } catch (e) {
        console.log(e);
    }
};

function foldersSetup() {
    !fs.existsSync(EMOTE_FOLDER_PATH) ? fs.mkdirSync(EMOTE_FOLDER_PATH) : null;
    !fs.existsSync(ANIMATED_FOLDER_PATH) ? fs.mkdirSync(ANIMATED_FOLDER_PATH) : null;
    !fs.existsSync(STATIC_FOLDER_PATH) ? fs.mkdirSync(STATIC_FOLDER_PATH) : null;
}

function deleteFolder(path, shouldRecreateFolder) {
    fs.rmSync(path, { recursive: true, force: true });
    if (shouldRecreateFolder) {
        fs.mkdirSync(path);
    }
}

function runImageUpscaling(inputPath, outoutPath) {
    return new Promise((resolve, reject) => {
        return exec(
            `${path.resolve('./realesrgan/realesrgan-ncnn-vulkan.exe')} -i ${inputPath} -o ${outoutPath}`,
            `-s 2 -n realesrnet-x4plus`,
            (error, stdout, stderr) => {
                if (error) {
                    return reject(stderr);
                }

                return resolve(stdout);
            }
        );
    });
}

function createConfigJsonForAPP(animatedEmotesNames, staticEmotesNames) {
    const animatedNamesJson = JSON.stringify(animatedEmotesNames);
    const staticNamesJson = JSON.stringify(staticEmotesNames);

    fs.writeFile(
        ANIMATED_FOLDER_PATH + '/emotesNames.json',
        JSON.stringify(animatedNamesJson),
        (err) => {
            if (err) throw err;
        }
    );

    fs.writeFile(
        STATIC_FOLDER_PATH + '/emotesNames.json',
        JSON.stringify(staticNamesJson),
        (err) => {
            if (err) throw err;
        }
    );
}

improveEmotesQuality();