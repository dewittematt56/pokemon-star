import { time } from "console";
import { NpcTrainer } from "../../commonClass/characters/npcTrainer/npcTrainer";
import { Player } from "../../commonClass/characters/player/player";
import { LIGHTING_CONFIG } from "../../commonData/configWorld";



export class sceneLightingEngine {
    private scene: Phaser.Scene;
    private player: Player | undefined 
    private layersToLight: (Phaser.Tilemaps.TilemapLayer | null)[]
    private lightSourcesLayer: Phaser.Tilemaps.ObjectLayer;
    private npcSpritesToLight: NpcTrainer[];
    private currentLightingMode: keyof typeof LIGHTING_CONFIG
    private lightingInfo:  typeof LIGHTING_CONFIG[keyof typeof LIGHTING_CONFIG]
    private isReactiveLightingOn: boolean;

    constructor(scene: Phaser.Scene, layersToLight: (Phaser.Tilemaps.TilemapLayer | null)[], lightSourcesLayer: Phaser.Tilemaps.ObjectLayer, npcSpritesToLight: NpcTrainer[], player: Player | undefined, LIGHTING_CONFIG_KEY: keyof typeof LIGHTING_CONFIG | "", isReactiveLightingOn: boolean = true){
        this.scene = scene
        this.layersToLight = layersToLight
        this.lightSourcesLayer = lightSourcesLayer
        this.npcSpritesToLight = npcSpritesToLight
        this.player = player;
        this.currentLightingMode = 
            LIGHTING_CONFIG_KEY ?  
                LIGHTING_CONFIG_KEY
                :
                this.generateTimeOfDayLighting();

        this.lightingInfo = LIGHTING_CONFIG[this.currentLightingMode] 
        this.isReactiveLightingOn = isReactiveLightingOn;
        this.initEngine()

        if(this.isReactiveLightingOn){
            this.reactiveLightingEngine()
        }
    }

    initEngine(){
        // If lights are active, and the current lighting mode turns them off
        if(this.scene.lights.active && !this.lightingInfo.sceneLightsOn){
            this.scene.lights.shutdown()
        }

        this.scene.lights.enable();
        this.layersToLight.map((layer) => {
            if(layer){
                layer.setPipeline("Light2D")
            }
        })
        this.player?.sprite.setPipeline("Light2D")
        this.npcSpritesToLight.map((npc) => [
            npc.sprite.setPipeline("Light2D")
        ])
        if(this.lightingInfo.sceneLightsOn){
            this.setLightSources()
        }
        this.scene.lights.setAmbientColor(this.lightingInfo.ambientColor);
    }

    setLightSources(){
        this.lightSourcesLayer.objects.forEach((object) => {
            let lighting_color_prop = object.properties?.find((prop: any) => prop.name == "LIGHT_COLOR").value as string;
            let lighting_intensity_prop = object.properties?.find((prop: any) => prop.name == "LIGHT_LEVEL").value as number;
            let lighting_radius_prop = object.properties?.find((prop: any) => prop.name == "LIGHT_RADIUS").value as number;
            this.scene.lights.addLight(object.x, object.y, Math.max(lighting_radius_prop, 0))
                .setColor(parseInt(lighting_color_prop.slice(1), 16))
                .setIntensity(Math.max(lighting_intensity_prop, 0) / 6)
        })
    }

    generateTimeOfDayLighting(): keyof typeof LIGHTING_CONFIG {
        // TEMP
        return "AFTERNOON"
        let current_time = new Date().getHours()
        if(current_time > 20){
            return "NIGHT"
        } else if (current_time > 18) {
            return "SUNSET"
        } else if (current_time > 12) {
            return "AFTERNOON"
        } else if (current_time > 9) {
            return "MORNING"
        } else if (current_time > 5) {
            return "SUNRISE"
        } else {
            return "NIGHT"
        }        
    }

    reactiveLightingEngine(){
        setInterval(() => {
            let time_of_day = this.generateTimeOfDayLighting()
            if(this.currentLightingMode !== time_of_day){
                this.currentLightingMode = time_of_day
                this.lightingInfo = LIGHTING_CONFIG[time_of_day];
                this.initEngine();
            }

        }, 15000)
    }
}