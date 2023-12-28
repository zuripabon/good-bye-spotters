import Dialog from "./Dialog"
import { rn, text } from "./utils"

class RandomDialog implements Dialog {

    private dialogs: string[]
    private currentDialogCursor: number = 0

    constructor(dialogs: string[]) {
        this.dialogs = dialogs       
    }

    show():void{
        this.currentDialogCursor = ~~rn(0, this.dialogs.length-1)
        const dialog = this.dialogs[this.currentDialogCursor]
        text(dialog)
    }

    hide(){
        text("")
    }

    currentDialogIndex(): number {
        return this.currentDialogCursor
    }
}

export default RandomDialog