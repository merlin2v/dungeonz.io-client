
class Tilemap {

    constructor (game) {
        this.game = game;
        this.blackFrame = 4;

        this.createTileGrid();
        this.createStaticsGrid();
        this.createDarknessGrid();

        this.loadMap(this.game.currentBoardName);
    }

    createTileGrid () {
        this.tileGrid = [];
        this.tileGridGroup = this.game.add.group();

        let i,
            j,
            tile;

        for(i=0; i<dungeonz.VIEW_DIAMETER; i+=1){

            this.tileGrid.push([]);

            for(j=0; j<dungeonz.VIEW_DIAMETER; j+=1){
                //console.log(i + ", " + j);
                //console.log(dungeonz.mapsData.overworld);
                tile = this.game.add.sprite(16 * GAME_SCALE * j, 16 * GAME_SCALE * i, 'ground-tileset', this.blackFrame);
                tile.scale.setTo(GAME_SCALE);
                this.tileGrid[i][j] = tile;
                this.tileGridGroup.add(tile);
            }
        }
        //console.log(this.tileGrid);
        this.tileGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.tileGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
    }

    createStaticsGrid () {
        this.staticsGrid = [];
        this.staticsGridGroup = this.game.add.group();

        let i,
            j,
            tile;

        for(i=0; i<dungeonz.VIEW_DIAMETER; i+=1){

            this.staticsGrid.push([]);

            for(j=0; j<dungeonz.VIEW_DIAMETER; j+=1){
                tile = this.game.add.sprite(16 * GAME_SCALE * j, 16 * GAME_SCALE * i, 'statics-tileset', 0);
                tile.scale.setTo(GAME_SCALE);
                tile.visible = false;
                this.staticsGrid[i][j] = tile;
                this.staticsGridGroup.add(tile);
            }
        }

        this.staticsGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.staticsGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
    }

    createDarknessGrid () {
        this.darknessGrid = [];
        this.darknessGridGroup = this.game.add.group();

        let row,
            col,
            tile,
            darknessValue = 1;

        if(this.game.boardIsDungeon === false){
            if(this.game.dayPhase === this.game.DayPhases.Day) darknessValue = 0;
            if(this.game.dayPhase === this.game.DayPhases.Dawn) darknessValue = 0.5;
            if(this.game.dayPhase === this.game.DayPhases.Dusk) darknessValue = 0.5;
        }

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){

            this.darknessGrid.push([]);

            for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                tile = this.game.add.sprite(16 * GAME_SCALE * col, 16 * GAME_SCALE * row, 'ground-tileset', this.blackFrame);
                tile.scale.setTo(GAME_SCALE);
                tile.alpha = darknessValue;
                this.darknessGrid[row][col] = tile;
                this.darknessGridGroup.add(tile);
            }
        }
        this.darknessGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.darknessGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
    }

    updateTileGrid () {
        let row,
            col,
            playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            tileGrid = this.tileGrid,
            currentMapGroundGrid = this.currentMapGroundGrid;

        // Change the frames of the ground tiles for each tile within the player's view diameter.
        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){

            for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                // Check the cell to view is in the current map bounds.
                if(currentMapGroundGrid[playerRow + row - dungeonz.VIEW_RANGE] !== undefined){
                    if(currentMapGroundGrid[playerRow + row - dungeonz.VIEW_RANGE][playerCol + col - dungeonz.VIEW_RANGE] !== undefined){
                        tileGrid[row][col].frame = currentMapGroundGrid[playerRow + row - dungeonz.VIEW_RANGE][playerCol + col - dungeonz.VIEW_RANGE];
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                tileGrid[row][col].frame = this.blackFrame;
            }
        }
    }

    updateStaticsGrid () {
        //console.log("update statics grid: ", this.currentMapStaticsGrid);
        let row,
            col,
            playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            staticsGrid = this.staticsGrid,
            currentMapStaticsGrid = this.currentMapStaticsGrid;

        // Change the frames of the static entities for each tile within the player's view diameter.
        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){

            for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                // Hide all static tiles, and update and show only the relevant ones.
                staticsGrid[row][col].visible = false;

                // Check the cell row to view is in the current map bounds.
                if(currentMapStaticsGrid[playerRow + row - dungeonz.VIEW_RANGE] !== undefined){
                    // Check the cell column to view is in the current map bounds.
                    if(currentMapStaticsGrid[playerRow + row - dungeonz.VIEW_RANGE][playerCol + col - dungeonz.VIEW_RANGE] !== undefined){
                        // Check it isn't an empty tile. i.e. no static entity there.
                        if(currentMapStaticsGrid[playerRow + row - dungeonz.VIEW_RANGE][playerCol + col - dungeonz.VIEW_RANGE] !== 0){
                            // Show the sprite at this tile position.
                            staticsGrid[row][col].visible = true;
                            staticsGrid[row][col].frame = currentMapStaticsGrid[playerRow + row - dungeonz.VIEW_RANGE][playerCol + col - dungeonz.VIEW_RANGE];
                        }
                    }
                }
            }
        }
    }

    updateDarknessGrid () {
        //console.log("update darkness grid");
        let row,
            col,
            player = this.game.dynamics[this.game.player.entityId],
            lightSources = this.game.lightSources,
            darknessGrid = this.darknessGrid,
            darknessValue = 0;

        if(this.game.boardIsDungeon === true){
            darknessValue = 1;
        }
        else {
            // Don't bother doing the rest if it is day.
            if(this.game.dayPhase === this.game.DayPhases.Day) return;
            else if(this.game.dayPhase === this.game.DayPhases.Dawn) darknessValue = 0.5;
            else if(this.game.dayPhase === this.game.DayPhases.Dusk) darknessValue = 0.5;
            else darknessValue = 1;
        }

        // Make the whole thing completely dark.
        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                darknessGrid[row][col].alpha = darknessValue;
            }
        }

        if(player !== undefined){
            this.revealDarkness(player.sprite.x, player.sprite.y, 10);
        }

        let key;
        let lightSource;
        // Lighten the area around each light source.
        for(key in lightSources){
            if(lightSources.hasOwnProperty(key)){
                lightSource = lightSources[key];
                this.revealDarkness(lightSource.x, lightSource.y, lightSource.lightDistance);
            }
        }
    }

    revealDarkness (x, y, radius) {
        const radiusPlusOne = radius + 1;
        let rowOffset = -radius,
            colOffset = -radius,
            row = Math.floor(y / (dungeonz.TILE_SIZE*GAME_SCALE)),
            col = Math.floor(x / (dungeonz.TILE_SIZE*GAME_SCALE)),
            darknessGrid = this.darknessGrid,
            tile,
            rowDist,
            colDist,
            distFromCenter;

        for(; rowOffset<radiusPlusOne; rowOffset+=1){
            for(colOffset=-radius; colOffset<radiusPlusOne; colOffset+=1){
                if(darknessGrid[row + rowOffset] ===  undefined) continue;
                tile = darknessGrid[row + rowOffset][col + colOffset];
                if(tile ===  undefined) continue;

                rowDist = Math.abs(row - (row + rowOffset));
                colDist = Math.abs(col - (col + colOffset));
                distFromCenter = rowDist + colDist;

                if(1 - (distFromCenter / radius) > 0){
                    tile.alpha -= 1 - (distFromCenter / radius);
                    if(tile.alpha < 0){
                        tile.alpha = 0;
                    }
                }
            }
        }
    }

    loadMap (boardName) {
        console.log("* Loading map:", boardName);
        this.game.currentBoardName = boardName;
        this.currentMapGroundGrid = dungeonz.mapsData[boardName].groundGrid;
        this.currentMapStaticsGrid = dungeonz.mapsData[boardName].staticsGrid;

        this.updateTileGrid();
        this.updateStaticsGrid();
    }

}

export default Tilemap;