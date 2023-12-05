const hintInteractionPlay = (dialog:string) => `${dialog}<br><br><mark>[press space to continue]</mark>`
const hintInteractionTalk = (dialog:string) => `${dialog}<br><mark>[nod or type y/n]</mark>`

export const npcDialogs = [
    [   
        hintInteractionTalk('La vida loca'),
        "La vida loca",
        "La vida loca",
        2 /*RESOUT_YES*/
    ],
    [   
        hintInteractionTalk('Do you have kids?'),
        "Enjoy this paternity leave",
        "Dont worry ... I'll enjoy the paternity leave for you ...",
        2 /*RESOUT_BOTH*/
    ],
    [   
        hintInteractionTalk('Do you wanna join the ideation meeting?'),
        "I have prepared a special workshop for you",
        "I have prepared a special workshop for you",
        2 /*RESOUT_BOTH*/
    ],
    [   
        hintInteractionTalk('Do you like GA4?'),
        "Let's change that",
        "Let's change that",
        2 /*RESOUT_TURN_NO*/
    ],
    [   
        hintInteractionTalk('Have you ever build a microlito?'),
        "let me create a bc-francesco for you",
        "let me create a bc-francesco for you",
        2 /*RESOUT_TURN_YES*/
    ],
    [   
        hintInteractionTalk("I'm executing the payments script...are you a mushroom !?"),
        "payments are like wild mushrooms. Eat this one!",
        "payments are like wild mushrooms. Eat this one!",
        2 /*RESOUT_TURN_YES*/
    ]
]

export const francescoDialog = [
    [   
        hintInteractionTalk("Hello Spotter, I'm Francesco. Sure you have read I found a nice room and within minutes I was accepted ... <br>bullshit, all lies! I've been here for ages!...<br><br>This place ... this place is where I live. A cool developer build this for me so I have at least a place to stay<br>Help me get my booking request accepted. Would you help me?"),
        hintInteractionPlay("Maxi brutal. Take my booking request with you and bomb as many landlords as you can until it get accepted, please"),
        hintInteractionPlay("I guess you are a landlord ..."),
        0 /*RESOUT_PRIEST*/
    ],
    [   
        hintInteractionTalk("Looks like you were rejected by the landlord ... would you help me again?"),
        hintInteractionPlay("Do you see my face? I'm forced to smile the whole f***ng day but now I'm truly smiling"),
        hintInteractionPlay("will remember that when AI dominates the real state market..."),
        0 /*RESOUT_PRIEST*/
    ],
    [   
        hintInteractionTalk("I heard in a grooming some devs are thinking on removing me<br> Ha!, poor guys, they dont know I'll remain in their git history forever ... <br> Oh you are still here, one more time?"),
        hintInteractionPlay("ohh seem as you are now a engaged user"),
        hintInteractionPlay("I guess you need a business case to keep playing with me, ha!"),
        0 /*RESOUT_PRIEST*/
    ],
]

export const gameEndDialog = "<br>THANK YOU FOR GETTING SO FAR WITH ME AND FOR ALL THE TIME WE SHARED TOGETHER. GOOD AND DIFFICULT MOMENTS ALONG THE WAY.<br> I WISH YOU GOOD AND I WISH YOU BREAK THE LIMIT!<br>BOOKING CLOSED ;)<br>"

export const gameOverDialog = hintInteractionPlay("YOUR BOOKING REQUEST WAS REJECTED BY THE LANDLORD")
