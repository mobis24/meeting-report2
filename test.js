// output/triage-result.csv를 읽어서 우선순위별 건수를 출력합니다.
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output/triage-result.csv');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');
    const priorityCount = {};
    for (const line of lines.slice(1)) {
        if (!line) continue;
        const columns = line.split(',');
        const priority = columns[1]; // assuming priority is in the second column
        if (!priorityCount[priority]) {
            priorityCount[priority] = 0;
        }
        priorityCount[priority]++;
    }
    console.log(priorityCount);
});