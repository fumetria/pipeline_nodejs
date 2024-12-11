const core = require('@actions/core');
const fs = require('fs').promises;

async function main() {

    try {
        const testResult = core.getInput('test_result');
        const imgFail = 'https://img.shields.io/badge/test-failure-red';
        const imgSuccess = 'https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg';
        const badge = testResult === 'success' ? imgSuccess : imgFail;
        // console.log(badge);
        // const old_readme = await fs.readFile('./OldREADME.md', 'utf8');
        const textBadge = `RESULTAT DELS ÚLTIMS TESTS \n ![Test result badge](${badge})`;
        await fs.writeFile('./README.md', textBadge);
        await fs.appendFile('./README.md', './docs/activitat_gh_actions.md');
        process.exit(0);
    } catch (error) {
        core.setFailed(error);
    }

};

main();