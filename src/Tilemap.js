
class Tilemap {

    constructor (game) {
        this.game = game;
        this.blackFrame = 4;

        this.createTileGrid();
        this.createStaticsGrid();

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

    updateTileGrid () {
        let i,
            j;

        // Change the frames of the ground tiles for each tile within the player's view diameter.
        for(i=0; i<dungeonz.VIEW_DIAMETER; i+=1){

            for(j=0; j<dungeonz.VIEW_DIAMETER; j+=1){
                // Check the cell to view is in the current map bounds.
                if(this.currentMapGroundGrid[this.game.player.row + i - dungeonz.VIEW_RANGE] !== undefined){
                    if(this.currentMapGroundGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE] !== undefined){
                        this.tileGrid[i][j].frame = this.currentMapGroundGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE];
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                this.tileGrid[i][j].frame = this.blackFrame;
            }

        }
    }

    updateStaticsGrid () {
        //console.log("update statics grid: ", this.currentMapStaticsGrid);
        let i,
            j;

        // Change the frames of the static entities for each tile within the player's view diameter.
        for(i=0; i<dungeonz.VIEW_DIAMETER; i+=1){

            for(j=0; j<dungeonz.VIEW_DIAMETER; j+=1){
                // Hide all static tiles, and update and show only the relevant ones.
                this.staticsGrid[i][j].visible = false;

                // Check the cell row to view is in the current map bounds.
                if(this.currentMapStaticsGrid[this.game.player.row + i - dungeonz.VIEW_RANGE] !== undefined){
                    // Check the cell column to view is in the current map bounds.
                    if(this.currentMapStaticsGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE] !== undefined){
                        // Check it isn't an empty tile. i.e. no static entity there.
                        if(this.currentMapStaticsGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE] !== 0){
                            //console.log("id: ", this.currentMapStaticsGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE]);
                            // Show the sprite at this tile position.
                            this.staticsGrid[i][j].visible = true;
                            this.staticsGrid[i][j].frame = this.currentMapStaticsGrid[this.game.player.row + i - dungeonz.VIEW_RANGE][this.game.player.col + j - dungeonz.VIEW_RANGE];
                        }
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