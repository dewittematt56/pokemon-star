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