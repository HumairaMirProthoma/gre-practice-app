fetch("data/prime_numbers.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("questions-wrapper");

    data.forEach((q, index) => {
      const card = document.createElement("div");
      card.classList.add("question-card");

      const questionHTML = `
        <p><strong>Q${index + 1}:</strong> ${q.question.replace(/\n/g, "<br>")}</p>
        <form class="options-form">
          ${q.options.map(option => {
            const inputType = q.type === "multiple" ? "checkbox" : "radio";
            return `
              <label>
                <input type="${inputType}" name="q${q.id}" value="${option}" />
                ${option}
              </label><br>
            `;
          }).join("")}
        </form>
        <button class="submit-btn">Submit Answer</button>
        <p class="feedback" style="margin-top: 0.5rem;"></p>
        <button class="solution-btn" style="display:none;">See Solution</button>
        <div class="solution-box" style="display:none;">${q.solution}</div>
      `;

      card.innerHTML = questionHTML;
      container.appendChild(card);

      const submitBtn = card.querySelector(".submit-btn");
      const solutionBtn = card.querySelector(".solution-btn");
      const feedback = card.querySelector(".feedback");
      const solutionBox = card.querySelector(".solution-box");
      const form = card.querySelector(".options-form");

      submitBtn.addEventListener("click", () => {
        let selected = [];
        const inputs = form.querySelectorAll("input:checked");
        inputs.forEach(input => selected.push(input.value));

        const correct = q.correctAnswer.sort().toString();
        const userAns = selected.sort().toString();

        if (userAns === correct) {
          feedback.textContent = "✅ Correct Answer";
          feedback.style.color = "#4CAF50";
        } else {
          feedback.textContent = "❌ Wrong Answer";
          feedback.style.color = "#FF6F61";
        }

        solutionBtn.style.display = "inline-block";
      });

      solutionBtn.addEventListener("click", () => {
        solutionBox.style.display = solutionBox.style.display === "block" ? "none" : "block";
      });
    });
  })
  .catch(err => console.error("Error loading questions:", err));
