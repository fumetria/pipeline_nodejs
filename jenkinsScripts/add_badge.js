const fs = require("node:fs/promises");

async function main() {

    try {
        const test_result = process.argv[2];
        const imgFail = "https://img.shields.io/badge/test-failure-red";
        const imgSuccess = "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg";
        const badge = test_result === "SUCCESS" ? imgSuccess : imgFail;
        const textBadge = `RESULTAT DELS ÚLTIMS TESTS AMB JEST:  ![Test result badge](${badge})`;
        const docsText = await fs.readFile("./docs/activitat_jenkins.md", 'utf8');
        await fs.writeFile("./README.md", textBadge);
        await fs.appendFile('./README.md', docsText);
        process.exit(0);
    } catch (error) {
        return error;
    }
}


main();