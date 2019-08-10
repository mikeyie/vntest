/*
Each kid answers 40 questions

For each level after 5 questions, if they get 80%, they can move on
After 10 questions if they fall below a 40% they get placed in the grade

UI
Time shows up on top bar
Level shows up on top left
*/

var name = "FirstNAME";
var lastName = "LastNAME";
var level = 0;
var totalLevels = 0;
var questions;
var questionCount = 0;
var questionsCorrect = 0;
var questionsWrong = 0;
var questionsTotal = 0;
var percentToPass = 0.8;
var canClick = true;

var buttons = [];

function startup(){
    questions = JSON.parse(JSON.stringify(QUESTIONS));
    totalLevels = questions.length;
    for(var i = 0; i < 4; i++){
        buttons.push(document.getElementById("answer" + i));
        var num = i;
        addEventListener(num);
    }
    elem("levelDisplay").innerHTML = "Grade " + (level + 1);
    elem("startButton").addEventListener("mousedown", startClicked, false);
    stopWatch();
    nextQuestion();
}

var canStart = false;
function checkStart(){
    window.requestAnimationFrame(check);
    function check(){
        if(elem('firstName').value.length + 1 > 1 && elem('lastName').value.length + 1 > 1){
            if(!canStart){
                canStart = true;
                elem('startButton').className = "start";    
            }
        }
        else {
            canStart = false;
            elem('startButton').className = "grey_start";
        }    
    }
}

function startClicked(){
    if(canStart == true){
        name = elem('firstName').value;
        lastName = elem('lastName').value;
        if (btoa(name) === 'bGFzYW5hZG1pbg==' && btoa(lastName) === 'Z2llc3U=') {
            elem('landing').style.opacity = "0";
            elem('testView').style.display = "none";
            elem('rootHtml').style.background = "lightyellow";

            if (!localStorage.testResults) {
                localStorage.testResults = '[]';
            }
            var testResultsJSON = JSON.parse(localStorage.testResults);
            var innerHtml = "<table id='resultsTable'>";
            var length = testResultsJSON.length;
            var index = 0;
            for (index = 0; index < length; index++) {
                var results = testResultsJSON[index];
                innerHtml += '<tr><td width=90%><span class="boldSpan">First:</span> $firstName$&nbsp;&nbsp;&nbsp;<span class="boldSpan">Last Name:</span> $lastName$</td></tr>'.replace('$firstName$', results.firstName).replace('$lastName$', results.lastName);
                innerHtml += '<tr><td width=90%><span class="boldSpan">Date/Time:</span> $dateTimeStamp$</td></tr>'.replace('$dateTimeStamp$', results.dateTimeStamp);
                innerHtml += '<tr><td width=90%><span class="boldSpan">Part:</span> <span class="orangefont">$part$</span></td></tr>'.replace('$part$', results.part);
                innerHtml += '<tr><td width=90%><span class="boldSpan">Passed:</span> <span class="orangefont">$passed$</span></td></tr>'.replace('$passed$', results.passed);
                innerHtml += '<tr><td width=90%><span class="boldSpan">Percentage:</span> $percentage$</td></tr>'.replace('$percentage$', results.percentage);
                innerHtml += '<tr><td width=90%><span class="boldSpan">Questions Correct:</span> $questionsCorrect$&nbsp;&nbsp;&nbsp;<span class="boldSpan">Questions Wrong:</span> $questionsWrong$&nbsp;&nbsp;&nbsp;<span class="boldSpan">Questions Total:</span> $questionsTotal$</td></tr>'.replace('$questionsCorrect$', results.questionsCorrect).replace('$questionsWrong$', results.questionsWrong).replace('$questionsTotal$', results.questionsTotal)
                innerHtml += '<tr><td width=90%><span class="boldSpan">--------------------------------------------------------------------------------------------------</span></td></tr>'
            }
            elem('localStorageResults').innerHTML = innerHtml + "</table>";

            window.setTimeout(function() {
              document.getElementById("landing").style.pointerEvents = "none";
            }, 400)

        } else {
            elem("landing").style.opacity = "0";
            elem('localStorageResults').style.display = "none";
            elem("label").innerHTML = "<b>&#9733;VN Star Test</b> | " + name + " " + lastName;
            window.setTimeout(function() {
              document.getElementById("landing").style.pointerEvents = "none";
            }, 400)
        }
    }
}

function addEventListener(num){
    buttons[num].addEventListener("mouseup", function(){
        answerSelected(num);
    }, false);
}

window.onload = startup;

var correctAnswerIndex;
function nextQuestion(){
    questionCount++;
    var currentQuestionArray = questions[level];
    //var randomIndex = getRandomInt(0, currentQuestionArray.length - 1);
    var randomIndex = 0;
    var currentQuestion = currentQuestionArray[randomIndex];
    var nextQuestion = currentQuestionArray[randomIndex + 1];
    currentQuestionArray.splice(randomIndex, 1);
    
    var answers = currentQuestion.slice(1,5);
    var nextAnswers = nextQuestion ? nextQuestion.slice(1,5) : null;
    var order = [0, 1, 2, 3];
    order = shuffle(order);
    
    correctAnswerIndex = order[0];
    
    elem("image").style.height = "0px";
    elem("question").innerHTML = parse(currentQuestion[0]);
    elem("questionNumber").innerHTML = "Question #" + questionCount;
    
    elem("additionalText").innerHTML = "";
    if(currentQuestion[5]) elem("additionalText").innerHTML = parse(currentQuestion[5]);
    if(currentQuestion[6]){
        elem("image").style.height = "40vh";
        elem("image").src = "./images/" + currentQuestion[6];
        if (nextQuestion) {
            // Preload the next question image...
            elem("imagePreload1").src = "./images/" + nextQuestion[6];
        }
    }
        
    if(!currentQuestion[5] && !currentQuestion[6]){
        elem("image").style.height = "30vh";
        elem("additionalText").innerHTML = placeholderText;
        if (placeholderImage) {
            elem("image").src = "./images/" + placeholderImage;
        } else {
            elem("image").src = "";
        }
    }
    
    for(var i = 0; i < 4; i++){
        buttons[order[i]].innerHTML = parse(answers[i]);
        // Preload the next answers buttons images...
        if (nextAnswers) {
            var nextAnswer = nextAnswers[i];
            var imagePath = nextAnswer.replace(/\[\[(.*)\]\]/g, './images/$1')
            if (imagePath.indexOf("Level") >= 0) {
                elem("imagePreload" + (i+2)).src = imagePath;
            }
        }
    }
}

function answerSelected(num){
    if (canClick) {
        canClick = false;
        var answeredCorrectly = num == correctAnswerIndex;
        var questionsLeft = questions[level].length;
        
        if (answeredCorrectly) {
            answeredCorrectly = true;
            questionsCorrect += 1;
        } else {
            questionsWrong +=1;
        }
        questionsTotal += 1;
        console.log('answeredCorrectly = ' + answeredCorrectly);
        
        //var theoreticalPositivePercentage = questionsCorrect / (questionsLeft + questionsTotal);
        //var theoreticalNegativePercentage = (questionsCorrect + questionsLeft) / (questionsLeft + questionsTotal);
        
        //console.log(theoreticalPositivePercentage);
        
        // if(theoreticalPositivePercentage >= percentToPass){
        //     nextLevel();
        // }
        //else if(theoreticalNegativePercentage < percentToPass || questions[level].length == 0){
        if (questions[level].length == 0) {
            var currentPercentage = getCurrentPercentage();
            console.log('currentPercentage = ' + currentPercentage);
            console.log('percentToPass = ' + percentToPass);
            if (currentPercentage >= percentToPass) {
                nextLevel();
            } else {
                animateFinished();
            }
        }
        else {
            animateNextQuestion();
        }
    }
}

function saveResultsToLocalStorage() {
    console.log('Setting Local Storage...');
    if (!localStorage.testResults) {
        localStorage.testResults = '[]';
    }

    var currentPercentage = getCurrentPercentage();
    var testResultsJSON = JSON.parse(localStorage.testResults);
    var testResults = {
        firstName: name,
        lastName: lastName,
        part: (level + 1),
        questionsCorrect: questionsCorrect,
        questionsWrong: questionsWrong,
        questionsTotal: questionsTotal,
        percentage: ((currentPercentage * 100) + '%'),
        passed: ((currentPercentage >= percentToPass) ? 'Yes': 'No'),
        dateTimeStamp: (new Date()).toLocaleString()
    }
    testResultsJSON.push(testResults);
    localStorage.testResults = JSON.stringify(testResultsJSON);
    console.log('Setting Local Storage...DONE!!');

}

function nextLevel(){
    // Save Test information to lcoal storage before moving to
    // the next level.
    saveResultsToLocalStorage();

    // Next Level and reset the questionsCorrect/Wrong/Total.
    var isLastTest = (level + 1) === totalLevels;
    animateCongrats(isLastTest);

    level++;
    questionCount = 0;
    questionsCorrect = 0;
    questionsWrong = 0;
    questionsTotal = 0;
}

function animateNextQuestion(){
    elem("question").style.color = "rgba(0,0,0,0.0)";
    elem("question").style.transform = "scaleY(0)";
    elem("rightBar").style.opacity = "0";
    for(var i = 0; i < 4; i++){buttons[i].style.opacity = "0";}
    
    window.setTimeout(function(){
        nextQuestion();
        elem("question").style.transform = "scaleY(1)";
        elem("question").style.color = "#fff3bd";
    }, 700);
    
    window.setTimeout(function(){
        for(var i = 0; i < 4; i++){buttons[i].style.opacity = "1";}
        elem("rightBar").style.opacity = "1";
        canClick = true;
    }, 900);
}

function animateFinished(){
    saveResultsToLocalStorage();

    canClick = false;
    elem("popup").style.pointerEvents = "auto";
    elem("popup").style.visibility = "visible";
    elem("popup").style.opacity = "1";

    var percentage = ((getCurrentPercentage() * 100) + '%');
    var popupText = 'You scored ' + questionsCorrect + ' / ' + questionsTotal + ' (' + percentage + ') on <span style="font-weight: bold">Part ' + (level + 1) + ' </span>of the test.<br><br>Thank you for taking the test. Please raise your hand and let Sơ know.';
    elem("popupContents").innerHTML = popupText;
    // elem("popupContents").innerHTML = "Congrats, " + name + "! You've finished the placement test. <br><br> You were placed in <span style='font-weight: bold'> Grade " + (level + 1) + " </span>."; 
}

function animateCongrats(isLastTest) {
    var percentage = ((getCurrentPercentage() * 100) + '%');

    if (isLastTest === true) {        
        var popupText = 'You scored ' + questionsCorrect + ' / ' + questionsTotal + ' (' + percentage + ') on <span style="font-weight: bold">Part ' + (level + 1) + ' </span>of the test.<br><br>Thank you for taking the test. Please raise your hand and let Sơ know.';
        elem("popupContents").innerHTML = popupText;
    } else {
        var popupText = 'You scored ' + questionsCorrect + ' / ' + questionsTotal + ' (' + percentage + ') on <span style="font-weight: bold">Part ' + (level + 1) + ' </span>of the test.<br><br>Great job! <span style="font-weight: bold">Let’s move on to the next part of the test.</span>';
        elem("popupContents").innerHTML = popupText;
    }

    canClick = false;
    elem("popup").style.pointerEvents = "auto";
    elem("popup").style.visibility = "visible";
    elem("popup").style.opacity = "1";

    if (isLastTest === true) {
        return;
    }
    
    window.setTimeout(function(){
        elem("popup").style.opacity = "0";
        document.getElementById("popup").style.pointerEvents = "none";
        elem("levelDisplay").innerHTML = "Grade " + (level + 1);
    }, 7500);
    window.setTimeout(function(){
        elem("popup").style.visibility = "hidden";
        canClick = true;
        animateNextQuestion();
    }, 8000);
}

function getCurrentPercentage(){
    return Math.round((questionsCorrect/questionsTotal * 100)) / 100;
}

function elem(e){
    return document.getElementById(e);
}

function parse(text){
    text = text.replace(/\[\[(.*)\]\]/g, '<img class="inserted_image" src="./images/$1" >')
    text = text.replace(/\*\*(\S(.*?\S)?)\*\*/gm, '<b>$1</b>')
    text = text.replace(/\n/g, '<br/>')
    return text;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stopWatch() {
    let time, intervalId;
    time = -1;
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);
    
    function incrementTime() {
        time++;
        document.getElementById("time").textContent =
                ("0" + Math.trunc(time / 60)).slice(-2) +
                ":" + ("0" + (time % 60)).slice(-2);
    }
}
