
# Lab 3 — The Power of Sequencing

## Project Description

**The Order of Fate** is an interactive tarot-based visual novel inspired by the themes and visual style of *Neon Genesis Evangelion*.

The project explores how changing the order of three images can create different stories. Players select three tarot cards to represent the beginning, middle, and end of a narrative. Different sequences lead to different interpretations and endings.

## Features

### 1. Interactive Tarot Selection

- Three tarot cards: Wheel of Fortune, Strength, and Judgement.
- Cards begin face-down and flip over with an animation.
- Floating animations and glowing effects highlight the available cards.
- Players click the cards to determine their narrative order.
- Selected cards stop floating and lose their glow.

### 2. Upright and Reversed Cards

- Each selected card has a random chance of appearing upright or reversed.
- Reversed cards are displayed upside down.
- Card orientation changes the dialogue and interpretation.

### 3. Visual Novel Storytelling

- The story is divided into three chapters: Beginning, Middle, and End.
- Each chapter displays the selected tarot card with dialogue underneath.
- Players click the dialogue box to advance the story.
- The narrative features three fictional characters: SUBJECT-07, THE OPERATOR, and THE CHOIR.

### 4. Multiple Story Outcomes

- The three cards can be arranged into six different sequences.
- Each sequence has a different story title and summary.
- Upright and reversed orientations create additional variations.
- After the final chapter, the website displays a summary of the journey.

### 5. Restart System

- Players can restart the reading at any time.
- The ending screen automatically returns to the beginning after 15 seconds.
- Players can choose a different order to explore another interpretation.

## Technical Implementation

The website uses:

- **HTML:** Page structure, tarot cards, and dialogue interface.
- **CSS:** Card flipping, floating animations, glowing effects, transitions, and responsive layout.
- **JavaScript:** Variables, functions, event listeners, random card orientations, DOM manipulation, and story sequencing.

## How to Use

1. Open the website.
2. Select three tarot cards in the order of Beginning, Middle, and End.
3. Click through the dialogue to experience the story.
4. Read the final interpretation.
5. Restart to explore a different sequence.

## Credits

- Tarot card artwork: Evangelion Tarot Card series.
- Story: Original narrative inspired by *Neon Genesis Evangelion*.
- Website: Created for CCT360 Lab 3 — The Power of Sequencing.
