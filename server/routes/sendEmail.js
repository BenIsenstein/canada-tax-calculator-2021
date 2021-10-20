require("dotenv").config()
const express = require("express")
const router = express.Router()
const message = require('mimetext')
const {google} = require('googleapis')
const fs = require('fs');
const readline = require('readline');


router.post('/', async (req, res) => {

    //console.log("sendEmail req.body: ", req.body)

    message.setSender('canada.tax.calculator.2021@gmail.com')
    message.setRecipient(req.body.recipient)
    message.setSubject('Your 2021 Tax Prediction')
    message.setMessage(req.body.message)
    // message.setAttachments(attachmentObject)

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send']
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = `${__dirname}/../gmail_API_auth/token.json`
    
    // Load client secrets from a local file.
    fs.readFile(`${__dirname}/../gmail_API_auth/credentials.json`, (err, content) => {
      if (err) return console.log('Error loading client secret file:', err)
      // Authorize a client with credentials, then call the Gmail API.
      authorize(JSON.parse(content), sendEmail)
    })
    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0])
    
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }
    //
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }
    
    /**
     * Send email message.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function sendEmail(auth) {
      const gmail = google.gmail({version: 'v1', auth})
      
      gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: message.asEncoded() }
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          console.log("sendEmail success!")
        }
      )
    }


    res.json({ success: true })
})


module.exports = router