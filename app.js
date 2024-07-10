const http = require('http');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 5500;
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use((req,res,next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
   res.setHeader('Content-Type', 'application/json');
   next();
});

app.get('/npm', async (req, res) => {
    const x = await exec('npx playwright test AChecker.spec.ts Lighthouse.spec.ts Wave.spec.ts AccessMonitor.spec.ts QualWeb.spec.ts');
    res.send({val:"Success"});
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/update-json', (req, res) => {
    const newData = req.body;
    console.log(newData);
    fs.writeFile('data/config.json', JSON.stringify(newData), (err) => {
        if (err) throw err;
        res.send("JSON data has been updated");
    });
});

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
server.setTimeout(600000);
