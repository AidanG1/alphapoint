const { Deta, App } = require('deta');
const express = require('express');

const deta = Deta();

const app = App(express());
const db = deta.Base('alphapoint')

app.get('/', async(req, res) => {
    res.send("Aidan's submission for the Alphapoint coding challenge.");
});

app.get('/gas', async(req, res) => {
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

app.get('/average', async(req, res) => {
    const fromTime = req.query.fromTime
    const toTime = req.query.toTime
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