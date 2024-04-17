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
//app.use(express.static('.')); // Serve static files from public directory

app.get('/npm', async (req, res) => {
    // exec('npm run test', (err,stdout,stderr) => {
    //     res.send({val:stdout});
    // });
    console.log("*****4444");
    const x = await exec('npm run test');
    console.log(x.stdout);
    res.send({val:"xxxxxyyyy"});
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/update-json', (req, res) => {
    const newData = req.body;
    console.log("JSON write Chandan");
    console.log(newData);
    fs.writeFile('data/config.json', JSON.stringify(newData), (err) => {
        console.log("JSON write Chandan123");
        if (err) throw err;
        res.send("JSON data has been updated");
        console.log("JSON write Chandan456");
    });
});

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
server.setTimeout(600000);
