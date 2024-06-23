export function hpBarColorGenerator(percentFull: number){
    if(percentFull >= .5){return 0x4cd137}
    else if(percentFull >= .2){return 0xeba52f}
    else if(percentFull >= .0){return 0xd13737}
}