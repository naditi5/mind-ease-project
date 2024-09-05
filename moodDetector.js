var slider = document.getElementById('moodSlider');
    var moodDisplay = document.getElementById('mood-display');
    var suggestions = document.getElementById('suggestions');
    var popup = document.getElementById('popup');

    var particlesConfig = {
      "particles": {
        "number": {
          "value": 100,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "shape": {
          "type": "image",
          "image": {
            "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ctext y='50%25' font-size='24' dy='.3em' text-anchor='middle' x='50%25'%3E😊%3C/text%3E%3C/svg%3E",
            "width": 50,
            "height": 50
          }
        },
        "size": {
          "value": 30,
          "random": true
        },
        "move": {
          "speed": 3, /* Default speed */
          "random": true,
          "straight": false,
          "out_mode": "out"
        }
      }
    };

    function updateParticlesConfig(emoji, speed) {
      particlesConfig.particles.shape.image.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Ctext y='50%25' font-size='24' dy='.3em' text-anchor='middle' x='50%25'%3E${emoji}%3C/text%3E%3C/svg%3E`;
      particlesConfig.particles.move.speed = speed;
      particlesJS("particles-js", particlesConfig);
    }

    function updateSlider() {
      var moodLevel = slider.value;
      var mood = '';
      var moodColor = '';
      var suggestionText = '';
      var emoji = '';
      var speed = 3;

      if (moodLevel >= 80) {
        mood = '😄 Happy';
        moodColor = '#00ff00';
        suggestionText = 'You can improve your knowledge regarding mental health using our resource library.';
        emoji = '😄';
        speed = 8; // Fast speed for very happy
      } else if (moodLevel >= 50) {
        mood = '😊 Good';
        moodColor = '#ffff00';
        suggestionText = 'Try our 30 days happiness challenge';
        emoji = '😊';
        speed = 6; // Moderate speed for happy
      } else if (moodLevel >= 20) {
        mood = '😐 Neutral';
        moodColor = '#ffcc00';
        suggestionText = 'Try our Mood Boosting Activities';
        emoji = '😐';
        speed = 4; // Slower speed for neutral
      } else {
        mood = '😔 Sad';
        moodColor = '#ff0000';
        suggestionText = 'Feel free to talk  to our personalized mental health assistant.';
        emoji = '😔';
        speed = 2; // Slow speed for sad
      }

      moodDisplay.textContent = 'Your current mood: ' + mood;
      moodDisplay.style.color = moodColor;
      suggestions.textContent = suggestionText;
      
      updateParticlesConfig(emoji, speed);
    }

    function redirect() {
      window.location.href = 'homePage.html'; // Redirect to homePage.html
    }

    slider.addEventListener('input', updateSlider);

    document.addEventListener('DOMContentLoaded', function() {
      updateParticlesConfig('😊', 6); // Initial particle setup
      updateSlider();
    });