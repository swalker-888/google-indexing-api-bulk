const fs = require('fs');
const request = require('request');
const { google } = require('googleapis');
const keys = require('./keys.json');

async function bootstrap() {
  const [, , urlsPerRequest, tokenIterations] = process.argv;
  const app = new App(urlsPerRequest, tokenIterations, 'urls.txt', 'errors.txt');
  app.start();
}

class App {
  constructor(urlsPerRequest, tokenIterations, urlsFile, errorsFile) {
    this.urlsPerRequest = parseInt(urlsPerRequest);
    this.tokenIterations = parseInt(tokenIterations);
    this.urlsFile = urlsFile;
    this.errorsFile = errorsFile;
    this.ok = 0;
    this.error = 0;

    if (isNaN(this.tokenIterations) || isNaN(this.urlsPerRequest)) throw 'Args validation error';
  }

  start() {
    const urls = this.getUrls();
    let urlsCoursor = 0
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const jwtClient = this.getJwtClient(keys[keyIndex]);
      for (let iteration = 0; iteration < this.tokenIterations; iteration++) {
        const batch = urls.slice(urlsCoursor, urlsCoursor + this.urlsPerRequest);
        this.sendUrls(jwtClient, batch);
        urlsCoursor += this.urlsPerRequest;
      }
    }
  }

  getJwtClient(key) {
    return new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );
  }

  getUrls() {
    return fs.readFileSync(this.urlsFile).toString().split('\n').filter(Boolean);
  }

  sendUrls(jwtClient, batch) {
    const errorFileName = this.errorsFile;
    jwtClient.authorize(
      function (err, tokens) {
        if (err) {
          console.log(err);
          return;
        }

        const items = batch.map((line) => {
          return {
            'Content-Type': 'application/http',
            'Content-ID': '',
            body:
              'POST /v3/urlNotifications:publish HTTP/1.1\n' +
              'Content-Type: application/json\n\n' +
              JSON.stringify({
                url: line,
                type: 'URL_UPDATED',
              }),
          };
        });

        const options = {
          url: 'https://indexing.googleapis.com/batch',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/mixed',
          },
          auth: { bearer: tokens.access_token },
          multipart: items,
        };

        const callBack = (err, resp, body) => {
          const jsons = [];
          const rawResponses = body.split('--batch_');
          const urls = batch;

          rawResponses.forEach((rawRes) => {
            const startJson = rawRes.indexOf('{');
            const endJson = rawRes.lastIndexOf('}');

            if (startJson < 0 || endJson < 0) {
              return;
            }

            let responseJson = rawRes.substr(startJson, endJson - startJson + 1);
            responseJson = JSON.parse(responseJson);

            jsons.push(responseJson);
          });

          jsons.forEach((json) => {
            if (json?.urlNotificationMetadata) {
              const updatedUrl = json?.urlNotificationMetadata.url;
              urls.splice(urls.indexOf(updatedUrl), 1);
              console.log('OK:', updatedUrl);
              this.ok++;
            } else {
              console.log('REQUEST ERROR: ', json);
              this.error++;
            }
          });

          fs.appendFile(errorFileName, urls.join('\n'), (err) => {
            if (err) {
              console.log('WRITING FILE ERROR:', err);
            }
          });

          console.log('OK REQUESTS   :', this.ok);
          console.log('ERROR REQUESTS:', this.error);
        };

        request(options, callBack.bind(this));
      }.bind(this)
    );
  }
}

bootstrap();
