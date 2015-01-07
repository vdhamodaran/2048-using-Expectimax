var MoveDir  = { Left : 3, Right : 1, Up :0 , Down : 2};//, Self : 4};

function State2048(grid){
    this.rows = 4;
    this.cols = 4;
    this.cells = [];
    
    if(grid){
        this.buildFromGrid(grid);
    }
    else{
        this.build();
    }
}

State2048.prototype.build = function () {
    for (var x = 0; x < this.rows; x++) {
        var row = [];
        
        for (var y = 0; y < this.cols; y++) {
            row.push(0);
        }
        this.cells.push(row);
    }
};

State2048.prototype.buildFromGrid = function (grid){
    for (var x = 0; x < this.rows; x++) {
            var row = [];
            
        for (var y = 0; y < this.cols; y++) {
            var tile = grid.cells[y][x];
            row.push((tile ? Math.log(tile.value)/Math.LN2:0));
        }
        this.cells.push(row);
    }
};

State2048.prototype.makeFromState  = function(state){
    var newstate = new State2048()
    
    newstate.cells = [];
    
    for(var r = 0; r < state.rows; r++){
        var row = [];
        for(var c = 0; c < state.cols; c++){
            row.push(state.cells[r][c]);
        }
        
        newstate.cells.push(row);
    }

    return newstate;
}


State2048.prototype.pushLeft = function(){
    for(var r = 0; r < this.rows; r++){
        this.pushRowLeft(r);
    }
}

State2048.prototype.pushRight = function(){
    for(var r = 0; r < this.rows; r++){
        this.pushRowRight(r);
    }
}

State2048.prototype.pushRowLeft = function(r){
    var items = [];
    
    //Collect the items
    for(var c = 0; c < this.cols; c++){
        if (this.cells[r][c] != 0){
            items.push(this.cells[r][c]);
        }
    }
    
    //Consolidate duplicates
    for(var i = 0; i < items.length - 1; i++){
        if (items[i] == items[i+1]){
            items[i] += items[i];
            items.splice(i+1, 1);
        }
    }
    
    //Write the data back to the row
    for(var c = 0; c < this.cols; c++){
        this.cells[r][c] = (c < items.length ? items[c] : 0);
    }
}

State2048.prototype.pushRowRight = function(r){
    //Collect the items
    var items = [];
    for(var c = 0; c < this.cols; c++){
        if (this.cells[r][c] != 0 ){
            items.push(this.cells[r][c]);
        }
    }

    //Consolidate duplicates
    for(var i = items.length - 1; i > 0; i--){
        if (items[i] == items[i-1] ){
            items[i] += items[i];
            items.splice(i - 1, 1);
            i--;
        }
    }

//Write the data back to the row
    for(var i = 0; i < this.cols; i++){
        this.cells[r][this.cols - 1 - i] = ((items.length - 1 - i) >= 0 ? items[items.length - 1 - i] : 0);
    }
}

State2048.prototype.pushUp = function(){
    for(var c = 0; c < this.cols; c++){
        this.pushColUp(c);
    }
}

State2048.prototype.pushColUp = function(c){
    //Collect the items
    var items = [];
    for(var r = 0; r < this.rows; r++){
        if (this.cells[r][c] != 0){
            items.push(this.cells[r][c]);
        }
    }

    //Consolidate duplicates
    for(var i = 0; i < items.length - 1; i++){
        if ( items[i] == items[i+1]){
            items[i] += items[i];
            items.splice(i + 1, 1);
        }
    }

    //Write the data back to the row
    for(var r = 0; r < this.rows; r++){
        this.cells[r][c] = (r < items.length ? items[r] : 0);
    }
}

State2048.prototype.pushDown = function(){
    for(var c = 0; c < this.cols; c++){
        this.pushColDown(c);
    }
}

State2048.prototype.pushColDown = function(c){
    //Collect the items
    var items = [];
    for(var r = 0; r < this.rows; r++){
        if (this.cells[r][c] != 0 ){
            items.push(this.cells[r][c]);
        }
    }

    //Consolidate duplicates
    for(var i = items.length - 1; i > 0; i--){
        if( items[i] == items[i-1]){
            items[i] += items[i];
            items.splice(i - 1, 1);
            i--;
        }
    }

    //Write the data back to the row
    for(var i = 0; i < this.rows; i++){
        this.cells[this.cols - 1 - i][c] = (items.length - 1 - i >= 0 ? items[items.length - 1 - i] : 0);
    }
}


State2048.prototype.getFree = function(){
    var free = [];
    for(var r = 0; r < this.rows; r++){
        for(var c = 0; c < this.cols; c++){
            if( this.cells[r][c] == 0 ){
                free.push({ row: r, column: c});
            }
        }
    }
    return free;
}

/*State2048.prototype.spawnRandom = function(){
    var free = this.getFree();
    if( free.length == 0){
        return;
    }

    var target = free[Math.floor(Math.random() * free.length)];
    this.cells[target.row][target.column] = (Math.random() < .9 ? 1 : 2);
}*/
//var mn = 0;

State2048.prototype.GetSnake = function(horizontal, board){
    var snakeList = [];
    if (horizontal){
        for (var r = 0; r < this.rows; r++){
            for (var c = 0; c < this.cols; c++){
                if (r % 2 == 0){
                    snakeList.push(new NewTile(r,c,board[r][c],4,0));
                }
                else {
                    snakeList.push(new NewTile(r, c, board[r][this.cols - 1 - c], 4, 0));
                }
            }
        }
    }
    else{
        for (var c = 0; c < this.cols; c++){
            for (var r = 0; r < this.rows; r++){
                if (c % 2 == 0){
                    snakeList.push(new NewTile(r, c, board[r][c], 4, 0));
                }
                else{
                    snakeList.push(new NewTile((this.rows - 1 - r), c, board[r][c], 4, 0));
                }
            }
        }
    }
    return snakeList;
}

State2048.prototype.SnakeRating = function(){
    var snakes = [];
    snakes.push(this.GetSnake(true, this.cells));
    snakes.push(this.GetSnake(false, this.cells));
    

    var score = 0;
    var bestScore = 0;
    var weight = 1;
    for (var x = 0; x < snakes.length; x++){
        score = 0;
        weight = 1;
        for (var i = 0; i < snakes[x].length; i++){
            score += (Math.pow(2, snakes[x][i].value) * weight);
            weight *= 0.25;
        }
        if (score > bestScore){
            bestScore = score;
        }
    }
    return bestScore;
}



State2048.prototype.rate = function(){
    return this.SnakeRating();
}

State2048.prototype.getMaxValue = function(){
    var max = 0;
    for (var x = 0; x < rows; x++){
        for (var y = 0; y < cols; y++){
            if (this.cells[x] [y] != 0){
                var value = this.cells[x][y];
                if (value > max){
                    max = value;
                }
            }
        }
    }
    var result = max; // Math.Log(max) / Math.Log(2);
    return result;
}

State2048.prototype.EmptyCells = function()
{
    var freeCount = this.getFree().length;
    return freeCount;
}


State2048.prototype.expectiminimax = function(root, depth, player){
    var bestValue = 0;
    var val = 0;
    if (depth == 0){
        return root.rate();
    }
    if (player){
        bestValue = Number.MIN_VALUE;
        var moves = root.getAllMoveStates();

        if (moves.length == 0){
            return Number.MIN_VALUE;
        }

        for (var i=0; i< moves.length; i++){
            var st = moves[i];
            val = this.expectiminimax(st.state, depth - 1, false);
            bestValue = Math.max(val, bestValue);
        }
        
        return bestValue;
    }
    else{
        bestValue = 0;
        var moves = root.getAllRandom();
        for (var i=0; i< moves.length; i++){
            var st = moves[i];
            bestValue += (this.ProbabilityOfChild(moves.length, i) * this.expectiminimax(st, depth - 1, true));
        }

        return bestValue;
    }
}

State2048.prototype.ProbabilityOfChild = function(possibleChildren, childIndex){
    var probability = 0;
    var chance = 0;
    var twoChild = possibleChildren / 2;
    chance = (childIndex % 2 == 0) ? 0.9 : 0.1;
    probability = parseFloat((1 / twoChild) * chance);
    return probability;
}

State2048.prototype.getAllMoveStates = function(){
    var allMoves = [];
    var next = this.makeFromState(this);
    
    next.pushLeft();
    
    if(!this.equalTo(next)){
        allMoves.push(new StateTrans(next, MoveDir.Left));
    }

    next = this.makeFromState(this);
    next.pushRight();
    
    if( !this.equalTo(next)){
        allMoves.push(new StateTrans(next, MoveDir.Right));
    }

    next = this.makeFromState(this);
    next.pushUp();
    if( !this.equalTo(next)){
        allMoves.push(new StateTrans(next, MoveDir.Up));
    }

    next = this.makeFromState(this);
    
    next.pushDown();
    if( !this.equalTo(next)){
        allMoves.push(new StateTrans(next, MoveDir.Down));
    }
    
    return allMoves;
}

State2048.prototype.getAllRandom = function(){
    var res = [];
    var free = this.getFree();
    
    for(var i = 0; i< free.length; i++){
        var next;
        var x = free[i];

        next = this.makeFromState(this);
        next.cells[x.row][x.column] = 1;
        res.push(next);

        next = this.makeFromState(this);
        next.cells[x.row][x.column] = 2;
        res.push(next);
    }

    return res;
}

State2048.prototype.equalTo = function(alt){
    if( this.rows != alt.rows){
        return false;
    }
    if( this.cols != alt.cols ){
        return false;
    }

    for(var r = 0; r < this.rows; r++){
        for(var c = 0; c < this.cols; c++){
            if( this.cells[r][c] != alt.cells[r][c] ){
                return false;
            }
        }
    }
    
    return true;
}

State2048.prototype.toString = function() {
    var string = '';
    
    for (var i=0; i<4; i++) {
        for (var j=0; j<4; j++) {
            if (this.cells[i][j] !=0 ) {
                string += Math.pow(2, this.cells[i][j]) + ' ';
            } else {
                string += '_ ';
            }
        }
        
        string += '\n';
    }
    
    return string;
}
