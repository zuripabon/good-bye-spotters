import SequentialDialog from "./SequentialDialog"

const LOCAL_STORAGE_KEY = 'dialog'

const fetchDialogIndex = (startIndex:number, maxIndex:number):number => {
    try {
        const localStorageIndex = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || "0", 10)
        return localStorageIndex > maxIndex ? maxIndex : localStorageIndex 
    }
    catch(error){
        return startIndex
    }
}

class MultiDialog extends SequentialDialog {

    protected multiDialogs: string[][] = []
    protected currentMultiDialogCursor: number = 0

    constructor(dialogs: string[][], startIndex:number = 0) {
        const currentMultiDialogCursor = fetchDialogIndex(startIndex, dialogs.length - 1)
        const currentDialogs = dialogs[currentMultiDialogCursor]
        super(currentDialogs)
        this.multiDialogs = dialogs
        this.currentMultiDialogCursor = currentMultiDialogCursor
    }

    show(): void {
        super.show()
        const currentDialogCursor = this.currentDialogIndex()
        if(currentDialogCursor >= this.multiDialogs[this.currentMultiDialogCursor].length-1) {
            let nextMultiDialogIndex = this.currentMultiDialogCursor + 1
            if(nextMultiDialogIndex > this.multiDialogs.length-1){
                nextMultiDialogIndex = this.multiDialogs.length-1
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, String(nextMultiDialogIndex))
        }
    }

}

export default MultiDialog