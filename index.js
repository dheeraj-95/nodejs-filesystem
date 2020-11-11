const bodyParser = require('body-parser');
const express = require('express');
const dateTime = require('date-time');
const fs = require('fs');
const path = require('path');
const app = express();
const timestamp = require('time-stamp');



app
    .use(bodyParser.json())
    .get('/getFiles', (request, response) => {
        let str = "";
        fs.readdir('CurrentTimeFiles', { withFileTypes: true }, function (err, files) {
            if (err) throw err;

            files.forEach(file => {
                if (file.name.indexOf('txt') > -1) {
                    str += `<li>${file["name"]}</li>`;
                }
            })
            
            response.status(200).send(str);
        })
    })
    .post('/createfile', (request, response) => {
        let date_time = dateTime().split(" ");
        let [date, time] = [date_time[0], date_time[1]]
        time = time.split(":").join(".");
        fs.writeFile(path.join(__dirname, "CurrentTimeFiles", `${date + '-' + time}.txt`), `${timestamp('YYYY-MM-DD HH:mm:ss')}`, function (err) {
            if (err) throw err;
            console.log('Saved!');
            response.send(`${date + '-' + time}.txt File Created Successfully.!`)
        })
    })
    .listen(8080)
