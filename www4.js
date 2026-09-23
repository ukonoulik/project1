const http = require('http');
//moodul URL päringu parsimiseks
const url = require('url');
//moodul failitee haldamiseks
const path = require('path');
const fs = require('fs').promises; 
const dateTimeET = require('./src/dateTimeET.js')
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Uko Nõulik, veebiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBanner = '\t<img src="veebiprogrammeerimine_2026_AA.png" alt="banner">';
const pageBody = '\t<h1>Uko Nõulik, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, peatselt programmeerime.</p>\n\t<hr>';
const pageFoot = '\n</body>\n</html>';

http.createServer(async function(req, res){
	console.log(req.url);
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname);
	
	if(currentURL.pathname === '/'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Meie veeb käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\t<p>Hetkel on '+ dateTimeET.dayET() + '.<p>\n\t<p>Kuupäev on: ' + dateTimeET.dateET() + 
		'</p>\n\t<p>Lehekülg avati kell: ' + dateTimeET.timeET() + '</p>');
		res.write(pageFoot);
		return res.end();
	}
	else if (currentURL.pathname === '/vanasona'){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\n\t<h1>Tänase päeva vanasõna</h1>\n\t<p>Siin näed tänaseks loositud Eesti vanasõna.</p>\n\t<hr>');
		res.write(pageFoot);
		return res.end();
	}
/* else if(currentURL.pathname === '/veebiprogrammeerimine_2026_AA.png'){
		//liidame virtuaalse serveri päris kataloogidega
		let bannerPath = path.join (__dirname, 'pic', currentURL.pathname); 
		fs.readFile(bannerPath, (err, data)=>{
			if (err){
				throw(err);
			} else {
				res.writeHead(200, {"Content-Type": "image/png"});
				res.end(data);
			}
		});
	} */
	else if(currentURL.pathname === '/veebiprogrammeerimine_2026_AA.png'){
		//liidame virtuaalse serveri päris kataloogidega
		let bannerPath = path.join (__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(bannerPath);
			res.writeHead(200, {"Content-type": "image/png"});
			return res.end(data);
		} catch (err) {
				res.writeHead(404, {"Content-type": "text/plain; charset = utf8"});
				return res.end('Pilti ei leitud!');
		}
	}
	else {
		res.end('Viga 404! Ei leia sellist lehte')
	}
}).listen(5312);