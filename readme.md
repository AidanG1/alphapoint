# <a href="https://alphapoint.deta.dev" target="_blank">Nonchalant Simian Watercraft Association</a>
###  Created by Aidan Gerber
# Table of Contents
1. [Deploy](#deploy)
2. [Description](#description)
3. [Decisions](#decisions)
4. [Techstack](#tech)
## Deploy to Deta:<a name="deploy"></a>
[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/AidanG1/alphapoint)


## 📚Description:<a name="description"></a>
Nonchalant Simian Watercraft Association is my solution to the Alphapoint coding challenge. It solves the problem of making Ethereum gas fee data more accessible. It does this through wrapping endpoints to ethgasstation.info and adding additional functionality with historical averages in specific time frames.
	
## 🔮Decisions:<a name="decisions"></a>
I created a REST API because it felt more practical. Although ethereum gas fees are constantly changing, accessing them at a specific point in time is still useful. Additionally, the main added functionality is to access gas averages over time which would not benefit from websockets.
		
## 🤖Techstack:<a name="tech"></a>
	- Node.js
	- JavaScript
	- Express
    - Deta Micros
    - Deta Base

## 🖥️Instructions on how to host locally<a name="host"></a>

First, clone the repository.
```bash
$ git clone git@github.com/AidanG1/snackRice.git
$ cd snackRice
```
Then set up your virtual environment and install the requirements.
```bash
$ pip install -r requirements.txt
```
Next apply database migrations
```bash
$ python manage.py migrate
```
Finally, run the website on localhost. Visit localhost:8000 in your browser!
```bash
$ python manage.py runserver
```
To receive notification messages, create environment variables account_sid, auth_token, and msg_service_sid with your Twilio credentials and GOOGLE_KEY with your Google Maps API key.
Then open up the flask server.
```bash
$ python notification.py
```