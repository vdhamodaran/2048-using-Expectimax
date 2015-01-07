function GameManager(size, InputManager, Actuator) {
    this.size         = size; // Size of the grid
    this.inputManager = new InputManager;
    this.actuator     = new Actuator;
    
    this.running      = false;
    
    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    
    this.inputManager.on('think', function() {
                         this.actuator.showHint(best.move);
                         }.bind(this));
    
    
    this.inputManager.on('run', function() {
                         if (this.running) {
                         this.running = false;
                         this.actuator.setRunButton('Auto-run');
                         } else {
                         this.running = true;
                         this.run()
                         this.actuator.setRunButton('Stop');
                         }
                         }.bind(this));
    
    this.setup();
}

GameManager.prototype.restart = function () {
    this.actuator.restart();
    this.running = false;
    this.actuator.setRunButton('Auto-run');
    this.setup();
};

GameManager.prototype.setup = function () {
    this.grid         = new Grid(this.size);
    this.grid.addStartTiles();
    
    this.currentState  = new State2048(this.grid);

    this.score        = 0;
    this.over         = false;
    this.won          = false;

    this.actuate();
};


GameManager.prototype.actuate = function () {
    this.actuator.actuate(this.grid, {
                          score: this.score,
                          over:  this.over,
                          won:   this.won
                          });
};

GameManager.prototype.move = function(direction) {
    var result = this.grid.move(direction);
    this.score += result.score;
    
    if (!result.won) {
        if (result.moved) {
            this.grid.computerMove();
        }
    } else {
        this.won = true;
    }
    
    
    if (!this.grid.movesAvailable()) {
        this.over = true;
    }
    
    this.actuate();
}

GameManager.prototype.run = function() {
    
    var action = this.getAction();
    this.move(action);
    
    var timeout = animationDelay;
    if (this.running && !this.over && !this.won) {
        var self = this;
        setTimeout(function(){
                   self.run();
                   }, timeout);
    }
}

GameManager.prototype.getAction = function(){
    var action          = -1;
    var bestScore       = Number.MIN_VALUE;
    var movesBest       = [];
    this.currentState   = new State2048(this.grid);
    var stateTrans      = this.currentState.getAllMoveStates();
    
    
    for(var i= 0; i < stateTrans.length; i ++){
        var stateTran   = stateTrans[i];
        var moveRating  = this.currentState.expectiminimax(stateTran.state, 3, false);
        
        if (moveRating > bestScore){
            bestScore = moveRating;
            movesBest = [];
        }
        
        if (moveRating == bestScore){
            movesBest.push(stateTran);
        }
    }
    
    if (movesBest[0].dir == MoveDir.Left){
        this.currentState.pushLeft();
        action = MoveDir.Left;
    }
    else if (movesBest[0].dir == MoveDir.Right){
        this.currentState.pushRight();
        action = MoveDir.Right;
    }
    else if (movesBest[0].dir == MoveDir.Up){
        this.currentState.pushUp();
        action = MoveDir.Up;
    }
    else if (movesBest[0].dir == MoveDir.Down){
        this.currentState.pushDown();
        action = MoveDir.Down;
    }
    
    return action;
}
