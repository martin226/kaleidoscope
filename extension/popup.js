const ironyThreshold = 0.625;
const emotionThreshold = 0.201;
const minSelectionLength = 50;

window.addEventListener('message', (event) => {
  if (event.source === window.parent) {
    document.getElementById('selection').textContent = event.data;
    fetch('http://localhost:5000/predict/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: event.data }),
    }).then((response) =>
      response.json().then((data) => {
        console.log(data);
        const ironyPrediction = data.irony;
        if (
          ironyPrediction[1]['score'] >= ironyThreshold &&
          event.data.length >= minSelectionLength
        ) {
          document.getElementById('ironyAlert').style.display = 'block';
          document.getElementById('ironyConfidence').textContent = (
            ironyPrediction[1]['score'] * 100
          ).toFixed(2);
        }
        const emotionPrediction = data.emotion;
        const emotions = document.getElementById('emotions');

        for (let i = 0; i < emotionPrediction.length; i++) {
          const emotion = emotionPrediction[i];
          const confidence = (emotion['score'] * 100).toFixed(2);
          if (emotion['score'] < emotionThreshold && i !== 0) {
            emotions.innerHTML += `<div class="emotion-indicator emotion-indicator-uncertain hidden"><div class="emotion-indicator-label">${emotion['label']} <span class="emotion-indicator-confidence">${confidence}% confidence</span></div><div class="emotion-indicator-bar-outer"><div class="emotion-indicator-bar-inner" style="width: ${confidence}%"></div></div></div>`;
          } else {
            emotions.innerHTML += `<div class="emotion-indicator"><div class="emotion-indicator-label">${emotion['label']} <span class="emotion-indicator-confidence">${confidence}% confidence</span></div><div class="emotion-indicator-bar-outer"><div class="emotion-indicator-bar-inner" style="width: ${confidence}%"></div></div></div>`;
          }
        }
      })
    );
  }
});

window.parent.postMessage('GET-SELECTION', '*');

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', () => {
  window.parent.postMessage('CLOSE-SIDEBAR', '*');
});

const showAllEmotionsBtn = document.getElementById('showAllEmotionsBtn');
const hideUncertainEmotionsBtn = document.getElementById('hideUncertainEmotionsBtn');
showAllEmotionsBtn.addEventListener('click', () => {
  const uncertainIndicators = document.querySelectorAll('.emotion-indicator-uncertain');
  for (let i = 0; i < uncertainIndicators.length; i++) {
    uncertainIndicators[i].classList.remove('hidden');
  }
  showAllEmotionsBtn.style.display = 'none';
  hideUncertainEmotionsBtn.style.display = 'block';
});

hideUncertainEmotionsBtn.addEventListener('click', () => {
  const uncertainIndicators = document.querySelectorAll('.emotion-indicator-uncertain');
  for (let i = 0; i < uncertainIndicators.length; i++) {
    uncertainIndicators[i].classList.add('hidden');
  }
  showAllEmotionsBtn.style.display = 'block';
  hideUncertainEmotionsBtn.style.display = 'none';
});
