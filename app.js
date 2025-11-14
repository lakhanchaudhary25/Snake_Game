const board = document.querySelector("#board");
let highScore=document.querySelector("#high-score h2");
const startgame=document.querySelector(".start-game button");
const start=document.querySelector(".start-game");
const filter=document.querySelector(".filter");
const restart=document.querySelector(".game-over button");
const gameOver=document.querySelector(".game-over");
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("game-over.mp3");
let savedHighscore = Number(localStorage.getItem("highscore")) || 0;
highScore.textContent = savedHighscore;
let interval;
let score=document.querySelector("#score h2");
let time=document.querySelector("#time h2");
let [min, sec] = time.textContent.split("-").map(Number);
let timeinterval;
function timer(){
sec++;

if (sec === 60) {
    sec = 0;
    min++;
}

time.textContent = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;}


let cols = Math.floor(board.offsetWidth / 40);
let rows = Math.floor(board.offsetHeight / 40);
let blocks=[];
let foodY=Math.floor(Math.random()*rows);
let foodX=Math.floor(Math.random()*cols);
let grow=false;
let snake=[
    {x:6,y:5},
    {x:6,y:6},
    {x:6,y:7},
];
let head= snake[0];

for (let r = 0; r < rows; r++) {
    //y direction loops for rows
    blocks[r]=[]
    for (let c = 0; c < cols; c++) {
        //x direction loops for columns
        let block = document.createElement("div");
        block.classList.add("blocks");
        board.appendChild(block);
        // block.innerHTML=`${r}-${c}`;
        blocks[r][c]=block;
    };
};
function render(){
   // CLEAR OLD SNAKE
    blocks.forEach(row =>
        row.forEach(block => {
            block.classList.remove("snake", "snake-head");
        })
    );

    // DRAW NEW SNAKE
    snake.forEach(({ x, y }, index) => {
        if (index === 0) {
            blocks[y][x].classList.add("snake-head");
        } else {
            blocks[y][x].classList.add("snake");
        }
    });
    
    food();
    
    
}


let direction="ArrowRight";
let newdirection="ArrowRight";
document.addEventListener("keydown",(evt)=>{
    let key = evt.key;
    if (key === "ArrowRight" && direction !== "ArrowLeft") newdirection = key;
    else if (key === "ArrowLeft"  && direction !== "ArrowRight") newdirection = key;
    else if (key === "ArrowUp"    && direction !== "ArrowDown") newdirection = key;
    else if (key === "ArrowDown"  && direction !== "ArrowUp") newdirection = key;
})

function updatesnake(){
    if(!grow){
    let tail= snake[snake.length-1];
    blocks[tail.y][tail.x].classList.remove("snake");
    snake.pop();
    }
    grow=false;

       let newhead;
       direction=newdirection;
    if(direction=="ArrowRight"){
         newhead= {x:head.x+1,y:head.y};
        
    }
    else if(direction=="ArrowLeft"){
         newhead= {x:head.x-1,y:head.y};
    }
    else if(direction=="ArrowUp"){
         newhead= {x:head.x,y:head.y-1};
       
    }
    else if(direction=="ArrowDown"){
         newhead= {x:head.x,y:head.y+1};
    }

    
        let collision = snake.some((segment,index)=>segment.x===newhead.x&&
          segment.y===newhead.y
        );


        if(!collision){
        snake.unshift(newhead);
        head=newhead;
        }
        else{
            gameOverSound.currentTime = 0;
            gameOverSound.play();
           gameOver.style.display="block";
           filter.style.backdropFilter = "blur(10px)";
            clearInterval(interval);
            clearInterval(timeinterval);
            time.textContent = `${String(0).padStart(2, "0")}-${String(0).padStart(2, "0")}`;
            
        }
        if(foodY===head.y&&foodX===head.x){
        grow=true;
        }

    if(head.y<0 || head.y>=rows || head.x<0 ||head.x>=cols){
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        gameOver.style.display="block";
        filter.style.backdropFilter = "blur(10px)";
        clearInterval(interval);
        clearInterval(timeinterval)
        time.textContent = `${String(0).padStart(2, "0")}-${String(0).padStart(2, "0")}`;
    //    highScore.textContent = localStorage.getItem("highscore") || 0;
        
    }
}

// render()

// food()
// console.log(foodX)
// console.log(foodY)
// console.log(head);
function food(){
    blocks[foodY][foodX].classList.add("food");

    if(foodY===head.y&&foodX===head.x){
        eatSound.currentTime = 0;
        eatSound.play();
        blocks[foodY][foodX].classList.remove("food");
        foodY=Math.floor(Math.random()*rows);
        foodX=Math.floor(Math.random()*cols);
        blocks[foodY][foodX].classList.add("food");
        score.textContent=Number(score.textContent)+10;
        if(Number(highScore.textContent)<Number(score.textContent)){
        highScore.textContent=score.textContent;
        localStorage.setItem("highscore",highScore.textContent);
        
       
    }

    }
}


startgame.addEventListener("click",()=>{
    eatSound.play().catch(() => {});
    gameOverSound.play().catch(() => {});
    eatSound.pause();
    gameOverSound.pause();
    eatSound.currentTime = 0;
    gameOverSound.currentTime = 0;

    filter.style.backdropFilter = "none";
    start.style.display="none";
    interval= setInterval(() => {
    updatesnake();
    render();
}, 90);
 timeinterval=setInterval(timer,1000);
})


    restart.addEventListener("click", () => {
        clearInterval(interval);
        clearInterval(timeinterval);

    snake = [
        { x: 6, y: 5 },
        { x: 6, y: 6 },
        { x: 6, y: 7 },
    ];
    head = snake[0];

    score.textContent = "00";
    min = 0;
    sec = 0;
    time.textContent = "00-00";

    gameOver.style.display = "none";
    filter.style.backdropFilter = "none";

    interval = setInterval(() => {
        updatesnake();
        render();
    }, 90);

    timeinterval = setInterval(timer, 1000);
});

    


