
const core = require('@actions/core');

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3500;

require('dotenv').config();

async function main() {

    try {
        const MAIL_USERNAME = core.getInput('MAIL_USERNAME');
        const MAIL_PASSWORD = core.getInput('MAIL_PASSWORD');
        const OAUTH_CLIENTID = core.getInput('OAUTH_CLIENTID');
        const OAUTH_CLIENT_SECRET = core.getInput('OAUTH_CLIENT_SECRET');
        const OAUTH_REFRESH_TOKEN = core.getInput('OAUTH_REFRESH_TOKEN');
        const linter_job_result = core.getInput('linter_job_result');
        const cypress_job_result = core.getInput('cypress_job_result');
        const modify_readme_job_result = core.getInput('modify_readme_job_result');
        const deploy_job_result = core.getInput('deploy_job_result');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
                clientId: OAUTH_CLIENTID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN
            }
        });

        let mailOptions = {
            'from': 'nosou002@gmail.com',
            'to': 'nosou002@gmail.com',
            'subject': 'Resultat del workflow executat',
            'text': `S'ha realitzat un push en la branca main que ha provocat l'execució del workflow fumetria_workflow amb els següents resultats:\n
        \n
        - linter_job: ${linter_job_result}\n
        - cypress_job: ${cypress_job_result}\n
        - add_badge_job: ${modify_readme_job_result}\n
        - deploy_job: ${deploy_job_result}\n
    `
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Email sent successfully");
            }
        });
        process.exit(0);
    } catch (error) {
        core.setFailed(error);
    }

};

main();

app.listen(PORT, () => {
    console.log(`nodemailer listening at port: ${PORT}.`);
});