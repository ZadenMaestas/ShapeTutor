/* Game Logic */
/* TODO: Fix unexpected behavior when clicking on shapes during animation or drag further debugging needed */

let selectedShapes = []

/* Helper for document.querySelector('.row').innerHTML with multipliers*/
function addToRow(shape, content, multiplier = 1) {
    for (let i = 0; i < multiplier; i++) {
        document.querySelector('.row').insertAdjacentHTML('beforeend', content);
        /* Shape IDs otherwise there'd be no way to reference specific items onclick*/
        switch (shape) {
            case "circle":
                const circles = document.querySelectorAll('.shape--circle');
                circles[circles.length - 1].classList.add(`circle${i + 1}`);
                break;
            case "star":
                const stars = document.querySelectorAll('.shape--star');
                stars[stars.length - 1].classList.add(`star${i + 1}`);
                break;
            case "square":
                const squares = document.querySelectorAll('.shape--square');
                squares[squares.length - 1].classList.add(`square${i + 1}`);
                break;
            case "triangle":
                const triangles = document.querySelectorAll('.shape--triangle');
                triangles[triangles.length - 1].classList.add(`triangle${i + 1}`);
                break;
            case "polygon":
                const polygons = document.querySelectorAll('.shape--polygon');
                polygons[polygons.length - 1].classList.add(`polygon${i + 1}`);
                break;
            default:
                break;
        }
    }
}

/* Custom Shape Rendering */
function circle(multiplier = 0) {
    addToRow("circle", "<div class=\"game__img\"><img class=\"shape--circle\" src=\"assets/jinu.png\" alt=\"\"></div>", multiplier)
}

function star(multiplier = 0) {
    addToRow("star", "<div class=\"game__img\"><img class=\"shape--star\" src=\"assets/rumi.jpg\" alt=\"\"></div>", multiplier)
}

function square(multiplier = 0) {
    addToRow("square", "<div class=\"game__img\"><img class=\"shape--square\" src=\"assets/sajaboys.jpg\" alt=\"\"></div>", multiplier)
}

function triangle(multiplier = 0) {
    addToRow("triangle", "<div class=\"game__img\"><img class=\"shape--triangle\" src=\"assets/zoey.jpg\" alt=\"\"></div>", multiplier)
}

function polygon(multiplier = 0) {
    addToRow("polygon", "<div class=\"game__img\"><img class=\"shape--polygon\" src=\"assets/mira.webp\" alt=\"\"></div>", multiplier)
}

function startGame() {
    /* Render Game */
    circle(4);
    star(4);
    square(4);
    triangle(4);
    polygon(4);
    shuffle();
}

function selectShape(shape) {
    document.querySelector('.' + shape).parentElement.classList.add('selected');
    selectedShapes.push(shape);
    checkThreeInARow();
}

function removeInt(str) {
    return str.toString().replace(/\d/g, '').replace(' ', '');
}

function onMatch() {
    if (selectedShapes.every(shape => document.querySelector('.' + shape).parentElement.classList.contains('selected'))) {
        const audio = new Audio('assets/soda-pop.mp3');
        audio.play();
        document.querySelector('.' + selectedShapes[0]).parentElement.remove()
        document.querySelector('.' + selectedShapes[1]).parentElement.remove()
        document.querySelector('.' + selectedShapes[2]).parentElement.remove()
        selectedShapes = []
        let points = document.querySelector('#points-title').innerHTML.replace("Points: ", "")
        document.querySelector('#points-title').innerHTML = `Points: ${Number(points) + 1}`
        /* Round is over, start new round */
        if (document.querySelectorAll('.game__img').length === 5) {
            document.querySelector('.row').innerHTML = ""
            startGame();
            let round = document.querySelector('#round-title').innerHTML.replace("Round: ", "")
            document.querySelector('#round-title').innerHTML = `Round: ${Number(round) + 1}`
        }
    }
}

function onNonMatch(match) {
    if (selectedShapes.length === 3 && !match) {
        const audio = new Audio('assets/jinu-giggle.mp3');
        audio.play();
        if (selectedShapes.every(shape => document.querySelector('.' + shape).parentElement.classList.contains('selected'))) {
            document.querySelector('.' + selectedShapes[0]).parentElement.classList.remove('selected')
            document.querySelector('.' + selectedShapes[1]).parentElement.classList.remove('selected')
            document.querySelector('.' + selectedShapes[2]).parentElement.classList.remove('selected')
            selectedShapes = []
            let points = document.querySelector('#points-title').innerHTML.replace("Points: ", "")
            document.querySelector('#points-title').innerHTML = `Points: ${points - 1}`
        }
    }
}

function checkThreeInARow() {
    if (selectedShapes.length < 3) return;
    /* Remove numbering */
    let check1 = removeInt(selectedShapes[0])
    let check2 = removeInt(selectedShapes[1])
    let check3 = removeInt(selectedShapes[2])
    console.log(check1, check2, check3)
    /* Check if shapes are 3 in a row */
    const match = check1 === check2 && check2 === check3;
    console.log(match)
    /* On 3 in a row */
    if (match) {
        onMatch();
    } else {
        onNonMatch(match);
    }
}

startGame();

/* TODO: Fix shuffle function to not mess with onclick event listeners via moving to different function*/
/* Shuffle images, also responsible for adding event click listeners to each image */
function shuffle(multiplier = 1) {
    let game_shape_images = document.querySelectorAll('.game__img');
    for (let i = 0; i < multiplier; i++) {
        game_shape_images.forEach(function (img) {
            img.style.order = Math.floor(Math.random() * 6);
            /* Add shape selection logic to every shape, I realized after design that this is highly flawed
            and the one time I should have complicated it slightly via future proofing in a different function,
            so please don't let this reflect my code quality as this is my first project with pure js architecture
            in about a year it was just the first solution to come to mind in scaffolding the game design without considering
            wanting to shuffle after every attempt
            */
            img.addEventListener('click', () => {
                selectShape(img.querySelector('img').classList[1]);
            })
        });
    }
}