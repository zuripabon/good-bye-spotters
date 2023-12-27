
import Engine from "../engine"
import ConversationDialog from "../engine/ConversationDialog"
import { gameOverDialog } from "./dialogs"
import Priest from "./priest"

class GameOverNpm extends Priest {

    constructor(glEngine: Engine, id?: string){
        super(glEngine, id)
        this.dialog = new ConversationDialog(gameOverDialog)
    }
    
    onSceneEnter(): void {
        this.dialog.start()
    }
}

export default GameOverNpm
