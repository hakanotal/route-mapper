//Server
const express = require("express");
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.listen(port, () => console.log('listening at ' + port));

app.get('/markers', async (request, response) => {
    const token = await getToken();
    const data = await getData(token);

    //Send Data to Client
    response.json(data);
});

//Functions
async function getToken(){
    //Get Token
    const res = await fetch("https://www.strava.com/oauth/token", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            client_id: process.env.API_ID,
            client_secret: process.env.API_SECRET,
            refresh_token: process.env.API_TOKEN,
            grant_type: 'refresh_token'
        })
    })
    const json = await res.json();
    return json.access_token;
}

async function getData(token){  
    //Get Activities Data
    const res0 = await fetch("https://www.strava.com/api/v3/athlete/activities?access_token="+token)
    const json0 = await res0.json();

    //Get Athlete Data
    const res1 = await fetch("https://www.strava.com/api/v3/athlete?access_token="+token)
    const json1 = await res1.json();

    const res2 = await fetch("https://www.strava.com/api/v3/athletes/"+json1.id+"/stats?access_token="+token)
    const json2 = await res2.json();        
   
    let data = {
        res: json0,
        r: Math.round(json2.all_ride_totals.count),
        d: Math.round(json2.all_ride_totals.distance/1000),
        e: Math.round(json2.all_ride_totals.elevation_gain)
    }
    return data;
  }