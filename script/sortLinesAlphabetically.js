import fs from "fs";

const file = fs.readFileSync(`./src/service/stembot/common_words.csv`, `utf8`);

let users = file.split(/\s*(?:[\n\r]+|,)\s*/);

users = users.sort((a, b) => a.localeCompare(b));

users = [...new Set(users)];

fs.writeFileSync(`./src/service/stembot/common_words.csv`, users.join(`\n`));

console.log(`done`);
