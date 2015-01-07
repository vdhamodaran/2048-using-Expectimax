function NewTile(r, c, v, gridsize, d){
    this.row = r;
    this.col = c;
    this.value = v;
    this.n = gridsize;
    this.depth = d;
}

NewTile.prototype.WithinBorder = function(){
    return (row >= 0 && row < n) && (col >= 0 && col < n);
    
}

/*NewTile.prototype.Equals = function(obj){
    if (obj == null) return false;
    var objAsTile = obj;
    if (objAsTile == null)
        return false;
    else{
        return this.Equals(objAsTile);
    }
}*/

/*NewTile.prototype.Equals = function(otherTile){
    return otherTile.col == this.col && otherTile.row == this.row;
}

NewTile.prototype.GetHashCode = function(){
    return row * col * value * n;
}

NewTile.prototype.ToString = function(){
    var valstr = (value >= 1 ? Math.Pow(2, value).ToString() : "0");
    return (valstr + "(" + row + "," + col + ") ");
}*/