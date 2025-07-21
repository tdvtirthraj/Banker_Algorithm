function getInput() {
    let np = parseInt(document.getElementById('np').value);
    let nr = parseInt(document.getElementById('nr').value);
    let allocation = [];
    let max = [];
    let avail = [];

    // Collect allocation matrix
    let allocationHTML = "<h3>Allocation Matrix:</h3><table>";
    for (let i = 0; i < np; i++) {
        allocationHTML += "<tr>";
        allocation[i] = [];
        for (let j = 0; j < nr; j++) {
            allocationHTML += `<td><input type="number" id="allocation_${i}_${j}" placeholder="Allocation for P${i} and R${j}"></td>`;
        }
        allocationHTML += "</tr>";
    }
    allocationHTML += "</table>";
    document.getElementById('allocationMatrix').innerHTML = allocationHTML;

    // Collect maximum matrix
    let maxHTML = "<h3>Maximum Matrix:</h3><table>";
    for (let i = 0; i < np; i++) {
        maxHTML += "<tr>";
        max[i] = [];
        for (let j = 0; j < nr; j++) {
            maxHTML += `<td><input type="number" id="max_${i}_${j}" placeholder="Maximum for P${i} and R${j}"></td>`;
        }
        maxHTML += "</tr>";
    }
    maxHTML += "</table>";
    document.getElementById('maxMatrix').innerHTML = maxHTML;

    // Collect available resources
    let availHTML = "<h3>Available Resources:</h3><table><tr>";
    for (let j = 0; j < nr; j++) {
        availHTML += `<td><input type="number" id="avail_${j}" placeholder="Available for R${j}"></td>`;
    }
    availHTML += "</tr></table>";
    document.getElementById('availMatrix').innerHTML = availHTML;

    // Button to trigger the banker function
    document.getElementById("but").innerHTML = `<button onclick="runBanker(${np}, ${nr})">Run Banker's Algorithm</button>`;
}

function runBanker(np, nr) {
    let allocation = [];
    let max = [];
    let avail = [];

    // Collect allocation matrix
    for (let i = 0; i < np; i++) {
        allocation[i] = [];
        for (let j = 0; j < nr; j++) {
            allocation[i][j] = parseInt(document.getElementById(`allocation_${i}_${j}`).value);
        }
    }

    // Collect maximum matrix
    for (let i = 0; i < np; i++) {
        max[i] = [];
        for (let j = 0; j < nr; j++) {
            max[i][j] = parseInt(document.getElementById(`max_${i}_${j}`).value);
        }
    }

    // Collect available resources
    for (let j = 0; j < nr; j++) {
        avail[j] = parseInt(document.getElementById(`avail_${j}`).value);
    }

    // Call the banker function
    banker(np, nr, allocation, max, avail);
}

function banker(np, nr, allocation, max, avail) {
    console.log("Banker function called");
    console.log("I am called");
    let need = [];
    for (let i = 0; i < np; i++) {
        need[i] = [];
        for (let j = 0; j < nr; j++) {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    // ----------------------
    let needHTML = "<h3>Need Matrix:</h3><table>";
    for (let i = 0; i < np; i++) {
        needHTML += "<tr>";
        for (let j = 0; j < nr; j++) {
            needHTML += `<td>${need[i][j]}</td>`;
        }
        needHTML += "</tr>";
    }
    needHTML += "</table>";

    // Display the need matrix
    document.getElementById('need').innerHTML = needHTML;
    // ----------------------
    let finish = Array(np).fill(0);
    let safeSeq = [];
    for (let i = 0; i < np; i++) {
        let flag = 0;
        if (finish[i] === 0) {
            for (let j = 0; j < nr; j++) {
                if (need[i][j] > avail[j]) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                finish[i] = 1;
                safeSeq.push(i);
                for (let j = 0; j < nr; j++)
                    avail[j] += allocation[i][j];
                i = -1;
            }
        }
    }

    let output = "";
    let flag = 0;
    if (safeSeq.length === np) {
        output = "<p>The system is in safe state! <br> Safe sequence is == >";
        for (let i = 0; i < np; i++)
            output += ` P${safeSeq[i]}`;
        output += "</p>";
    } else {
        output = "<p>The system is in deadlock</p>";
        flag = 1;
    }

    document.getElementById('output').innerHTML = output;

    if (safeSeq.length === np) {
        document.getElementById('safeSeq').innerHTML = "Safe sequence: " + safeSeq.map(p => "P" + p).join(" -> ");
    } else {
        document.getElementById('safeSeq').innerHTML = "";
    }

}
