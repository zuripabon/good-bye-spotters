
import Engine from "../engine"
import { gameOverDialog } from "./dialogs"
import Priest from "./priest"
import { enemiesCounter } from "./enemy"

class GameOverNpm extends Priest {

    constructor(glEngine: Engine, id?: string){
        super(glEngine, id || 'gameoverNpc')
    }
    
    onSceneEnter(): void {
        const kills = this.engine.getState('kills') as number
        this.setDialog(gameOverDialog(kills > 0 ? String(kills) : '' ), 'gameOverDialog')
        this.dialog?.start()
    }

    onSceneLeave(): void {
        this.dialog?.end()

        for(let i=1; i<=enemiesCounter; i++){
            this.engine.destroyGameObject(`enemy${i}`, 'world')
        }

        this.engine.getGameObjectById('shotgun', 'world')?.setVisible(false)

    }
}

export default GameOverNpm
