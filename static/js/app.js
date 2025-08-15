'use strict';

(function() {

var board,
    game,
    statusEl = $('#status'),
    hintEl = $('#hint'),
    player = 'w', // 'w' or 'b' for AI mode
    gameMode = 'ai'; // 'ai' or 'two-player'

function init() {
    game = new Chess();
    var cfg = {
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMoveEnd: onMoveEnd,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'static/img/chesspieces/wikipedia/{piece}.png',
        position: 'start',
        showNotation: false,
    };

    if (gameMode === 'ai') {
        cfg.orientation = player === 'w' ? 'white' : 'black';
    } else {
        cfg.orientation = 'white'; // Default for two-player
    }

    board = ChessBoard('board', cfg);

    updateUi();
    if (gameMode === 'ai' && player === 'b') {
        sendPositionToServer(handleMoveFromServer);
    }
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) {
        return false;
    }

    if (gameMode === 'ai') {
        if (game.turn() !== player || piece[0] !== player) {
            return false; // Prevent move.
        }
    } else { // two-player mode
        if (piece[0] !== game.turn()) {
            return false; // Only allow moving pieces of the current turn
        }
    }
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for simplicity.
    });
    if (move === null) {
        return 'snapback';  // Illegal move.
    }
    updateUi();
    if (gameMode === 'ai') {
        // HACK: Add a short pause to prevent board animations interfering with one another.
        window.setTimeout(function(){ sendPositionToServer(handleMoveFromServer) }, 50);
    }
}

function sendPositionToServer(handleMove) {
    var json = JSON.stringify({
        fen: game.fen()
    });
    var currentGame = game;
    $.post('/find_move', json, function(data, status, xhr) {
        // Check that a new game has not started.
        if (currentGame !== game) {
            return;
        }
        if (status === 'success') {
            handleMove(data['best_move']);
        } else {
            statusEl.html('Server failure: ' + serverFailure);
        }
    });
}

function requestHintFromServer() {
    if (!game.game_over()) {
        sendPositionToServer(handleHintFromServer);
    }
}

function handleMoveFromServer(move) {
    game.move(move, {sloppy: true})
    updateBoard();
}

function handleHintFromServer(move) {
    statusEl.html('Hint: ' + move);
}

function onMoveEnd() {
    updateUi();
}

function onSnapEnd() {
    updateBoard();
}

function updateBoard() {
    board.position(game.fen());
}

function updateUi() {
    var status = '';
    var game_over = game.game_over();

    if (game_over) {
        if (game.in_checkmate()) {
            status = 'Checkmate!';
        } else if (game.in_draw()) {
            status = 'It\'s a draw!';
        }
    } else {
        var turn = game.turn() === 'w' ? 'White' : 'Black';
        status = turn + ' to move';
        if (game.in_check()) {
            status += ', in check';
        }
    }
    statusEl.html(status);

    if (gameMode === 'ai') {
        if (game_over) {
            hintEl.hide();
        } else {
            hintEl.show();
        }
    } else { // two-player mode
        hintEl.hide();
    }
}

$('#new_white').click(function(){
    player = 'w';
    gameMode = 'ai';
    init();
});
$('#new_black').click(function(){
    player = 'b';
    gameMode = 'ai';
    init();
});
$('#new_two_player').click(function(){
    gameMode = 'two-player';
    init();
});
hintEl.click(requestHintFromServer);

init();
})();
