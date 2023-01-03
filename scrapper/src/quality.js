import { exec } from 'node:child_process';
import fs from 'fs';
import path from 'path';
import Webp from 'node-webpmux';
import sharp from 'sharp';

import EMOTES_LIST from '../emotesData.json' assert { type: "json" };

const EMOTE_FOLDER_PATH = path.resolve(`./imgs/finished/`);
const ANIMATED_FOLDER_PATH = path.resolve(EMOTE_FOLDER_PATH + `/anim`);
const STATIC_FOLDER_PATH = path.resolve(EMOTE_FOLDER_PATH + `/static`);

async function improveEmotesQuality() {
    try {
        foldersSetup();

        for (let i = 8; i < 12/*EMOTES_LIST.length*/; i++) {
            const originalEmotePath = path.resolve(`./imgs/${EMOTES_LIST[i].name}.webp`);
            const tempFolderPath = path.resolve(`./imgs/_temp/${EMOTES_LIST[i].name}`);
            fs.rmSync(tempFolderPath, { recursive: true, force: true });
            fs.mkdirSync(tempFolderPath);

            const outputFrames = [];
            const outputSizes = { width: 512, height: 512 };
            const WebpImageInstance = await Webp.Image.getEmptyImage();
            await WebpImageInstance.load(fs.readFileSync(originalEmotePath));
            
            const loopLenght = WebpImageInstance.frames ? WebpImageInstance.frames.length : 1;
            for (let j = 0; j < loopLenght; j++) {
                console.log(`PROCESSING: Emote ${i+1} de ${EMOTES_LIST.length} | Frame ${j+1} de ${loopLenght}.`);
                
                const framePath = path.resolve(tempFolderPath + `/${EMOTES_LIST[i].name}_${j}.webp`);
                const upscaledFramePath = path.resolve(tempFolderPath + `/${EMOTES_LIST[i].name}_${j}_upscaled.webp`);

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
                    STATIC_FOLDER_PATH + `/${EMOTES_LIST[i].name}.webp` :
                    ANIMATED_FOLDER_PATH + `/${EMOTES_LIST[i].name}.webp`
                ),
                {
                    frames: outputFrames,
                    width: outputSizes.width,
                    height: outputSizes.height,
                    blend: false
                }
            );
        }
    } catch (e) {
        console.log(e);
    }
};

function foldersSetup() {
    !fs.existsSync(EMOTE_FOLDER_PATH) ? fs.mkdirSync(EMOTE_FOLDER_PATH) : null;
    !fs.existsSync(ANIMATED_FOLDER_PATH) ? fs.mkdirSync(ANIMATED_FOLDER_PATH) : null;
    !fs.existsSync(STATIC_FOLDER_PATH) ? fs.mkdirSync(STATIC_FOLDER_PATH) : null;
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

improveEmotesQuality();