import { NpcTypes } from './npc'

const hintInteractionPlay = (dialog:string) => `${dialog}<br><br><mark>[press space to continue]</mark>`
const hintInteractionTalk = (dialog:string) => `${dialog}<br><mark>[nod or type y/n]</mark>`

export const npcDialogs = {

    [NpcTypes.npc0]: [   
        { 
            dialog: [
                hintInteractionTalk('La vida loca')
            ],
            yesNo: [
                hintInteractionPlay('La vida loca'),
                hintInteractionPlay('La vida loca')
            ]
        }
    ],
    [NpcTypes.npc1]: [   
        { 
            dialog: [
                hintInteractionTalk('Do you have kids?')
            ],
            yesNo: [
                hintInteractionPlay('Enjoy this paternity leave'),
                hintInteractionPlay("Dont worry ... I'll enjoy the paternity leave for you ...")
            ]
        }
    ],

    [NpcTypes.npc2]: [   
        { 
            dialog: [
                hintInteractionTalk('Do you wanna join the ideation meeting?')
            ],
            yesNo: [
                hintInteractionPlay('I have prepared a special workshop for you'),
                hintInteractionPlay('I have prepared a special workshop for you')
            ]
        }
    ],

    [NpcTypes.npc3]: [   
        { 
            dialog: [
                hintInteractionTalk('Do you like GA4?')
            ],
            yesNo: [
                hintInteractionPlay("Let's change that"),
                hintInteractionPlay("Let's change that")
            ]
        }
    ],

    [NpcTypes.npc4]: [   
        { 
            dialog: [
                hintInteractionTalk('Have you ever build a microlito?')
            ],
            yesNo: [
                hintInteractionPlay('let me create a bc-francesco for you'),
                hintInteractionPlay('let me create a bc-francesco for you')
            ]
        }
    ],

    [NpcTypes.npc5]: [   
        { 
            dialog: [
                hintInteractionTalk("I'm executing the payments script...are you a mushroom !?")
            ],
            yesNo: [
                hintInteractionPlay('payments are like wild mushrooms. Eat this one!'),
                hintInteractionPlay('payments are like wild mushrooms. Eat this one!')
            ]
        }
    ], 
}

export const priestDialog = [   
    { 
        dialog: [
            hintInteractionPlay("Hello Spotter, I'm Francesco. Sure you have read I found a nice room and within minutes I was accepted ... <br>bullshit, all lies! I've been here for ages!..."),
            hintInteractionTalk("This place ... this place is where I live. A cool developer build this for me so I have at least a place to stay<br>Help me get my booking request accepted. Would you help me?")
        ],
        yesNo: [
            hintInteractionPlay("Maxi brutal. Take my booking request with you and bomb as many landlords as you can until it get accepted, please"),
            hintInteractionPlay("I guess you are a landlord ...")
        ]
    },
    {
        dialog: [
            hintInteractionTalk("Looks like you were rejected by the landlord ... would you help me again?")
        ],
        yesNo: [
            hintInteractionPlay("Do you see my face? I'm forced to smile the whole f***ng day but now I'm truly smiling"),
            hintInteractionPlay("will remember that when AI dominates the real state market...")
        ]
    },
    {
        dialog: [
            hintInteractionTalk("I heard in a grooming some devs are thinking on removing me<br> Ha!, poor guys, they dont know I'll remain in their git history forever ... <br> Oh you are still here, one more time?")
        ],
        yesNo: [
            hintInteractionPlay("ohh seem as you are now a engaged user"),
            hintInteractionPlay("I guess you need a business case to keep playing with me, ha!"),
        ]
    }
]


export const gameOverDialog= (killsPoints:string) => ([   
    { 
        dialog: [
            hintInteractionPlay("You were rejected by the landlord ..."),
            hintInteractionPlay(`you made a total balance of ${killsPoints}0$ which is not enought to pay landlord deposit`),
            hintInteractionTalk("Want to try it again?")
        ],
        yesNo: [
            hintInteractionPlay("Good luck"),
            hintInteractionPlay("Good luck")
        ]
    }
])

export const gameEndDialog = "<br>THANK YOU FOR GETTING SO FAR WITH ME AND FOR ALL THE TIME WE SHARED TOGETHER. GOOD AND DIFFICULT MOMENTS ALONG THE WAY.<br> I WISH YOU GOOD AND I WISH YOU BREAK THE LIMIT!<br>BOOKING CLOSED ;)<br>"

