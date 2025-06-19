const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
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

    try {

        const tempInputFile = path.join(__dirname, 'temp.puml');
        const tempOutputFile = path.join(__dirname, 'temp.png');
        await fs.writeFile(tempInputFile, plantuml);

        const command = `java -jar plantuml-gplv2-1.2025.3.jar -tpng ${tempInputFile} -o ${__dirname}`;
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('PlantUML error:', stderr);
                    reject(new Error('Failed to generate diagram'));
                } else {
                    resolve();
                }
            });
        });

        const imageBuffer = await fs.readFile(tempOutputFile);
        const imageBase64 = imageBuffer.toString('base64');

        await fs.unlink(tempInputFile);
        await fs.unlink(tempOutputFile);

        res.json({ image: imageBase64 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http:
});
