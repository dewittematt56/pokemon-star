import { SceneInfoType } from '../commonTypes/typeDefs';
import { DIRECTION } from '../game/utils/controls/direction';
import { TILE_SIZE } from './configWorld';

export const SCENE_KEYS = {
    WORLD_SCENE: 'WORLD_SCENE',
    BATTLE_SCENE: 'BATTLE_SCENE',
    WILD_ENCOUNTER_SCENE: 'WILD_SCENE',
    TRAINER_BATTLE_SCENE: "TRAINER_BATTLE_SCENE"
}

export const SCENE_INFO: SceneInfoType = Object.freeze({
    "ROUTE_101": {
        mapPath: "/assets/maps/routes/route_101/route_101.png",
        mapKey: "ROUTE_101",
        npcs: [
            {
                id: "1",
                name: "Lady Stephanie",
                type: "TRAINER",
                dialog: {
                    openingWorldMessages: ["Oh hey! Almost missed you there.... is this your first battle?"],
                    openingBattleMessages: ["Hehe, let's see what you got"],
                    defeatMessages: ["Congrats! You've defeated Lady Stephanie", "$1000 has been added to your inventory"]
                },
                location: {x: 30 * TILE_SIZE + 8, y: 24 * TILE_SIZE, direction: DIRECTION.DOWN},
                idleFrames: {
                    DOWN: 0,
                    UP: 12,
                    NONE: 0,
                    LEFT: 4,
                    RIGHT: 8
                },
                scaleSize: .5,
                spriteGridMovementFinishedCallback: () => {},
                spriteChangedDirectionCallback: () => {},
                pokemonParty: [
                    {
                        pokemon: "POOCHYENA",
                        level: 5,
                        ivData: undefined,
                        evData: undefined,
                        currentHp: undefined,
                        moves: ["TACKLE", "GROWL"]
                    }
                ],
                isAggressive: true,
                sightRange: 5,
                spriteInfo: {
                    worldImage: {
                        spriteKey: "worldSprite_NPC_TRAINER_CLERK_F",
                        spritePath: "/assets/sprites/npcs/trAceTrainer_F/gameSprite_Spr_BW_Clerk_F.png",
                        spriteWidth: 64,
                        spriteHeight: 64,
                        animations: [
                            {
                                "key": "worldSprite_NPC_TRAINER_CLERK_F-DOWN",
                                "frames": [1, 2, 3],
                                "frameRate": 3,
                                "repeat": -1,
                                "delay": 0,
                                "yoyo": true,
                                "assetKey": "worldSprite_NPC_TRAINER_CLERK_F"
                            },
                            {
                                "key": "worldSprite_NPC_TRAINER_CLERK_F-UP",
                                "frames": [12, 13, 14],
                                "frameRate": 3,
                                "repeat": -1,
                                "delay": 0,
                                "yoyo": true,
                                "assetKey": "worldSprite_NPC_TRAINER_CLERK_F"
                            },
                            {
                                "key": "worldSprite_NPC_TRAINER_CLERK_F-RIGHT",
                                "frames": [9, 10, 11],
                                "frameRate": 3,
                                "repeat": -1,
                                "delay": 0,
                                "yoyo": true,
                                "assetKey": "worldSprite_NPC_TRAINER_CLERK_F"
                            },
                            {
                                "key": "worldSprite_NPC_TRAINER_CLERK_F-LEFT",
                                "frames": [5, 6, 7],
                                "frameRate": 3,
                                "repeat": -1,
                                "delay": 0,
                                "yoyo": true,
                                "assetKey": "worldSprite_NPC_TRAINER_CLERK_F"
                            }                    
                        ]
                    },
                    portraitImage: {
                        assetKey: "portraitSprite_Spr_BW_Clerk_F",
                        path: "/assets/sprites/npcs/trAceTrainer_F/portraitSpirte_Spr_BW_Clerk_F.png",
                        height: 80,
                        width: 80,
                        animStart: 0,
                        animFinish: 37,
                        frameRate: 10
                    }
                },
                movementPattern: ["DOWN", "DOWN", "DOWN", "DOWN", "UP", "UP", "UP", "UP"]
            }
        ],
        lightingLevel: "",
        music: ["HAPPY_TUNE"]
    }
});