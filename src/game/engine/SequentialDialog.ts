import BaseDialog from "./BaseDialog"

class SequentialDialog extends BaseDialog {

    private nextKey:string 
    private endCallback: () => null
    
    hasEnded: boolean = false
    hasStarted: boolean = false

    constructor(
        dialogs: string[], 
        nextKey:string = 'Space',
        ) {
        super(dialogs)
        this.nextKey = nextKey
        this.endCallback = () => null
    }
    
    start(startIndex: number = 0){
        super.reset(startIndex)
        super.show()
        this.hasEnded = false
        this.hasStarted = true
        document.addEventListener('keypress', this.addEventListener.bind(this));   
    }

    end(runCallback = false){

        super.hide()
        this.hasStarted = false
        document.removeEventListener('keypress', this.addEventListener.bind(this))
        if(runCallback){
            this.endCallback()
        }
    }

    next(){
        super.next();
        this.hasEnded = this.currentDialogCursor === this.dialogs.length -1
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
            return this.hasEnded ? this.end(true) : this.next()
        }
    }

    protected isDialogOver(){
        return this.hasEnded
    }
}

export default SequentialDialog