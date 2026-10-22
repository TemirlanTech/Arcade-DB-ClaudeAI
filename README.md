# Random Question — Arcade

An orange, arcade-style quiz website for students. Press **SPIN!**, watch the reel pick a random question, answer before the timer runs out, and finish with a personal certificate.

**Topic: Introduction to Databases**

## About the topic

The game checks the basic vocabulary every beginner needs when starting with databases. The 10 questions come from a crossword about the same topic and cover these terms:

| Term | Meaning |
|------|---------|
| **File** | Physical storage unit for database content |
| **Query** | A request for data from a database |
| **SQL** | Language used to manage relational databases |
| **Index** | Data structure that speeds up retrieval |
| **Table** | Collection of related data in rows and columns |
| **Field** | A single column (attribute) in a table |
| **Key** | Unique identifier for a record (primary key) |
| **Server** | Computer that hosts the database system |
| **DBMS** | Software suite that manages database operations |
| **Client** | Program that requests data from the server |

## How to play

1. Enter a **nickname** (2–14 characters). No login or password is needed.
2. Press **SPIN!** and the reel picks a random question.
3. Choose one of four answers (A–D) within **15 seconds**. The answer positions are shuffled every time.
4. Use a **lifeline** if you are stuck:
   - 💡 **Hint**: shows a text clue (−20 points)
   - ✂ **50/50**: removes two wrong answers (−40 points)
5. See ✅ CORRECT! or ❌ WRONG!, plus the right answer. Press **NEXT RANDOM QUESTION**.
6. After 10 questions you get your results and a **certificate**.

## Scoring

- Correct answer: **100 points**
- Speed bonus: up to **+50** (faster answer = more points)
- Streak bonus: **+20** for each extra correct answer in a row (up to +100)
- Lifelines reduce the points of that question (minimum 10 points for a correct answer)
- Wrong answer or time out: 0 points and the streak resets

## Results and certificate

At the end you see correct and wrong answers, points, accuracy, a congratulation message, and a rank:

| Accuracy | Rank |
|----------|------|
| 90% and above | Database Master |
| 70–89% | Query Hero |
| 50–69% | Table Explorer |
| below 50% | Rookie |

The certificate (PNG) shows the **nickname, game name, topic, rank, score, date and author**, and can be downloaded.

## Features

- Centered, responsive layout (desktop and phone), light and dark theme
- Slot-style spin animation, floating background bubbles, confetti, shake on wrong answers, 🔥 streak messages
- Sound effects with a mute button
- Nickname saved in the browser (no accounts, no server)
- Load your own question bank directly in the game

## Project files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `style.css` | Orange arcade theme |
| `questions.js` | Question bank (edit here) |
| `script.js` | Game logic: spin, timer, scoring, hints, certificate |

## Run locally

Unzip the project and double-click `index.html`. No installation or build step is needed. Optional: run `python3 -m http.server` in the folder and open http://localhost:8000.

## Customize

- **Author name:** change `CFG.author` at the top of `script.js` (shown in the footer and on the certificate).
- **Topic label:** change the `topic` value at the top of `script.js`.
- **Questions:** edit `questions.js`. Use 5 lines per question: question, **correct answer first**, then 3 wrong answers. Add an optional 6th line `Hint: your hint`.

  ```
  What is a request for data from a database called?
  Query
  Index
  Table
  Key
  Hint: You write one when you ask the database a question.
  ```
- **Timer and length:** `T` (seconds per question, default 15) and `N` (questions per game, default 10) in `script.js`.

You can also paste a question bank into the **Load your full question bank** panel under the game.

## Notes

- Fonts (Bungee, Nunito) load from Google Fonts when online; offline, system fonts are used.
- Nicknames and scores are stored only in the player's own browser, so there is no shared leaderboard.
- In the hosted web version, save the certificate with right-click or a screenshot. The download button works in the local version.
