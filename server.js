// server.js
// where your node app starts

const request = require("request");
const express = require("express");
const index = require("./index");
const app = express();


index.run();
app.get("/", (_, r) => r.send("<a href='/start'>Build</a>")).listen(process.env.PORT);

app.get("/start", (_, r) => {
	build();
	r.send("Building");
});

function build() {
	const API = 'u581863-e2f47297f2e1308d5d5ea598'

	var options = {
		method: 'POST',
		url: 'https://api.uptimerobot.com/v2/getMonitors',
		headers:
		{
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded'
		},
		form: { api_key: API, format: 'json', logs: '0' }
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		if (response.statusCode == 200) {
			body = JSON.parse(body);
			var monitors = body.monitors.filter(monitor => monitor.friendly_name == process.env.PROJECT_DOMAIN).length;
			// console.log(monitors);
			if (monitors >= 1) return;

			createMonitor(API);

		}

	});
}

function createMonitor(api) {
	var options = {
		method: 'POST',
		url: 'https://api.uptimerobot.com/v2/newMonitor',
		headers:
		{
			'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache'
		},

		form:
		{
			api_key: api,
			format: 'json',
			type: '1',
			url: `http://${process.env.PROJECT_DOMAIN}.glitch.me/`,
			friendly_name: process.env.PROJECT_DOMAIN
		}
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
	});
}
