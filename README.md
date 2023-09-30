# battle-ship
An Odin Assignment: Practice writing tests with Jest by creating the classic game of Battle Ship

## Link
[https://nummnuttzcdxx.github.io/battle-ship/](https://nummnuttzcdxx.github.io/battle-ship/)

# How to play
1. Select number of players and optionally give your name
2. Place your ships on the board by dragging and dropping the ships into the cell you want
	- Alternatively you can click a ship to `select` it and then click a cell to place it
	- Rotate them by pushing the `Rotate` button
3. Once all ships are placed, the game will start and Player 1 can click an enemy cell to attack there
	- A red X will appear if its a miss, or the whole square will turn red for a hit, also message should display telling
	you what happened
4. Take turns attacking until all of one players ships are sunk

# Features
- Single-player against a "human like" bot, or multi-player against a friend
	- Ft: a transition screen between turns to hide the players ships
- Mobile compatability
- Drag & Drop ships
- Restart button

What else can a classic Battle Ship game really have?

# Challenges
In the making of this project I came across many challenges, one after the other. I would solve one and then the next one would appear. One of my most annoying challenges with this project (and pretty much all of my other projects) was figuring out how I wanted to do things. Not literally, "How do I make a game?", but more like how should I implement this, or how do I want to lay out the page? How should I change it for mobile? Things like that as I dont feel I am very creative when it comes to UI or the design side of things. Some other challenges/bugs I struggled with include:
- Making the AI think as a human would, without cheating
- Correcting the Ship placement if User placed the ship off the board
	- Which it seems, from what I seen of others submissions, that others just made it impossible alltogether to place a ship off the board by making the cells un-clickable if it would be off the board, whereas I made it if a ship is placed partly off the board it corects itself and places where the Ship SHOULD have been
- Reconfiguring my UI for smaller screens in a way I was happy with and so I wouldnt have to redo all the work I already did
- Also coming up with an alternate method of ship placement for mobile, since Drag & Drop does not work on touch screens
- Sometimes the ships image would be placed overlapping another and I couldnt figure out why
- Along with plenty of other oddly specific situations where something unexpected would occur and I didnt know why

## Skills learned
- Despite not having many Jest tests written, I did get some practice writing tests and how the workflow should be
- Better understanding and implementation of Object Oriented Programming
- How drag & drop works
- Better understanding of how game development works in Javascript
- Why one would need/use Babbel
- More proficient in mobile/smaller screen layouts & compatability
- More proficient with more advanced `git` commands like `rebase` and squashing/editting commits

### Notes
Admittedly, I didnt do much testing with Jest as I was supposed to. I had a hard time mocking/testing functions that included DOM manipulation as
a lot of my functions that needed to be tested manipulated the DOM in some way or another. So unfortunately, I failed my assignment, successfully.
In the end, I made a functional Battle Ship game, that I'm proud of and took me a long time, but my assignment was to use Jest for testing, which very few tests were done with Jest, since I couldnt figure out how to mock the DOM functions.
