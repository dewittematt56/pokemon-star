import { CoordinateType } from "../game/utils/typeDefs/coordinate";


export function findPlayerObjectIntersect(character_bounds: Phaser.Geom.Rectangle, objectLayer: Phaser.Tilemaps.ObjectLayer){
    return objectLayer.objects.find((object) => {
        // Get object bounds
        let xMin = Math.round(object.x!);
        let xMax = Math.round(object.x!) + Math.round(object.width!);
        let yMin = Math.round(object.y!);
        let yMax = Math.round(object.y!) + Math.round(object.height!);
        // Check if the player's position is within the object's bounds
        return character_bounds.left >= xMin && character_bounds.right <= xMax && character_bounds.top >= yMin && character_bounds.bottom <= yMax
    });
}

export function findPlayerPositionIntersectsObject(position: CoordinateType, objectLayer: Phaser.Tilemaps.ObjectLayer): Phaser.Types.Tilemaps.TiledObject | undefined{
    const { x, y } = position;

    for (const obj of objectLayer.objects) {
        const withinX = x >= Number(obj.x) && x < Number(obj.x) + Number(obj.width);
        const withinY = y >= Number(obj.y) && y < Number(obj.y) + Number(obj.height);
        if (withinX && withinY) {
            return obj
        }
    }
}