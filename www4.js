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
		
		res.write('\n\t<h2>Minu veebilehed</h2>');
		res.write('\n\t<ul>');
		res.write('\n\t\t<li><a href="/vanasona">Tänane vanasõna</a></li>');
		res.write('\n\t\t<li><a href="/miks-tlu">Miks tulin TLÜ-sse õppima?</a></li>');
		res.write('\n\t<ul>');
		
		res.write('\n\t<h2>Minu valitud foto</h2>');
		res.write('\n\t<img src="/kass.jpg" alt="Foto avalehel" width="400">');
		
		res.write('\t<p>Hetkel on '+ dateTimeET.dayET() + '.<p>\n\t<p>Kuupäev on: ' + dateTimeET.dateET() + 
		'</p>\n\t<p>Lehekülg avati kell: ' + dateTimeET.timeET() + '</p>');
		res.write(pageFoot);
		return res.end();
	}
	else if (currentURL.pathname === '/vanasona') {

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });

    res.write(pageHead);
    res.write(pageBanner);

    res.write('\n\t<h1>Tänase päeva vanasõna</h1>');
    res.write('\n\t<p>Siin näed tänaseks loositud Eesti vanasõna.</p>');
    res.write('\n\t<hr>');

    try {
        const vanasonadPath = path.join(
            __dirname,'txt','vanasonad.txt'
        );

        const data = await fs.readFile(vanasonadPath, 'utf8');
        const vanasonad = data
            .split(';')
            .map(rida => rida.trim())
            .filter(rida => rida.length > 0);
        const juhuslik = Math.floor(
            Math.random() * vanasonad.length
        );

        const loositudVanasona = vanasonad[juhuslik];

        res.write('\n\t<p><strong>' + loositudVanasona + '</strong></p>');

    } catch (err) {
        console.log(err);
        res.write('\n\t<p>Vanasõnade faili lugemisel tekkis viga!</p>');
    }

    res.write('\n\t<p><a href="/">Avaleht</a></p>');

    res.write(pageFoot);
    return res.end();
}
	
	else if (currentURL.pathname === '/miks-tlu') {

        res.writeHead(200, {
            "Content-type": "text/html; charset=utf-8"
        });

        res.write(pageHead);
        res.write(pageBanner);

        res.write('\n\t<h1>Miks tulin TLÜ-sse õppima?</h1>');

        res.write('\n\t<p>Tulin Tallinna Ülikooli õppima, sest sõbrad reklaamisid kui hea TLÜs on ja ma ei saanud TTÜsse soovitud alale sisse.</p>');

        res.write('\n\t<img src="/tlu.jpg" alt="Tallinna Ülikool" width="400">');

        res.write('\n\t<p><a href="/">Avaleht</a></p>');

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
	
	else if (path.extname(currentURL.pathname).toLowerCase() === '.jpg') {
        
        const imageName = path.basename(currentURL.pathname);

        const imagePath = path.join(__dirname, 'pic', imageName);

        try {
            const data = await fs.readFile(imagePath);

            res.writeHead(200, {
                "Content-type": "image/jpeg"
            });

            return res.end(data);

        } catch (err) {
            res.writeHead(404, {
                "Content-type": "text/plain; charset=utf-8"
            });

            return res.end('JPG-pilti ei leitud!');
        }
    }
	else {
		res.end('Viga 404! Ei leia sellist lehte')
	}
}).listen(5312);