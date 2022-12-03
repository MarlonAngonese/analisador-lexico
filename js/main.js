var tokenList = [];
var state = [];
var q = 0;
var qPrincipal = 0;
var letterCounter = 0;
var letterHistory = [];
var invalid = false;
var lastSpace = false;
var countPostInvalid = 0;

$(document).ready(() => {
    var tokenListElement = $('#token-list');
    var tokenField = $('#token');

    $('#add-token').click((e) => {
        e.preventDefault();

        let token = tokenField.val();

        if (token != "" && token != undefined) {
            tokenList.push(token); //Add token to list

            tokenListElement.append(`<span id="${token}-span" class="badge rounded-pill bg-success" style="margin-right: 1%;">${token}`);
            tokenField.val(''); //Reset Token Field

            insertToken(token);
            fillTable(state);
        }
    })
});

const insertToken = (token) => {
    q = 0;

    // Token letters
    for (let i = 0; i < token.length; i++) {
        let current_letter = token[i];

        // Token position exists, but letter not exists yet
        if (state[q] != undefined && state[q][current_letter] == undefined) {
            state[q][current_letter] = qPrincipal + 1;
            q = qPrincipal;
        } else if (state[q] != undefined && state[q][current_letter] != undefined) {
            // Token position exists and letter exists
            q = state[q][current_letter] - 1;
        } else {
            // Token position not exists
            state[q] = { [current_letter]: q + 1 };
        }

        // Set last caracter blank line
        if (i == token.length - 1) {
            state[q + 1] = "-"
        }

        q++;
    }

    qPrincipal = q;
}

const fillTable = (state) => {
    // console.log(state);

    //Remove current tbody and reset letterCouter (validation)
    $('#tbody').remove();
    letterCounter = 0;
    letterHistory = [];
    lastSpace = false;
    $('#token-validation').val('');

    $('#table').append('<tbody id="tbody"></tbody>')
    // console.log(state);
    let tbodyElement = $('#tbody');

    // List state element
    for (index in state) {
        // Include new line to the table
        tbodyElement.append(`<tr id="line-${index}"></tr>`);
        let trElement = $('#line-' + index); //Catch line included

        // Insert 27 cells (q, a - z)
        for (let i = 0; i <= 26; i++) {
            if (i == 0) { // First column (q)
                trElement.append(`<th class="text-center">q${index}</th>`)
            } else {
                // Check if letter has a (q)

                if (state[index][intToChar(i - 1)] != undefined) {
                    trElement.append(`<td class="text-center" id="q${index}-${intToChar(i - 1)}">q${state[index][intToChar(i - 1)]}</td>`);
                } else {
                    trElement.append(`<td class="text-center" id="q${index}-${intToChar(i - 1)}">-</td>`);
                }
            }
        }
    }
}

$('#token-validation').keyup((e) => {
    let letter = e.key;
    let q = letterCounter;

    //console.log(letter);

    if ($('#token-validation').val() == "") {
        letterCounter = 0;
        letterHistory = [];
        invalid = false;
        lastSpace = false;
        countPostInvalid = 0;

        for (let j = 0; j < qPrincipal + 1; j++) {
            for (let i = 0; i < 26; i++) {
                let letterChar = intToChar(i);
                $('#q' + j + '-' + letterChar).css('background-color', '');
                $('#token-validation').css('background-color', '');
                console.log (j + " " + i)
            }
        }
    }

    if (letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 123 && !invalid || (letterHistory.length <= 0 && invalid)) {
        // Remove last cell bg css
        $(letterHistory[letterHistory.length - 1]).css("background-color", "");

        $('#q' + q + '-' + letter).css('background-color', 'green');
        let cell = $('#q' + q + '-' + letter).html();

        if (cell != '-') { // Valid
            invalid = false;
            countPostInvalid = 0;
            $('#token-validation').css('background-color', '');
            // get new cell and add to history
            cellParts = cell.split('q');
            letterCounter = cellParts[1];
            letterHistory.push('#q' + q + '-' + letter);
        } else { // Invalid
            letterHistory.push('#q' + q + '-' + letter);
            $(letterHistory[letterHistory.length - 1]).css("background-color", "red");

            invalid = true;
            $('#token-validation').css('background-color', 'rgb(230, 68, 44)');
        }
    } else if (letter == "Backspace") {
        if (lastSpace) {
            for (let i = 0; i < 26; i++) {
                let letterChar = intToChar(i);
                $('#q' + q + '-' + letterChar).css('background-color', '');
            }

            if ($('#token-validation').val()[$('#token-validation').val().length - 1] != " ") {
                lastSpace = false;
                $(letterHistory[letterHistory.length - 1]).css('background-color', 'green');
                $('#token-validation').css('background-color', '');
            }
        } else {
            if (countPostInvalid > 0) {
                countPostInvalid--;
            } else {
                // Remove last cell bg css
                $(letterHistory[letterHistory.length - 1]).css("background-color", "");
                letterHistory.pop(); //Remove last element from history
    
                if (letterHistory.length > 0) {
                    // Apply logic to add new element to css
                    $(letterHistory[letterHistory.length - 1]).css('background-color', 'green');
                    let cell = $($(letterHistory[letterHistory.length - 1])).html();
    
                    if (cell != '-') {
                        invalid = false;
                        countPostInvalid = 0;
                        $('#token-validation').css('background-color', '');
                        // get new cell and add to history
                        cellParts = cell.split('q');
                        letterCounter = cellParts[1];
                    }
                } else {
                    letterCounter = 0;
                    $('#token-validation').css('background-color', '');
                }
            }
        }

    } else if (letter == " " && !invalid) { //Space
        //Finalize token

        // Remove last cell bg css
        $(letterHistory[letterHistory.length - 1]).css("background-color", "");

        for (let i = 0; i < 26; i++) {
            let letterChar = intToChar(i);
            $('#q' + q + '-' + letterChar).css('background-color', 'green');

            $('#token-validation').css('background-color', 'rgb(61, 255, 110)');
        }

        lastSpace = true;

    } else {
        //ignore	
        countPostInvalid++;
        $('#token-validation').css('background-color', 'rgb(230, 68, 44)');
        //console.log(countPostInvalid);
    }
    //console.log(letterHistory);
})

const intToChar = (int) => {
    const code = 'a'.charCodeAt(0);

    return String.fromCharCode(code + int);
}