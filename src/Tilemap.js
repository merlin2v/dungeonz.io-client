
import addStaticTile from './Statics'

class Tilemap {

    constructor (game) {
        this.game = game;
        this.blackFrame = 4;

        this.mapRows = 0;
        this.mapCols = 0;

        this.createGroundGrid();
        this.createStaticsGrid();
        this.createDarknessGrid();
    }

    createGroundGrid () {
        this.groundGridBitmapData = this.game.make.bitmapData(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE, dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE);

        this.groundGridGraphic = this.groundGridBitmapData.addToWorld(0, 0, 0, 0, GAME_SCALE, GAME_SCALE);
        this.groundGridGraphic.anchor.setTo(0.5);

        this.groundDrawingSprite = this.game.add.sprite(0, 0, 'ground-tileset', this.blackFrame);
        this.groundDrawingSprite.visible = false;

        this.groundGridGraphic.x = this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
        this.groundGridGraphic.y = this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
    }

    createStaticsGrid () {
        this.staticsGridBitmapData = this.game.make.bitmapData(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE, dungeonz.VIEW_DIAMETER * dungeonz.TILE_SIZE);

        this.staticsGridGraphic = this.staticsGridBitmapData.addToWorld(0, 0, 0, 0, GAME_SCALE, GAME_SCALE);
        this.staticsGridGraphic.anchor.setTo(0.5);

        this.staticsDrawingSprite = this.game.add.sprite(0, 0, 'statics-tileset', 0);
        this.staticsDrawingSprite.visible = false;

        this.staticsGridGraphic.x = this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
        this.staticsGridGraphic.y = this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
    }

    createDarknessGrid () {
        this.darknessGrid = [];
        this.darknessGridGroup = this.game.add.group();

        //this.darknessGridGroup.fixedToCamera = true;

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

        this.darknessGridGroup.x = (this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5)) - (this.darknessGridGroup.width * 0.5);
        this.darknessGridGroup.y = (this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5)) - (this.darknessGridGroup.height * 0.5);
    }

    /**
     * Updates the whole ground grid. Used at init and board change. Use the edge ones for player movement.
     */
    updateGroundGrid () {
        let row,
            col,
            playerRow = this.game.player.row,
            playerCol = this.game.player.col,
            groundGridBitmapData = this.groundGridBitmapData,
            groundDrawingSprite = this.groundDrawingSprite,
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
                        groundDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][playerCol + col - viewRange];
                        groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, row * tileSize);
                        continue;
                    }
                }
                // If the cell to view is out of the current map bounds, show a black frame for that tile.
                groundDrawingSprite.frame = this.blackFrame;
                groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, row * tileSize);
            }
        }
    }

    /**
     * Updates the bitmapdata around the edge in the direction that was moved in, as the rest of the data is just shifted and wraps back around.
     */
    updateGroundGridEdgeTop () {
        const row = 0,
            playerCol = this.game.player.col,
            groundGridBitmapData = this.groundGridBitmapData,
            groundDrawingSprite = this.groundDrawingSprite,
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
                    groundDrawingSprite.frame = currentMapGroundGrid[targetRow][playerCol + col - viewRange];
                    groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, rowPosition);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            groundDrawingSprite.frame = this.blackFrame;
            groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, rowPosition);
        }
    }

    updateGroundGridEdgeBottom () {
        const row = dungeonz.VIEW_DIAMETER-1,
            playerCol = this.game.player.col,
            groundGridBitmapData = this.groundGridBitmapData,
            groundDrawingSprite = this.groundDrawingSprite,
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
                    groundDrawingSprite.frame = currentMapGroundGrid[targetRow][playerCol + col - viewRange];
                    groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, rowPosition);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            groundDrawingSprite.frame = this.blackFrame;
            groundGridBitmapData.draw(groundDrawingSprite, col * tileSize, rowPosition);
        }
    }

    updateGroundGridEdgeLeft () {
        const col = 0,
            playerRow = this.game.player.row,
            groundGridBitmapData = this.groundGridBitmapData,
            groundDrawingSprite = this.groundDrawingSprite,
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
                    groundDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][targetCol];
                    groundGridBitmapData.draw(groundDrawingSprite, colPosition, row * tileSize);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            groundDrawingSprite.frame = this.blackFrame;
            groundGridBitmapData.draw(groundDrawingSprite, colPosition, row * tileSize);
        }
    }

    updateGroundGridEdgeRight () {
        const col = dungeonz.VIEW_DIAMETER-1,
            playerRow = this.game.player.row,
            groundGridBitmapData = this.groundGridBitmapData,
            groundDrawingSprite = this.groundDrawingSprite,
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
                    groundDrawingSprite.frame = currentMapGroundGrid[playerRow + row - viewRange][targetCol];
                    groundGridBitmapData.draw(groundDrawingSprite, colPosition, row * tileSize);
                    continue;
                }
            }
            // If the cell to view is out of the current map bounds, show a black frame for that tile.
            groundDrawingSprite.frame = this.blackFrame;
            groundGridBitmapData.draw(groundDrawingSprite, colPosition, row * tileSize);
        }
    }

    /**
     * Updates the whole statics grid. Used at init and board change. Use the edge ones for player movement.
     */
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
            col,
            targetRow,
            targetCol,
            staticTile;

        // Change the frames of the static entities for each tile within the player's view diameter.
        for(row=0; row<viewDiameter; row+=1){
            targetRow = playerRow + row - viewRange;
            for(col=0; col<viewDiameter; col+=1){
                targetCol = playerCol + col - viewRange;
                // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
                staticsGridBitmapData.clear(col * tileSize, row * tileSize, tileSize, tileSize);
                // Check the cell row to view is in the current map bounds. Do this after clear otherwise previous statics won't be cleared.
                if(currentMapStaticsGrid[targetRow] === undefined) continue;
                // Check the cell column to view is in the current map bounds.
                if(currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
                // Check it isn't an empty tile. i.e. no static entity there.
                if(currentMapStaticsGrid[targetRow][targetCol][0] === 0) continue;
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
                staticsGridBitmapData.draw(staticsDrawingSprite, col * tileSize, row * tileSize);
            }
        }
    }

    updateStaticsGridEdgeTop () {
        const row = 0,
            playerCol = this.game.player.col,
            staticsGridBitmapData = this.staticsGridBitmapData,
            staticsDrawingSprite = this.staticsDrawingSprite,
            currentMapStaticsGrid = this.currentMapStaticsGrid,
            tileSize = dungeonz.TILE_SIZE,
            viewRange = dungeonz.VIEW_RANGE,
            rowPosition = row * tileSize,
            targetRow = this.game.player.row + row - dungeonz.VIEW_RANGE;
        let col,
            targetCol,
            staticTile;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            targetCol = playerCol + col - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][targetCol][0] !== 0){
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
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
        let col,
            targetCol,
            staticTile;

        for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
            targetCol = playerCol + col - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(col * tileSize, rowPosition, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][targetCol][0] !== 0){
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
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
        let row,
            targetRow,
            staticTile;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            targetRow = playerRow + row - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][targetCol][0] !== 0){
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
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
        let row,
            targetRow,
            staticTile;

        for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
            targetRow = playerRow + row - viewRange;
            // Clear all spaces on the bitmap data where a static might go, so there isn't a previous one still shown there.
            staticsGridBitmapData.clear(colPosition, row * tileSize, tileSize, tileSize);
            // Check the cell row to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow] === undefined) continue;
            // Check the cell column to view is in the current map bounds.
            if(currentMapStaticsGrid[targetRow][targetCol] === undefined) continue;
            // Check it isn't an empty tile. i.e. no static entity there.
            if(currentMapStaticsGrid[targetRow][targetCol][0] !== 0){
                // Add a static entity to the statics list, so it can have state changes applied.
                staticTile = addStaticTile(targetRow, targetCol, currentMapStaticsGrid[targetRow][targetCol]);
                // Show the sprite at this tile position.
                staticsDrawingSprite.frame = staticTile.tileID;
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
            //this.revealDarkness(player.sprite.x, player.sprite.y, 10);
            this.revealDarkness(_this.player.row, _this.player.col, 10);
        }

        let key;
        let lightSource;
        // Lighten the area around each light source.
        for(key in lightSources){
            if(lightSources.hasOwnProperty(key)){
                lightSource = lightSources[key];
                //this.revealDarkness(lightSource.x, lightSource.y, lightSource.lightDistance);
                this.revealDarkness(lightSource.row, lightSource.col, lightSource.sprite.lightDistance);
            }
        }
    }

    revealDarkness (rowIn, colIn, radius) {
        // TODO: figure out daytime darkness for dark areas, caves etc.
        const radiusPlusOne = radius + 1;
        let rowOffset = -radius,
            colOffset = -radius,
            row = (Math.floor(rowIn) + dungeonz.VIEW_RANGE) - _this.player.row,
            col = (Math.floor(colIn) + dungeonz.VIEW_RANGE) - _this.player.col,
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
        //console.log("* Ground grid:", this.currentMapGroundGrid);
        this.currentMapStaticsGrid = dungeonz.mapsData[boardName].staticsGrid;
        //console.log("* Statics grid:", this.currentMapStaticsGrid);

        this.mapRows = this.currentMapGroundGrid.length;
        this.mapCols = this.currentMapGroundGrid[0].length;

        //console.log("* Map rows:", this.mapRows);
        //console.log("* Map cols:", this.mapCols);

        if(_this.playerTween !== null){
            _this.playerTween.stop(true);
        }

        this.game.world.setBounds(
            -(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SCALE),
            -(dungeonz.VIEW_DIAMETER * dungeonz.TILE_SCALE),
            this.mapCols * dungeonz.TILE_SCALE + (dungeonz.VIEW_DIAMETER * dungeonz.TILE_SCALE * 2),
            this.mapRows * dungeonz.TILE_SCALE + (dungeonz.VIEW_DIAMETER * dungeonz.TILE_SCALE * 2)
        );

        this.groundGridGraphic.x = this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
        this.groundGridGraphic.y = this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);

        this.staticsGridGraphic.x = this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);
        this.staticsGridGraphic.y = this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5);

        this.darknessGridGroup.x = (this.game.player.col * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5)) - (this.darknessGridGroup.width * 0.5);
        this.darknessGridGroup.y = (this.game.player.row * dungeonz.TILE_SCALE + (dungeonz.TILE_SCALE * 0.5)) - (this.darknessGridGroup.height * 0.5);

        this.updateGroundGrid();
        this.updateStaticsGrid();
    }

}

export default Tilemap;