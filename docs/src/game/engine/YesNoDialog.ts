import RandomDialog from "./RandomDialog"

class YesNoDialog extends RandomDialog {

    private hasStarted: boolean = false
    private hasEnded: boolean = false
    private currentDialogCursor: number = 0
    private yesNoResponses: string[][] = []
    
    constructor(dialogs: string[], yesNoResponses: string[][]) {
        super(dialogs)
        this.yesNoResponses = yesNoResponses       
    }

    yes(){
        const [yesResponse] = this.yesNoResponses[this.currentDialogIndex()]
        this.show(yesResponse)
    }

    no(){
        const [_, noResponse] = this.yesNoResponses[this.currentDialogIndex()]
        this.show(noResponse)
    }
}

export default YesNoDialog