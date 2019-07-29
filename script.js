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
var questions;
var questionCount = 0;
var questionsCorrect = 0;
var questionsWrong = 0;
var questionsTotal = 0;
var canClick = true;

var buttons = [];

function startup(){
    questions = JSON.parse(JSON.stringify(QUESTIONS));
    for(var i = 0; i < 4; i++){
        buttons.push(document.getElementById("answer" + i));
        var num = i;
        addEventListener(num);
    }
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
        elem("landing").style.opacity = "0";
        elem("label").innerHTML = "<b>&#9733;VN Star Test</b> | " + name + " " + lastName;
        window.setTimeout(function() {
          document.getElementById("landing").style.pointerEvents = "none";
        }, 400)
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
    currentQuestionArray.splice(randomIndex, 1);
    
    var answers = currentQuestion.slice(1,5);
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
    }
        
    if(!currentQuestion[5] && !currentQuestion[6]){
        elem("image").style.height = "30vh";
        elem("additionalText").innerHTML = placeholderText;
        elem("image").src = "./images/" + placeholderImage;
    }
    
    for(var i = 0; i < 4; i++){
        buttons[order[i]].innerHTML = parse(answers[i]);
    }
}


var percentToPass = 1;
function answerSelected(num){
    if(canClick){
        canClick = false;
        var answeredCorrectly = num == correctAnswerIndex;
        var questionsLeft = questions[level].length;
        
        if(true){
            questionsCorrect += 1;
        }
        questionsTotal += 1;
        
        var theoreticalPositivePercentage = questionsCorrect / (questionsLeft + questionsTotal);
        var theoreticalNegativePercentage = (questionsCorrect + questionsLeft) / (questionsLeft + questionsTotal);
        
        console.log(theoreticalPositivePercentage);
        
        if(theoreticalPositivePercentage >= percentToPass){
            nextLevel();
        }
        else if(theoreticalNegativePercentage < percentToPass || questions[level].length == 0){
            animateFinished();
        }
        else {
            animateNextQuestion();
        }
    }
}

function nextLevel(){
    // Save Test information to lcoal storage before moving to
    // the next level.
    if (!localStorage.testResults) {
        localStorage.testResults = '[]';
    }
    var testResultsJSON = JSON.parse(localStorage.testResults);
    var testResults = {
        firstName: name,
        lastName: lastName,
        level: level,
        questionsCorrect: questionsCorrect,
        questionsWrong: questionsWrong,
        questionsTotal: questionsTotal,
        dateTimeStamp: (new Date()).toLocaleString()
    }
    testResultsJSON.push(testResults);
    localStorage.testResults = JSON.stringify(testResultsJSON);

    level++;
    questionsCorrect = 0;
    questionsWrong = 0;
    questionsTotal = 0;
    animateCongrats();
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
    canClick = false;
    document.getElementById("popup").style.pointerEvents = "auto";
    elem("popup").style.visibility = "visible";
    elem("popup").style.opacity = "1";
    elem("popupContents").innerHTML = "Congrats, " + name + "! You've finished the placement test. <br><br> You were placed in <span style='font-weight: bold'> Grade " + (level + 1) + " </span>."; 
}

function animateCongrats(){
    canClick = false;
    elem("popup").style.pointerEvents = "auto";
    elem("popup").style.visibility = "visible";
    elem("popup").style.opacity = "1";
    
    window.setTimeout(function(){
        elem("popup").style.opacity = "0";
        document.getElementById("popup").style.pointerEvents = "none";
        elem("levelDisplay").innerHTML = "Grade " + (level + 1);
    }, 2000);
    window.setTimeout(function(){
        elem("popup").style.visibility = "hidden";
        canClick = true;
        animateNextQuestion();
    }, 2500);
}

function currentPercentage(){
    return questionsCorrect/questionsTotal;
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