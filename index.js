const bodyParser = require('body-parser'); // Require body-parser to parse the request to json
const express = require('express'); // express required to start a server
const dateTime = require('date-time'); // npm package Used to get current time
const fs = require('fs'); // npm inbuilt global file system module to interact and create files
const path = require('path'); // npm inbuilt global module. Used to access path of a particular directory or file on any operating system
const app = express(); // Get instance of express app calling it.
const timestamp = require('time-stamp'); // npm package to get Current time stamp 

app
    .use(bodyParser.json()) // Parsing every response/request to json, use method will be implemented on all the HTTP methods we are about to use in the application
    .get('/getFiles', (request, response) => { // Create a GET Request using app.
        let str = ""; // Initialize a Empty string variable
        fs.readdir('CurrentTimeFiles', { withFileTypes: true }, function (err, files) { // Using fs module to read directory named CurrentTimeFiles
            if (err) throw err;  // If file is not found or any any other occurs throw err.

            files.forEach(file => {   // If no error, Checking if only text files
                let valiedTextFile = file["name"].split(".").pop(); // Getting the extension of a file
                if (file.name.indexOf('txt') > -1 && valiedTextFile.toLowerCase() === 'txt') { // Checking if it is a valid text file
                    str += `<li>${file["name"]}</li>`; // Append it to str as html li list tag 
                }
            })
            
            response.status(200).send(str);  // Sending the Response
        })
    })
    .post('/createfile', (request, response) => {  // Create a POST Request using app.
        let date_time = dateTime().split(" ");   // Using date-time to create current date.
        let [date, time] = [date_time[0], date_time[1]] // Getting current date and time different variables
        time = time.split(":").join(".");  // changing time format as it is not a valid file extension
        fs.writeFile(path.join(__dirname, "CurrentTimeFiles", `${date + '-' + time}.txt`), `${timestamp('YYYY-MM-DD HH:mm:ss')}`, function (err) {  // Creating a File in CurrentTimeFiles folder with current date-time.txt as name and current timestamp as content
            if (err) throw err;   // If file is not found or any any other occurs throw err.
            console.log('Saved!');
            response.send(`${date + '-' + time}.txt File Created Successfully.!`)  //Sending the success response after file gets created
        })
    })
    .listen(process.env.PORT) // App listening on Port 8080
