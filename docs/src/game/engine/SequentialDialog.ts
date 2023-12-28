import Dialog from "./Dialog"
import { text } from "./utils"

class SequentialDialog implements Dialog {

    private dialogs: string[]
    private currentDialogCursor: number = 0

    constructor(dialogs: string[]) {
        this.dialogs = dialogs       
    }

    show():void {
        const dialog = this.dialogs[this.currentDialogCursor]
        text(dialog)
    }
    
    hide() {
        text("")
        this.currentDialogCursor = 0
    }

    currentDialogIndex(): number {
        return this.currentDialogCursor
    }

    next() {
        this.currentDialogCursor++
        if(this.currentDialogCursor >= this.dialogs.length){
            this.currentDialogCursor = this.dialogs.length - 1
        }
        this.show()
    }
}

export default SequentialDialog