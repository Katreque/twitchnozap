import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

async function scrap() {
    try {
        const IDs = await getEmotesIDsFromPage();
        const emotes = await getEmotesInfoByID(IDs);
        await downloadEmotesFromURL(emotes);
    
        fs.writeFile(
            './emotesData.json',
            JSON.stringify(emotes),
            'utf-8',
            () => {
                console.log('Scrapping Concluído.');
            }
        );
    } catch (e) {
        console.log('Deu ruim! \n', e);
    }
};

async function downloadEmotesFromURL(emotes) {
    for (let i = 0; i < emotes.length; i++) {
        const res = await fetch(emotes[i].url);
        const p = path.resolve(`./imgs/${emotes[i].name}.webp`);
        const image = fs.createWriteStream(p);

        return new Promise((resolve, reject) => {
            res.body.pipe(image);
            
            res.body.on(
                'error',
                () => {
                    console.log('Erro ao baixar imagem.');
                    return reject();
                }
            );

            image.on(
                'finish',
                () => {
                    console.log('Nova imagem adicionada.');
                    return resolve();
                }
            );
        });
    }
};

async function getEmotesInfoByID(IDs) {
    const emotes = [];
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('Obtendo info dos Emotes.');

    for (let i = 0; i < IDs.length; i++) {
        await page.goto(`https://7tv.app/emotes/${IDs[i]}`);
        
        const seletorEmote = 'div.preview-size.is-large > img';
        await page.waitForSelector(seletorEmote);

        const emoteURL = await page.$eval(
            seletorEmote,
            (emote) => {
                return emote.getAttribute('src');
            }
        );

        const emoteName = await page.$eval(
            'div.emote-name > p',
            (p) => {
                return p.innerText;
            }
        );

        const newEmote = {
            name: emoteName,
            id: IDs[i],
            url: emoteURL
        };
        emotes.push(newEmote);
        console.log('Novo Emote: ', newEmote.name);
    }

    await browser.close();
    return emotes;
};

async function getEmotesIDsFromPage() {
    let IDs = [];
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    console.log('Obtendo IDs dos Emotes.');

    for (let i = 0; i <= 10; i++) {
        await page.goto(`https://7tv.app/emotes?page=${i+1}`);
    
        const seletorCards = 'div.emote-card-wrapper[emote-id]';
        await page.waitForSelector(seletorCards);
    
        const newIDs = await returnEmotesIDs(page, seletorCards);
        IDs = IDs.concat(newIDs);
    }

    await browser.close();
    return IDs;
};

async function returnEmotesIDs(page, selector) {
    return await page.$$eval(
        selector,
        (cards) => {
            return cards.map(
                (card) => {
                    return card.getAttribute('emote-id');
                }
            );
        }
    );
}

scrap();
