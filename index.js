const { Deta, App } = require('deta');
const express = require('express');
const marked = require('marked')
var favicon = require('serve-favicon');

const deta = Deta();

const app = App(express());
const db = deta.Base('alphapoint')
app.use(favicon(__dirname + '/images/boredape.png'));
app.get('/', async (req, res) => {
    // var path = __dirname + '/readme.md';
    // fs.readFile(path, 'utf8', function (err, data) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.send(marked(data.toString()));
    // });
    res.send("Aidan's submission for the Alphapoint coding challenge. https://github.com/AidanG1/alphapoint");
});

app.get('/gas', async (req, res) => {
    fetch('https://ethgasstation.info/api/ethgasAPI.json').then(
        (response) => response.json().then(r => {
            res.json({ error: false, message: { fast: r.fastest, average: r.fast, low: r.safeLow } });
        }).catch((error) => {
            res.json({ error: true, message: error, occurrence: 'Parsing gas prices' })
        })
    ).catch((error) => {
        res.json({ error: true, message: error, occurrence: 'Fetching ethgasstation' })
    })
});

app.get('/average', async (req, res) => {
    const fromTime = req.query.fromTime
    if (fromTime === undefined) {
        res.json({ error: true, message: "must include fromTime query parameter" })
    }
    const toTime = req.query.toTime
    if (toTime === undefined) {
        res.json({ error: true, message: "must include toTime query parameter" })
    }
    let values = await db.fetch([
        { "time?lt": toTime },
        { "time?gt": fromTime }
    ])
    let sum = 0
    for (let value of values) {
        sum += value.gas
    }
    if (values.length === 0) {
        res.json({ error: false, message: { "averageGasPrice": 'no values', "fromTime": fromTime, "toTime": toTime } })
    } else {
        res.json({ error: false, message: { "averageGasPrice": sum / values.length, "fromTime": fromTime, "toTime": toTime } })
    }
});

app.lib.cron(event => { // run deta cron set "1 minute" ##### or whatever length you want
    fetch('https://ethgasstation.info/api/ethgasAPI.json').then(
        (response) => response.json().then(r => {
            db.put({ time: Date.now(), gas: r.fast })
        }).catch((error) => {
            console.log(error)
        })
    ).catch((error) => {
        console.log(error)
    })
});

module.exports = app;