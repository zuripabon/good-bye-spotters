import Dialog from "./Dialog"
import { text } from "./utils"

class SequentialDialog implements Dialog {

    protected dialogs: string[]
    protected currentDialogCursor: number = 0

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

    reset(index = 0){
        this.currentDialogCursor = index
    }

    isEmpty(){
        return !this.dialogs.length
    }
}

export default SequentialDialog