const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');
document.getElementById('topicTitle').textContent = topic.replace(/_/g, ' ').toUpperCase();

const localKey = `verbal-${topic}-answers`;
let storedAnswers = JSON.parse(localStorage.getItem(localKey)) || {};

fetch(`data/verbal/${topic}.json`)
  .then(res => res.json())
  .then(data => renderQuestions(data))
  .catch(err => {
    document.getElementById('questionsContainer').innerHTML = "<p>Questions could not be loaded.</p>";
  });

function renderQuestions(questions) {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.id = `card-${q.id}`;

    const stored = storedAnswers[q.id];

    const formInputs = q.options.map(opt => {
      const inputType = (q.type === 'single' || q.type === 'comparison-single') ? 'radio' : 'checkbox';
      const checked = stored?.selected?.includes(opt) ? 'checked' : '';
      return `<label><input type="${inputType}" name="q${q.id}" value="${opt}" ${checked}/> ${opt}</label><br>`;
    }).join('');

    const isComparison = q.type.includes('comparison');
    const comparisonHTML = isComparison ? `
      <div class="comparison-container">
        <div class="comparison-box"><strong>Quantity A</strong><br>${q.quantityA || ''}</div>
        <div class="comparison-box"><strong>Quantity B</strong><br>${q.quantityB || ''}</div>
      </div>` : '';

    const feedbackText = stored?.result ? (stored.result ? "✅ Correct" : "❌ Wrong") : "";
    const showSolution = stored?.result ? "block" : "none";

    card.innerHTML = `
      ${comparisonHTML}
      <p><strong>Q${index + 1}:</strong> ${q.question}</p>
      <form>${formInputs}</form>
      <button onclick='submitAnswer(this, ${JSON.stringify(q).replace(/'/g, "&apos;")})' class='solution-btn'>Submit Answer</button>
      <p class="feedback">${feedbackText}</p>
      <button class='solution-btn' onclick='this.nextElementSibling.style.display="block"' style='display:${showSolution}'>See Solution</button>
      <div class='solution-box' style='display:${showSolution}'>${q.solution}</div>
    `;
    container.appendChild(card);
  });
}

function submitAnswer(button, q) {
  const form = button.previousElementSibling;
  const inputs = [...form.querySelectorAll('input')];
  const selected = inputs.filter(i => i.checked).map(i => i.value);
  const correct = Array.isArray(q.correctAnswer)
    ? JSON.stringify(selected.sort()) === JSON.stringify(q.correctAnswer.sort())
    : selected[0] === q.correctAnswer;

  const card = button.closest('.glass-card');
  card.querySelector('.feedback').textContent = correct ? "✅ Correct" : "❌ Wrong";
  card.querySelector('.solution-box').style.display = "block";
  card.querySelector('.solution-btn + .solution-box').style.display = "block";

  storedAnswers[q.id] = { selected, result: correct };
  localStorage.setItem(localKey, JSON.stringify(storedAnswers));
}

document.getElementById("resetButton").addEventListener("click", () => {
  localStorage.removeItem(localKey);
  location.reload();
});
