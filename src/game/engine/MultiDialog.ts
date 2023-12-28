import BaseDialog from "./BaseDialog"

const LOCAL_STORAGE_KEY = 'dialog'

const fetchDialogIndex = (startIndex:number, maxIndex:number, storageKey:string):number => {
    try {
        const localStorageIndex = parseInt(localStorage.getItem(storageKey) || "0", 10)
        return localStorageIndex > maxIndex ? maxIndex : localStorageIndex 
    }
    catch(error){
        return startIndex
    }
}

class MultiDialog extends BaseDialog {

    protected multiDialogs: string[][] = []
    protected currentMultiDialogCursor: number = 0
    protected localStorageKey: string

    constructor(dialogs: string[][], startIndex:number = 0, localStorageKey:string = '') {
        const storageKey = localStorageKey || LOCAL_STORAGE_KEY
        const currentMultiDialogCursor = fetchDialogIndex(startIndex, dialogs.length - 1, storageKey)
        const currentDialogs = dialogs[currentMultiDialogCursor]
        super(currentDialogs)
        this.multiDialogs = dialogs
        this.currentMultiDialogCursor = currentMultiDialogCursor
        this.localStorageKey = storageKey
    }

    show(): void {
        super.show()
        const currentDialogCursor = this.currentDialogIndex()
        if(currentDialogCursor >= this.multiDialogs[this.currentMultiDialogCursor].length-1) {
            let nextMultiDialogIndex = this.currentMultiDialogCursor + 1
            if(nextMultiDialogIndex > this.multiDialogs.length-1){
                nextMultiDialogIndex = this.multiDialogs.length-1
            }
            localStorage.setItem(this.localStorageKey, String(nextMultiDialogIndex))
        }
    }

}

export default MultiDialog