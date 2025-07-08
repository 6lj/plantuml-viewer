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
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 4000;

// Enable CORS with restricted origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://your-service-name.onrender.com'); // Replace with your Render frontend URL
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});

// Serve static files from the project directory
app.use(express.static(__dirname));

// Serve plantuml_viewer.html at root
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
        // Write PlantUML code to a temporary file
        const tempInputFile = path.join(__dirname, 'temp.puml');
        const tempOutputFile = path.join(__dirname, 'temp.png');
        await fs.writeFile(tempInputFile, plantuml);

        // Execute PlantUML JAR to generate PNG with memory optimization and security profile
        const command = `java -Xmx1024m -DPLANTUML_SECURITY_PROFILE=INTERNET -jar plantuml-gplv2-1.2025.3.jar -tpng ${tempInputFile} -o ${__dirname}`;
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

        // Read the generated PNG and convert to base64
        const imageBuffer = await fs.readFile(tempOutputFile);
        const imageBase64 = imageBuffer.toString('base64');

        // Clean up temporary files
        await fs.unlink(tempInputFile);
        await fs.unlink(tempOutputFile);

        // Send the base64 image to the frontend
        res.json({ image: imageBase64 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${4000}`);
});
