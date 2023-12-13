import MultiDialog from "./MultiDialog"
import SequentialDialog from "./SequentialDialog"

class ConversationDialog extends MultiDialog {

    private isQuestioning: boolean = false
    private hasEnded: boolean = false
    private yesNoResponses: SequentialDialog[] = []
    
    constructor(dialogs: {dialog: string[], yesNo: string[]}[]) {
        super(dialogs.map(({dialog})=> dialog))
        this.yesNoResponses = dialogs.map(({yesNo}) => new SequentialDialog(yesNo))      
    }

    start(){
        super.show()
        this.isQuestioning = this.currentDialogIndex() === this.multiDialogs[this.currentMultiDialogCursor].length-1;
        this.hasEnded = false
    }

    end(){
        super.hide()
    }

    yes(){
        if(!this.isQuestioning || this.hasEnded){
            return;
        }
        this.yesNoResponses[this.currentMultiDialogCursor].show()
        this.hasEnded = true
    }

    no(){
        if(!this.isQuestioning || this.hasEnded){
            return;
        }
        this.yesNoResponses[this.currentMultiDialogCursor].next()
        this.hasEnded = true
    }

    next(){
        if(!this.isQuestioning || !this.hasEnded){
            super.next();
            this.isQuestioning = this.currentDialogIndex() === this.multiDialogs[this.currentMultiDialogCursor].length-1;
            return;
        }

        this.end()

    }

    isDialogOver(){
        return this.hasEnded
    }
}

export default ConversationDialog