const socket = io.connect("http://localhost:4000");

let firstPlayer=false;
let roomID;

//новая игра
$(".createBtn").click(function(){
    firstPlayer=true;
    const playerName=$("input[name=p1name").val();
    socket.emit('createGame',{name:playerName});
})

//создание сессии
socket.on("newGame",(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $("#message").html("Waiting for player 2, room ID is "+data.roomID).show();
    roomID=data.roomID;
})

//зайти в игру
$(".joinBtn").click(function(){
    const playerName=$("input[name=p2name").val();
    roomID=$("input[name=roomID").val();
    socket.emit('joinGame',{
        name:playerName,
        roomID:roomID
    });
})

//игрок 2 зашел
socket.on("player2Joined",(data)=>{
    transition(data);
  })

//игрок 1 зашел
socket.on("player1Joined",(data)=>{
    transition(data);
})

const transition=(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $(".leaderboard").show();
    $(".controls").show();
    $(".player1 .name").html(data.p1name);
    $(".player2 .name").html(data.p2name);
    $("#message").html(data.p2name+" is here!").show();
}

//выбрать камень ножницы бумагу
$(".controls button").click(function (){
    const choice=$(this).html().trim();
    const choiceEvent=firstPlayer?"choice1":"choice2";
    socket.emit(choiceEvent,{
        choice: choice,
        roomID:roomID
    });
})

//обработчик результата
socket.on("result",(data)=>{
    if(data.winner=="draw"){
        $("#message").html("It's a draw!");
    }else{
        updateDOM(firstPlayer==data.winner?"player1":"player2");
    }
})

const updateDOM=(player)=>{
    const playerDOM=$("."+player+" span");
    const prevScore=parseInt(playerDOM.html().trim());
    playerDOM.html(prevScore+1);
    const winnerName=$("."+player+" .name").html().trim();
    $("#message").html(winnerName+" scored a point!");
}