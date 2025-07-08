/*
PlantUML Viewer Backend
Copyright (C) 2025 ENDUP - Mohmmad Hissyn Aon

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

*/


const express = require('express');
const { spawn } = require('child_process');
const path = require('path'); 
const NodeCache = require('node-cache');
const axios = require('axios');
const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 3600 }); 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://<your-render-app>.onrender.com'); // Replace with your Render URL
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});


app.use(express.static(__dirname));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'plantuml_viewer.html'));
});

app.use(express.json());

app.post('/render', async (req, res) => {
    const { plantuml } = req.body;

    if (!plantuml) {
        return res.status(400).json({ error: 'No PlantUML code provided' });
    }

    // Check cache
    const cacheKey = plantuml;
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
        return res.json({ image: cachedImage });
    }

    try {
     
        const start = Date.now();
        const plantumlProcess = spawn('java', [
            '-Xmx256m',
            '-DPLANTUML_SECURITY_PROFILE=INTERNET',
            '-jar',
            'plantuml-gplv2-1.2025.3.jar',
            '-tpng',
            '-pipe'
        ]);

        let imageBuffer = Buffer.alloc(0);
        plantumlProcess.stdout.on('data', (chunk) => {
            imageBuffer = Buffer.concat([imageBuffer, chunk]);
        });

        plantumlProcess.stderr.on('data', (data) => {
            console.error('PlantUML error:', data.toString());
        });

        plantumlProcess.on('error', (error) => {
            console.error('Process error:', error);
            res.status(500).json({ error: 'Failed to generate diagram' });
        });

        plantumlProcess.on('close', (code) => {
            if (code === 0) {
                const imageBase64 = imageBuffer.toString('base64');
                cache.set(cacheKey, imageBase64);
                console.log(`Rendering took ${Date.now() - start}ms`);
                res.json({ image: imageBase64 });
            } else {
                res.status(500).json({ error: 'Failed to generate diagram' });
            }
        });

        plantumlProcess.stdin.write(plantuml);
        plantumlProcess.stdin.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/render-public', async (req, res) => {
    const { plantuml } = req.body;

    if (!plantuml) {
        return res.status(400).json({ error: 'No PlantUML code provided' });
    }

    // Check cache
    const cacheKey = plantuml;
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
        return res.json({ image: cachedImage });
    }

    try {
        const start = Date.now();

        const encoded = encodePlantUML(plantuml);
        const imageUrl = `http://www.plantuml.com/plantuml/png/${encoded}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBase64 = Buffer.from(response.data).toString('base64');
        cache.set(cacheKey, imageBase64);
        console.log(`Public rendering took ${Date.now() - start}ms`);
        res.json({ image: imageBase64 });
    } catch (error) {
        console.error('Public server error:', error);
        res.status(500).json({ error: error.message });
    }
});

function encodePlantUML(text) {
    const zlib = require('zlib');
    const compressed = zlib.deflateSync(text);
    const base64 = compressed.toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
