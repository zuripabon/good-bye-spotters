import MultiDialog from "./MultiDialog"
import BaseDialog from "./BaseDialog"

class ConversationDialog extends MultiDialog {

    private isQuestioning: boolean = false
    private yesNoResponses: BaseDialog[] = []
    private nextKey:string 
    private yesKey:string 
    private noKey:string
    private endCallback: () => null
    
    hasEnded: boolean = false
    hasStarted: boolean = false

    constructor(
        dialogs: {dialog: string[], yesNo: string[]}[], 
        storageKey: string = '',
        nextKey:string = 'Space', 
        yesKey:string = 'KeyY', 
        noKey:string = 'KeyN',
        ) {
        super(dialogs.map(({dialog})=> dialog), 0, storageKey)
        this.nextKey = nextKey
        this.yesKey = yesKey 
        this.noKey = noKey
        this.endCallback = () => null
        this.yesNoResponses = dialogs.map(({yesNo}) => new BaseDialog(yesNo))  

    }
    
    start(){
        super.show()
        this.isQuestioning = this.currentDialogIndex() === this.multiDialogs[this.currentMultiDialogCursor].length-1;
        this.hasEnded = false
        this.hasStarted = true
        document.addEventListener('keypress', this.addEventListener.bind(this));   
    }

    end(runCallback = false){

        this.hasStarted = false
        super.hide()
        document.removeEventListener('keypress', this.addEventListener.bind(this))
        if(runCallback){
            this.endCallback()
        }
    }

    next(){
        if(!this.isQuestioning || !this.hasEnded){
            super.next();
            this.isQuestioning = this.currentDialogIndex() === this.multiDialogs[this.currentMultiDialogCursor].length-1;
            return;
        }

        this.end(true)
    }

    onEnd(fn: () => null){
        this.endCallback = fn
    }

    private addEventListener(e:KeyboardEvent){
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return
        }

        if(!this.hasStarted){
            return;
        }

        if(e.code === this.nextKey){
            return this.next()
        }
        if(e.code === this.yesKey){
            return this.yes()
        }
        
        if(e.code ===  this.noKey){
            return this.no()
        }
    }

    protected yes(){
        if(!this.isQuestioning || this.hasEnded){
            return;
        }
        this.yesNoResponses[this.currentMultiDialogCursor].show()
        this.hasEnded = true
    }

    protected no(){
        if(!this.isQuestioning || this.hasEnded){
            return;
        }
        this.yesNoResponses[this.currentMultiDialogCursor].next()
        this.hasEnded = true
    }

    protected isDialogOver(){
        return this.hasEnded
    }
}

export default ConversationDialog