
let gamedata = {
    phase: 'cards',
    moves: 3,
    currentmove: 0,
    currentplayer: 0,
    currentCardTable: 0,
    players: [
        {
            id: 'red', loc: 3, loc2: 'train', index: 0, cards: [
                { id: 'shoot' },
                { id: 'shoot' },
                { id: 'move' },
                { id: 'take' },
                { id: 'take' },
                { id: 'hit' },
                { id: 'climb' },
            ],
            shoots: 0
        },
        {
            id: 'blue', loc: 3, loc2: 'train', index: 1, cards: [
                { id: 'shoot' },
                { id: 'move' },
                { id: 'take' },
                { id: 'move' },
                { id: 'take' },
                { id: 'hit' },
                { id: 'climb' },
            ], shoots: 0
        }
    ],
    items: [
        { id: 'loot', value: 500, loc: 2 },
        { id: 'loot', value: 500, loc: 2 },
        { id: 'loot', value: 500, loc: 10 },
        { id: 'loot', value: 500, loc: 20 },



    ],
    cardsTable: [

    ],
    laidCard: false,
    trainChoose: 0,
    shooted: 0
}

let gd = gamedata;




function processGame() {
    console.log('processgame');

    document.querySelector('#faza').innerHTML = gd.phase;

    document.querySelectorAll('.train').forEach(element => {
        element.innerHTML = '';
    });

    document.querySelectorAll('.current').forEach(element => {
        element.classList.remove('current');
    });

    document.querySelector('#loots').innerHTML = ``;
    document.querySelector('#loots2').innerHTML = ``;

    document.querySelector('#shoots').innerHTML = gd.players[0].shoots;
    document.querySelector('#shoots2').innerHTML = gd.players[1].shoots;



    gd.players.forEach(elem => {
        let element = 'train' + elem.loc;
        document.getElementById(element).innerHTML += `<div class="player" style="background:${elem.id}"></div>    `
    });

    document.querySelector('#playercards').innerHTML = '';
    gd.players[gd.currentplayer].cards.forEach((elem, index) => {

        document.querySelector('#playercards').innerHTML += `<div class="card" onclick="stackCard(${index})" style="border: 2px ${gd.players[gd.currentplayer].id} solid"><div class="cardheader">${elem.id}</div></div>`
    })

    document.querySelector('#playerinfo').innerHTML = `<span style="color:${gd.players[0].id}" class="${gd.currentplayer == 0 && gd.phase =='cards' ? 'current' : ''}"> ${gd.players[0].id} </span>`;
    document.querySelector('#playerinfo2').innerHTML = `<span style="color:${gd.players[1].id}" class="${gd.currentplayer == 1 && gd.phase =='cards' ? 'current' : ''}"> ${gd.players[1].id} </span>`;

    if (gd.currentplayer == 0) {
        document.querySelector('#playerinfoall1').classList.add('current');
        document.querySelector('#playerinfoall2').classList.remove('current');

    }

    if (gd.currentplayer == 1) {
        document.querySelector('#playerinfoall2').classList.add('current');
        document.querySelector('#playerinfoall1').classList.remove('current');

    }


    gd.items.forEach(elem => {
        let element = 'train' + elem.loc;
        if (elem.loc < 10) {
            document.getElementById(element).innerHTML += `<div class="${elem.id}"></div>    `
        } else {
            if (elem.loc == 10) {
                document.querySelector('#loots').innerHTML += `<div class="${elem.id}" style="display:inline-block"></div>`
            }

            if (elem.loc == 20) {
                document.querySelector('#loots2').innerHTML += `<div class="${elem.id}" style="display:inline-block"></div>`
            }


        }

    })
}

function runAction() {
    var old_element = document.getElementById("train-all");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    document.querySelectorAll('.choose').forEach(element => {
        element.classList.remove('choose');
    })

    document.querySelector('#actionbutton').style.visibility = 'hidden';


    let elem = gd.cardsTable[0];

    gd.trainChoose = 0;
    gd.shooted = 0;


    if (elem.id == 'move') {
        chooseTrainListener(elem.player, gd.players[elem.player].loc);

    }

    if (elem.id == 'shoot') {
        let trains = [0, 1, 2, 3, 4];
        trains.splice(gd.players[elem.player].loc, 1);
        console.log(trains);

        for (let i = 0; i < trains.length; i++) {
            document.querySelector('#trainc' + trains[i]).classList.add('choose');
            document.querySelector('#trainc' + trains[i]).addEventListener('click', () => { makeShoot(trains[i]) })

        }

    }

    if (elem.id == 'take') {
        let item = gd.items.filter(el => el.id == 'loot').find(el => el.loc == gd.players[elem.player].loc);
        if (item) {
            item.loc = 10 + elem.player;
        }

        document.querySelector('#actionbutton').style.visibility = 'visible';

    }

    if (elem.id == 'hit') {
        let targetplayer = 0;
        if (elem.player == 0) {
            targetplayer = 1;
        }
        if (gd.players[targetplayer].loc == gd.players[elem.player].loc) {
            console.log('WCHODZI');
            targetitem = {};
            if (targetplayer == 0) {
                targetitem = gd.items.find(el => el.loc == 10);
            }
            if (targetplayer == 1) {
                targetitem = gd.items.find(el => el.loc == 20);
            }
            console.log(targetitem);
            if (targetitem) {
                targetitem.loc = gd.players[targetplayer].loc;
            }
            console.log(targetitem);


            processGame();

            chooseTrainListener(targetplayer);

        }else{
            document.querySelector('#actionbutton').style.visibility = 'visible';

        }





    }

    document.querySelector('#roundcards').innerHTML = `<div class="card cardtable" style="border: 2px ${gd.players[elem.player].id} solid"><div class="cardheader">${elem.id}</div></div>`;

    gd.cardsTable.shift();

    if (gd.cardsTable.length == 0) {
        gd.phase = 'cards';
        document.querySelector('#actionbutton').style.visibility = 'hidden';
        document.querySelector('#playercards').style.visibility = 'visible';
        document.querySelector('#roundcards').innerHTML = '';
        gd.currentmove = 0;
        gd.laidCard = false;
    }

    processGame();


   
}


let chooseTrain = function (player, loc) {
    if (gd.trainChoose == 0) {
        gd.trainChoose = 1;
        gd.players[player].loc = loc;
        processGame();
        document.querySelector('#actionbutton').style.visibility = 'visible';
    }
}

function chooseTrainListener(player) {
    let loc = gd.players[player].loc;
    if (loc > 0) {
        document.querySelector('#train-all').children[gd.players[player].loc - 1].classList.add('choose');
        document.querySelector('#train-all').children[gd.players[player].loc - 1].addEventListener('click', () => { chooseTrain(player, loc - 1) }, true);
    }

    if (loc < 4) {
        document.querySelector('#train-all').children[gd.players[player].loc + 1].classList.add('choose');
        document.querySelector('#train-all').children[gd.players[player].loc + 1].addEventListener('click', () => { chooseTrain(player, loc + 1) }, true);
    }

   

}

function makeShoot(loc) {
    if (gd.shooted == 0) {
        gd.shooted = 1;
        if(gd.players.find((el) => el.loc == loc)){
            gd.players.find((el) => el.loc == loc).shoots += 1;
        }
    }

    processGame();

    document.querySelector('#actionbutton').style.visibility = 'visible';

}


function stackCard(i) {
    if (gd.laidCard == true) {
        return;
    }

    if (gd.phase != 'cards') {
        return;
    }

    let elem = gd.players[gd.currentplayer].cards.splice(i, 1);
    elem[0].player = gd.currentplayer;
    gd.cardsTable.push(elem[0]);

    document.querySelector('#roundcards').innerHTML = `<div class="card cardtable" style="border: 2px ${gd.players[gd.currentplayer].id} solid"><div class="cardheader">${elem[0].id}</div></div>`;

    processGame();

    gd.laidCard = true;
    document.querySelector('#endturnbutton').style.visibility = 'visible';

}

function endTurn() {

    gd.currentplayer++;
    gd.laidCard = false;

    if (gd.currentplayer > gd.players.length - 1) {
        gd.currentplayer = 0;
    }


  

    if (gd.currentmove > gd.moves) {
        gd.phase = 'action';
        document.querySelector('#actionbutton').style.visibility = 'visible';
        document.querySelector('#playercards').style.visibility = 'hidden';
        document.querySelector('#endturnbutton').style.visibility = 'hidden';
        document.querySelector('#roundcards').innerHTML = '';

    }


    document.querySelector('#endturnbutton').style.visibility = 'hidden';

    gd.currentmove++;
    processGame();


}

processGame();