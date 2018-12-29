
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
        this.tileGridBitmapData = this.game.make.bitmapData(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE, dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE);

        this.tileGridGraphic = this.tileGridBitmapData.addToWorld(0, 0, 0, 0, GAME_SCALE, GAME_SCALE);

        this.tileDrawingSprite = this.game.add.sprite(0, 0, 'ground-tileset', this.blackFrame);
        this.tileDrawingSprite.visible = false;

        this.tileGridGraphic.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.tileGridGraphic.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
    }

    createStaticsGrid () {
        this.staticsGridBitmapData = this.game.make.bitmapData(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE, dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE);

        this.staticsGridGraphic = this.staticsGridBitmapData.addToWorld(0, 0, 0, 0, GAME_SCALE, GAME_SCALE);

        this.staticsDrawingSprite = this.game.add.sprite(0, 0, 'statics-tileset', 0);
        this.staticsDrawingSprite.visible = false;

        this.staticsGridGraphic.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.staticsGridGraphic.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
    }

    createDarknessGrid () {
        this.darknessGrid = [];
        this.darknessGridGroup = this.game.add.group();

        let row,
            col,
            tile,
            darknessValue = 1;

        if(this.game.boardAlwaysNight === false){
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

    /**
     * Updates the whole tile grid. Used at init and board change. Use the edge ones for player movement.
     */
    updateTileGrid () {
        let row,
            col,
            playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            tileGridBitmapData = this.tileGridBitmapData,
            tileDrawingSprite = this.tileDrawingSprite,
            currentMapGroundGrid = this.currentMapGroundGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            viewDiameter = dungeonz.VIEW_DIAMETER;

        // Change the pixel data of the ground bitmap for each tile within the player's view diameter.
        for(row=0; row<viewDiameter; row+=1){

            for(col=0; col<viewDiameter; col+=1){
                // Check the cell to view is in the current map bounds.
                if(currentMapGroundGrid[playerRow + row - viewRange] !== undefined){
                    if(currentMapGroundGrid[playerRow + row - viewRange][playerCol + col - viewRange] !== undefined){
                        tileDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][playerCol + col - viewRange];
                        tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, row * tileSize);
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                tileDrawingSprite.frame = this.blackFrame;
                tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, row * tileSize);
            }
        }
    }

    /**
     * Updates the bitmapdata around the edge in the direction that was moved in, as the rest of the data is just shifted and wraps back around.
     */
    updateTileGridEdgeTop () {
        const row = 0,
            playerCol = this.game.player.col,
            tileGridBitmapData = this.tileGridBitmapData,
            tileDrawingSprite = this.tileDrawingSprite,
            currentMapGroundGrid = this.currentMapGroundGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.game.player.row + row - viewRange;
        let col;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            // Check the cell to view is in the current map bounds.
            if(currentMapGroundGrid[targetRow] !== undefined){
                if(currentMapGroundGrid[targetRow][playerCol + col - viewRange] !== undefined){
                    tileDrawingSprite.frame = currentMapGroundGrid[targetRow][playerCol + col - viewRange];
                    tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, rowPosition);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileDrawingSprite.frame = this.blackFrame;
            tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, rowPosition);
        }
    }

    updateTileGridEdgeBottom () {
        const row = dungeonz.VIEW_DIAMETER-1,
            playerCol = this.game.player.col,
            tileGridBitmapData = this.tileGridBitmapData,
            tileDrawingSprite = this.tileDrawingSprite,
            currentMapGroundGrid = this.currentMapGroundGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.game.player.row + row - viewRange;
        let col;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            // Check the cell to view is in the current map bounds.
            if(currentMapGroundGrid[targetRow] !== undefined){
                if(currentMapGroundGrid[targetRow][playerCol + col - viewRange] !== undefined){
                    tileDrawingSprite.frame = currentMapGroundGrid[targetRow][playerCol + col - viewRange];
                    tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, rowPosition);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileDrawingSprite.frame = this.blackFrame;
            tileGridBitmapData.draw(tileDrawingSprite, col * tileSize, rowPosition);
        }
    }

    updateTileGridEdgeLeft () {
        const col = 0,
            playerRow = this.game.player.row,
            tileGridBitmapData = this.tileGridBitmapData,
            tileDrawingSprite = this.tileDrawingSprite,
            currentMapGroundGrid = this.currentMapGroundGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.game.player.col + col - viewRange;
        let row;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            // Check the cell to view is in the current map bounds.
            if(currentMapGroundGrid[playerRow + row - viewRange] !== undefined){
                if(currentMapGroundGrid[playerRow + row - viewRange][targetCol] !== undefined){
                    tileDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][targetCol];
                    tileGridBitmapData.draw(tileDrawingSprite, colPosition, row * tileSize);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileDrawingSprite.frame = this.blackFrame;
            tileGridBitmapData.draw(tileDrawingSprite, colPosition, row * tileSize);
        }
    }

    updateTileGridEdgeRight () {
        const col = dungeonz.VIEW_DIAMETER-1,
            playerRow = this.game.player.row,
            tileGridBitmapData = this.tileGridBitmapData,
            tileDrawingSprite = this.tileDrawingSprite,
            currentMapGroundGrid = this.currentMapGroundGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.game.player.col + col - viewRange;
        let row;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            // Check the cell to view is in the current map bounds.
            if(currentMapGroundGrid[playerRow + row - viewRange] !== undefined){
                if(currentMapGroundGrid[playerRow + row - viewRange][targetCol] !== undefined){
                    tileDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][targetCol];
                    tileGridBitmapData.draw(tileDrawingSprite, colPosition, row * tileSize);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            tileDrawingSprite.frame = this.blackFrame;
            tileGridBitmapData.draw(tileDrawingSprite, colPosition, row * tileSize);
        }
    }

    updateStaticsGrid () {
        //console.log("update statics grid: ", this.currentMapStaticsGrid);
        const playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            viewDiameter = dungeonz.VIEW_DIAMETER;
        let row,
            col;

        // Change the frames of the static entities for each tile within the player's view diameter.
        for(row=0; row<viewDiameter; row+=1){

            for(col=0; col<viewDiameter; col+=1){
                // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
                staticsGridBitmapData.clear(col * tileSize, row * tileSize, tileSize, tileSize);
                // Check the cell row to view is in the current map bounds. Do this after clear otherwise previous statics won't be cleared.
                if(currentMapStaticsGrid[playerRow + row - viewRange] === undefined) continue;
                // Check the cell row to view is in the current map bounds.
                if(currentMapStaticsGrid[playerRow + row - viewRange] === undefined) continue;
                // Check the cell column to view is in the current map bounds.
                if(currentMapStaticsGrid[playerRow + row - viewRange][playerCol + col - viewRange] === undefined) continue;
                // Check it isn't an empty tile. i.e. no static entity there.
                if(currentMapStaticsGrid[playerRow + row - viewRange][playerCol + col - viewRange] === 0) continue;
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = currentMapStaticsGrid[playerRow + row - viewRange][playerCol + col - viewRange];
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, row * tileSize);
            }
        }
    }

    updateStaticsGridEdgeTop () {
        const row = 0,
            playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = playerRow + row - dungeonz.VIEW_RANGE;
        let col;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][playerCol + col - viewRange] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][playerCol + col - viewRange] !== 0){
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = currentMapStaticsGrid[targetRow][playerCol + col - viewRange];
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, rowPosition);
            }
        }
    }

    updateStaticsGridEdgeBottom () {
        const row = dungeonz.VIEW_DIAMETER-1,
            playerCol = this.game.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.game.player.row + row - dungeonz.VIEW_RANGE;
        let col;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][playerCol + col - viewRange] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][playerCol + col - viewRange] !== 0){
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = currentMapStaticsGrid[targetRow][playerCol + col - viewRange];
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, rowPosition);
            }
        }
    }

    updateStaticsGridEdgeLeft () {
        const col = 0,
            playerRow = this.game.player.row,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.game.player.col + col - dungeonz.VIEW_RANGE;
        let row;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[playerRow + row - viewRange] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[playerRow + row - viewRange][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[playerRow + row - viewRange][targetCol] !== 0){
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = currentMapStaticsGrid[playerRow + row - viewRange][targetCol];
                staticsGridBitmapData.draw(staticsDrawingSprite, colPosition, row * tileSize);
            }
        }
    }

    updateStaticsGridEdgeRight () {
        const col = dungeonz.VIEW_DIAMETER-1,
            playerRow = this.game.player.row,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            colPosition = col * tileSize,
            targetCol = this.game.player.col + col - dungeonz.VIEW_RANGE;
        let row;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[playerRow + row - viewRange] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[playerRow + row - viewRange][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[playerRow + row - viewRange][targetCol] !== 0){
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = currentMapStaticsGrid[playerRow + row - viewRange][targetCol];
                staticsGridBitmapData.draw(staticsDrawingSprite, colPosition, row * tileSize);
            }
        }
    }

    updateDarknessGrid () {
        //console.log("update darkness grid");
        let player = this.game.dynamics[this.game.player.entityId],
            lightSources = this.game.lightSources,
            darknessGrid = this.darknessGrid,
            darknessValue = 0,
            viewDiameter = dungeonz.VIEW_DIAMETER;

        if(this.game.boardAlwaysNight === true){
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
        let row,
            col;
        for(row=0; row<viewDiameter; row+=1){
            for(col=0; col<viewDiameter; col+=1){
                darknessGrid[row][col].alpha = darknessValue
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
            targetRow,
            targetCol,
            distFromCenter;

        for(; rowOffset<radiusPlusOne; rowOffset+=1){
            for(colOffset=-radius; colOffset<radiusPlusOne; colOffset+=1){
                targetRow = row + rowOffset;
                targetCol = col + colOffset;

                if(darknessGrid[targetRow] ===  undefined) continue;
                tile = darknessGrid[targetRow][targetCol];
                if(tile ===  undefined) continue;

                rowDist = Math.abs(row - targetRow);
                colDist = Math.abs(col - targetCol);
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