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
                name: "Lacy Stephanie",
                type: "TRAINER",
                dialog: {
                    openingMessages: ["Oh hey! Almost missed you there.... is this your first battle?"]
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
                    worldImage: undefined,
                    portraitImage: {
                        assetKey: "portraitSprite_Spr_BW_Clerk_F",
                        path: "/assets/sprites/npcs/trAceTrainer_F/portraitSpirte_Spr_BW_Clerk_F.png",
                        height: 80,
                        width: 80,
                        animStart: 0,
                        animFinish: 37,
                        frameRate: 10
                    }
                }
            }
        ]
    }
});