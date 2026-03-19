const vocabulary = [
  { amoluk: 'Kulo', english: 'Hello' },
  { amoluk: 'Sena', english: 'Thank you' },
  { amoluk: 'Mira', english: 'Water' },
  { amoluk: 'Tavo', english: 'Food' },
  { amoluk: 'Lunari', english: 'Family' },
  { amoluk: 'Peku', english: 'Friend' },
];

const prompts = [
  {
    question: 'Nami tora?',
    options: ['Where are you going?', 'How old are you?', 'What is your name?'],
    answer: 'What is your name?',
  },
  {
    question: 'Sena kulo.',
    options: ['Good night.', 'Thank you, hello.', 'I am learning.'],
    answer: 'Thank you, hello.',
  },
  {
    question: 'Mira tavo.',
    options: ['Water and food.', 'My family.', 'See you tomorrow.'],
    answer: 'Water and food.',
  },
];

const state = {
  wordIndex: 0,
  quizIndex: 0,
  flashcardSteps: 0,
  quizCorrect: 0,
  streakMarked: false,
};

const wordNative = document.getElementById('word-native');
const wordEnglish = document.getElementById('word-english');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const progressValue = document.getElementById('progress-value');
const progressRing = document.querySelector('.progress-ring');
const flashcardTask = document.getElementById('task-flashcards');
const quizTask = document.getElementById('task-quiz');
const streakTask = document.getElementById('task-streak');

function renderFlashcard() {
  const word = vocabulary[state.wordIndex];
  wordNative.textContent = word.amoluk;
  wordEnglish.textContent = word.english;
}

function renderQuiz() {
  const prompt = prompts[state.quizIndex];
  quizQuestion.textContent = prompt.question;
  quizOptions.innerHTML = '';

  prompt.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(button, option));
    quizOptions.appendChild(button);
  });
}

function updateProgress() {
  const goals = [state.flashcardSteps >= 5, state.quizCorrect >= 3, state.streakMarked];
  const completedGoals = goals.filter(Boolean).length;
  const percent = Math.round((completedGoals / goals.length) * 100);

  progressValue.textContent = `${percent}%`;
  progressRing.style.setProperty('--progress', percent);
  flashcardTask.classList.toggle('done', goals[0]);
  quizTask.classList.toggle('done', goals[1]);
  streakTask.classList.toggle('done', goals[2]);
}

function handleAnswer(button, option) {
  const prompt = prompts[state.quizIndex];
  const buttons = [...quizOptions.querySelectorAll('button')];
  buttons.forEach((item) => (item.disabled = true));

  if (option === prompt.answer) {
    button.classList.add('correct');
    quizFeedback.textContent = 'Correct! Great job.';
    state.quizCorrect += 1;
  } else {
    button.classList.add('incorrect');
    const correctButton = buttons.find((item) => item.textContent === prompt.answer);
    if (correctButton) {
      correctButton.classList.add('correct');
    }
    quizFeedback.textContent = `Almost — correct answer: ${prompt.answer}`;
  }

  state.quizIndex = (state.quizIndex + 1) % prompts.length;
  state.streakMarked = true;
  updateProgress();

  setTimeout(() => {
    renderQuiz();
    quizFeedback.textContent = 'Choose an answer to continue.';
  }, 900);
}

function moveWord(direction) {
  state.wordIndex = (state.wordIndex + direction + vocabulary.length) % vocabulary.length;
  state.flashcardSteps += 1;
  renderFlashcard();
  updateProgress();
}

document.getElementById('prev-word').addEventListener('click', () => moveWord(-1));
document.getElementById('next-word').addEventListener('click', () => moveWord(1));
document.getElementById('reset-progress').addEventListener('click', () => {
  state.wordIndex = 0;
  state.quizIndex = 0;
  state.flashcardSteps = 0;
  state.quizCorrect = 0;
  state.streakMarked = false;
  renderFlashcard();
  renderQuiz();
  quizFeedback.textContent = 'Choose an answer to continue.';
  updateProgress();
});

renderFlashcard();
renderQuiz();
updateProgress();
