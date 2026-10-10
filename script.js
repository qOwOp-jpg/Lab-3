
'use strict';

const POSITION_LABELS = ['BEGINNING', 'MIDDLE', 'END'];

const POSITION_HELP = [
  'Choose the card that begins the journey.',
  'Choose the card that becomes the turning point.',
  'Choose the card that completes the journey.'
];

const CARD_LABELS = {
  wheel: 'SIGNAL X',
  strength: 'SIGNAL VIII',
  judgement: 'SIGNAL XX'
};

const CARDS = {
  wheel: {
    title: 'WHEEL OF FORTUNE',
    image: 'assets/wheel.jpg',

    upright: [
      [
        'THE OPERATOR',
        'At 03:17, the station clocks began moving forward. All of them. Even the broken ones.'
      ],
      [
        'SUBJECT-07',
        'Then the cycle moved before anyone gave the order. Fate acted first.'
      ],
      [
        'THE CHOIR',
        'A turning wheel does not ask permission. It only asks what you will become when it moves.'
      ]
    ],

    reversed: [
      [
        'THE OPERATOR',
        'At 03:17, the station clocks stopped. This is the ninth report of the same minute.'
      ],
      [
        'SUBJECT-07',
        'So the beginning was already a loop. I was walking back into a wound.'
      ],
      [
        'THE CHOIR',
        'You call it destiny because repetition is easier to survive than freedom.'
      ]
    ]
  },

  strength: {
    title: 'STRENGTH',
    image: 'assets/strength.jpg',

    upright: [
      [
        'SUBJECT-07',
        'The voices push against the walls of my mind, but I can still hear my own pulse beneath them.'
      ],
      [
        'THE OPERATOR',
        'Do not conquer the fear. Hold it. Name it. Make it stop ruling the room.'
      ],
      [
        'SUBJECT-07',
        'Then strength is not violence. It is staying whole while everything asks me to break.'
      ]
    ],

    reversed: [
      [
        'SUBJECT-07',
        'I held the door shut until my hands forgot their shape. I do not know how much of me is left.'
      ],
      [
        'THE OPERATOR',
        'Exhaustion is not failure, SUBJECT-07. It is what remains when fear has been working alone.'
      ],
      [
        'THE CHOIR',
        'Rest, little signal. If you cannot bear yourself any longer, we can bear you for you.'
      ]
    ]
  },

  judgement: {
    title: 'JUDGEMENT',
    image: 'assets/judgement.jpg',

    upright: [
      [
        'THE CHOIR',
        'All sealed memories are open. Every hidden name has entered the chamber.'
      ],
      [
        'SUBJECT-07',
        'Then the truth was waiting for me at the end of the corridor the whole time.'
      ],
      [
        'THE OPERATOR',
        'A revelation is not a punishment. It is the moment a false life can no longer continue.'
      ]
    ],

    reversed: [
      [
        'THE OPERATOR',
        'The final archive is ready. It contains your authorization code and the record you refused to hear.'
      ],
      [
        'SUBJECT-07',
        'If I never listen to it, perhaps the ending stays unwritten.'
      ],
      [
        'THE CHOIR',
        'Silence does not erase a reckoning. It only teaches it to wait.'
      ]
    ]
  }
};


const SEQUENCE_STORIES = {
  'wheel-strength-judgement': {
    title: 'THE TRIAL OF CHANGE',
    summary:
      'The story begins when fate strikes without warning. In the middle, SUBJECT-07 learns to endure the pressure rather than flee it. At the end, the chamber opens and truth demands an answer.'
  },

  'wheel-judgement-strength': {
    title: 'THE CALL AFTER CHAOS',
    summary:
      'The story begins in sudden upheaval. That chaos exposes a buried truth, and the final chapter becomes a struggle to survive what has been revealed.'
  },

  'strength-wheel-judgement': {
    title: 'THE TESTED HEART',
    summary:
      'The story begins with restraint and inner effort. Then fate interrupts the fragile balance, forcing the journey toward a final reckoning.'
  },

  'strength-judgement-wheel': {
    title: 'THE SOUL THAT ENDURED',
    summary:
      'The story begins with survival. In the middle, the truth arrives and reshapes what survival means. At the end, the wheel turns and a new cycle begins from what was learned.'
  },

  'judgement-wheel-strength': {
    title: 'AWAKENED INTO THE STORM',
    summary:
      'The story begins with a revelation that cannot be taken back. That truth sets fate into motion, and the ending becomes a test of whether the self can remain intact.'
  },

  'judgement-strength-wheel': {
    title: 'AFTER THE AWAKENING',
    summary:
      'The story begins with the truth. In the middle, SUBJECT-07 struggles to carry it without collapsing. At the end, destiny moves again and offers a changed future.'
  }
};

const $ = (selector) => document.querySelector(selector);

const choices = [...document.querySelectorAll('.choice')];

const scenes = {
  select: $('#selectionScene'),
  read: $('#readingScene'),
  end: $('#endingScene')
};

let chosen = [];
let chapter = 0;
let line = 0;
let activeLines = [];
let returnTimer = null;
let transitionTimer = null;
let locked = false;


function showScene(name) {
  Object.entries(scenes).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
}


function orientation() {
  return Math.random() < 0.5 ? 'upright' : 'reversed';
}


function updateSlots() {
  $('#trackerSlots').innerHTML = POSITION_LABELS.map((label, i) => {
    const entry = chosen[i];

    return `
      <div class="slot ${entry ? 'filled' : ''}">
        <strong>${label}</strong>
        <span>
          ${
            entry
              ? `${CARD_LABELS[entry.id]} / ${entry.facing.toUpperCase()}`
              : '—'
          }
        </span>
      </div>
    `;
  }).join('');
}


function selectionInstruction() {
  if (chosen.length === 0) {
    return 'Choose a card for the <strong>Beginning</strong>.';
  }

  if (chosen.length === 1) {
    return 'Beginning chosen. Now choose the <strong>Middle</strong>.';
  }

  if (chosen.length === 2) {
    return 'Middle chosen. Now choose the <strong>End</strong>.';
  }

  return 'Sequence established. The reading will begin now…';
}


function selectCard(event) {
  if (locked) return;

  const button = event.currentTarget;
  const id = button.dataset.card;

  if (chosen.some(item => item.id === id)) return;

  const facing = orientation();

  chosen.push({
    id,
    facing
  });

  button.classList.add('picked');
  button.disabled = true;
  button.classList.toggle('reversed', facing === 'reversed');

  updateSlots();

  $('#instruction').innerHTML = selectionInstruction();

  if (chosen.length < 3) return;

  locked = true;

  transitionTimer = setTimeout(() => {
    locked = false;
    startChapter(0);
  }, 650);
}

function contextualOpening(position, entry) {
  return null;
}


function startChapter(index) {
  chapter = index;
  line = 0;

  const entry = chosen[index];
  const data = CARDS[entry.id];

  activeLines = [...data[entry.facing]];

  $('#chapterNumber').textContent =
    `${POSITION_LABELS[index]} // ${String(index + 1).padStart(2, '0')} OF 03`;

  $('#orientationBadge').textContent =
    entry.facing.toUpperCase();

  $('#readingTitle').textContent = data.title;

  $('#readingImage').src = data.image;

  $('#readingImage').alt =
    `${data.title} tarot card, ${entry.facing}`;

  const card = $('#readingCard');

  card.classList.remove('reversed', 'animate');

  void card.offsetWidth;

  if (entry.facing === 'reversed') {
    card.classList.add('reversed');
  }

  card.classList.add('animate');

  showScene('read');
  displayLine();
}


function displayLine() {
  const [speaker, text] = activeLines[line];

  $('#speaker').textContent = speaker;
  $('#dialogueText').textContent = text;

  $('#lineCount').textContent =
    `${String(line + 1).padStart(2, '0')} / ${String(activeLines.length).padStart(2, '0')}`;

  if (line === activeLines.length - 1) {
    $('.continue-label').textContent =
      chapter === 2 ? 'SHOW ENDING ▸' : 'NEXT CHAPTER ▸';
  } else {
    $('.continue-label').textContent =
      'CLICK TO CONTINUE ▸';
  }
}


function advance() {
  if (!scenes.read.classList.contains('active') || locked) {
    return;
  }

  if (line + 1 < activeLines.length) {
    line++;
    displayLine();
    return;
  }

  if (chapter < 2) {
    startChapter(chapter + 1);
    return;
  }

  showEnding();
}


function finalBeat(entry) {
  const beats = {
    wheel: {
      upright:
        'The cycle opens instead of closes. The end is not peace, but motion toward a different future.',

      reversed:
        'The cycle folds back on itself. The end resembles a warning caught in a loop.'
    },

    strength: {
      upright:
        'The ending belongs to the self that remained intact. Individual pain remains, but so does identity.',

      reversed:
        'The ending is fragile. What remains of the self survives only in fragments and hesitation.'
    },

    judgement: {
      upright:
        'The ending arrives as revelation. Nothing can continue unchanged once the truth is finally heard.',

      reversed:
        'The ending refuses closure. The truth is present, but the will to accept it has not arrived.'
    }
  };

  return beats[entry.id][entry.facing];
}


function showEnding() {
  const sequenceKey = chosen.map(entry => entry.id).join('-');

  const story = SEQUENCE_STORIES[sequenceKey];

  const reversedCount = chosen.filter(
    c => c.facing === 'reversed'
  ).length;

  const moodMap = [
    'All three signals were upright. This reading points toward painful clarity, but also the possibility of genuine change.',

    'One signal was reversed. The journey still moves forward, though one wound continues to distort the meaning of the whole.',

    'Two signals were reversed. The story resists resolution, and the path ahead remains unstable.',

    'All three signals were reversed. The chamber closes on ambiguity, repetition, and the fear of becoming no one at all.'
  ];

  $('#endingTitle').textContent = story.title;

  $('#endingCards').innerHTML = chosen.map((item, index) => `
    <div class="ending-card ${
      item.facing === 'reversed' ? 'reversed' : ''
    }">
      <img
        src="${CARDS[item.id].image}"
        alt="${CARDS[item.id].title}, ${item.facing}"
      >
      <span class="ending-order">
        ${POSITION_LABELS[index]}
      </span>
    </div>
  `).join('');

  $('#endingText').textContent =
    `${story.summary} ${finalBeat(chosen[2])}`;

  $('#closingLine').textContent = moodMap[reversedCount];

  showScene('end');

  let remaining = 15;

  $('#countdown').textContent =
    `Returning to the observation chamber in ${remaining} seconds.`;

  clearInterval(returnTimer);

  returnTimer = setInterval(() => {
    remaining--;

    if (remaining <= 0) {
      reset();
      return;
    }

    $('#countdown').textContent =
      `Returning to the observation chamber in ${remaining} seconds.`;
  }, 1000);
}


function reset() {
  clearInterval(returnTimer);
  clearTimeout(transitionTimer);

  returnTimer = null;
  chosen = [];
  chapter = 0;
  line = 0;
  locked = false;

  choices.forEach((button) => {
    button.disabled = false;
    button.classList.remove('picked', 'revealed', 'reversed');
  });

  updateSlots();

  $('#instruction').innerHTML =
    'Choose a card for the <strong>Beginning</strong>, then the <strong>Middle</strong>, then the <strong>End</strong>.';

  showScene('select');

  revealChoices();
}


function revealChoices() {
  choices.forEach((button, index) => {
    setTimeout(() => {
      if (scenes.select.classList.contains('active')) {
        button.classList.add('revealed');
      }
    }, 350 + index * 280);
  });
}


choices.forEach(button => {
  button.addEventListener('click', selectCard);
});

$('#dialogueBox').addEventListener('click', advance);

$('#restartButton').addEventListener('click', reset);

$('#restartDuring').addEventListener('click', reset);


document.addEventListener('keydown', event => {
  if (
    (event.key === 'Enter' || event.key === ' ') &&
    scenes.read.classList.contains('active') &&
    document.activeElement !== $('#restartDuring')
  ) {
    if (
      document.activeElement === document.body ||
      document.activeElement === $('#dialogueBox')
    ) {
      event.preventDefault();
      advance();
    }
  }
});


updateSlots();
revealChoices();
