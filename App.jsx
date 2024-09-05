import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const apiKey = 'AIzaSyDWT0JCvaYzCrvdtwUnfdFDVirVG5bM1i0';
const modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

const MIN_RESPONSE_WORDS = 200; // Minimum number of words in the response
const MAX_RESPONSE_WORDS = 300;

// List of mental health-related keywords
const mentalHealthKeywords = [
  'stress', 'anxiety', 'depression', 'mental health', 'well-being', 'therapy', 'counseling', 
  'mindfulness', 'self-care', 'emotional health', 'support', 'worst', 'care', 'psychology', 
  'mind', 'cry', 'bad', 'good', 'life', 'worry', 'nurture', 'ease', 'peace', 'harmony', 
  'natural', 'prevention', 'methods', 'positive', 'reduce', 'recover', 'gain', 'strength', 
  'achieve', 'good', 'easy', 'bored', 'activity', 'joke', 'funny', 'optimistic', 
  'Psychological health', 'comedy', 'mood boosting', 'mood', 'mind', 'vandering', 
  'relief', 'help', 'secrets', 'health', 'face', 'facing', 'issues', 'issue','working','project','sad','tired','feeling','day','wish','college','school','collegues','friends','my','task','teacher', 'family', 'home', 'sleep', 'diet', 'exercise', 
  'routine', 'balance', 'pressure', 'challenge', 'motivation', 'goal', 'success', 'failure', 
  'hope', 'fear', 'lonely', 'isolation', 'community', 'interaction', 'growth', 'learning', 
  'focus', 'meditation', 'relaxation', 'breathing', 'habits', 'lifestyle', 'environment', 
  'adapt', 'change', 'adjust', 'support system', 'network', 'resources', 'tools', 'techniques', 
  'strategies', 'approach', 'attitude', 'perspective', 'mindset', 'optimism', 'positivity', 
  'resilience', 'grateful', 'gratitude', 'content', 'joy', 'happiness', 'satisfaction', 
  'accomplishment', 'achievement', 'progress', 'improvement', 'growth mindset', 'self-esteem', 
  'confidence', 'self-worth', 'value', 'respect', 'dignity', 'compassion', 'empathy', 
  'understanding', 'communication', 'expression', 'feelings', 'emotions', 'thoughts', 'beliefs','hi',
  'hello','bye','daily','activity','task','feel','engage','relax','peace','buster'
];
// List of sports-related keywords
const sportsKeywords = [
  'sports', 'soccer', 'football', 'basketball', 'baseball', 'tennis', 'cricket', 
  'hockey', 'golf', 'volleyball', 'rugby','Athletics','Badminton' ,'Boxing','Cycling',
  'Diving','Fencing','Figure skating','Gymnastics','Handball','Judo','Karate','Lacrosse',
  'MMA','Motorsport','Rowing','Sailing','Skateboarding','Skiing','Snowboarding','Squash',
  'Surfing','Swimming','Table tennis','Track and field', 'Triathlon','Water polo','Weightlifting','Wrestling'
];
// List of nature-related keywords
const natureKeywords = [
  'nature', 'forest', 'trees', 'park', 'garden', 'hiking', 'mountains', 'river', 'beach', 
  'outdoor', 'wildlife', 'flowers', 'plants', 'natural', 'environment', 'greenery'
];
// List of suicide/death-related keywords
const suicideKeywords = [
  'suicide', 'death', 'kill myself', 'end my life', 'die', 'kill', 'suicide methods', 'crazy ideas'
];
// List of fashion-related keywords
const fashionKeywords = [
  'fashion', 'clothes', 'style', 'outfit', 'trend', 'dressing', 'wardrobe', 'apparel', 'wear'
];
// List of actor-related keywords
const actorKeywords = [
  'actor', 'actress', 'celebrity', 'film star', 'movie star', 'stardom', 'casting', 'rejection','mahesh','pawan kalyan','chiranjeevi','nani','prabhas','ntr','ram','ravi teja'
];

// Responses
const sportsResponse = "Did you know that playing sports can significantly boost your mood and overall well-being? Engaging in physical activities releases endorphins, the body's natural 'feel-good' hormones, which help reduce stress and anxiety. Whether you're running on the track, scoring goals, or simply playing a friendly match with friends, the sense of accomplishment and camaraderie can uplift your spirit. Sports also teach valuable life skills like teamwork, perseverance, and discipline, which are beneficial both on and off the field. So, lace up those shoes, get out there, and enjoy the incredible benefits that come with staying active and having fun. Remember, every effort you put in brings you one step closer to a healthier, happier you!";
const suicideResponse = "Hey, I'm really sorry you're feeling this way, but I'm glad you reached out. It's important to talk about these feelings and get support. Remember, feelings of hopelessness can be very intense and overwhelming, but they don't last forever. Here are a few things to consider: Small steps like taking a walk, listening to music, or writing down your thoughts can help alleviate some of the pain. Connecting with friends, family, or a mental health professional can provide the support you need. Therapy and counseling can provide strategies and support to help manage these feelings.";
const natureResponse = "Nature plays a vital role in improving mental health by providing a calming and restorative environment that reduces stress and anxiety. Exposure to natural settings, such as parks, forests, and bodies of water, can enhance mood, increase feelings of happiness, and promote relaxation. Studies have shown that spending time in nature can lower cortisol levels, decrease blood pressure, and improve overall well-being. The sensory experiences of nature, like the sounds of birds, the smell of fresh air, and the sight of greenery, stimulate positive emotions and cognitive functions. Engaging in outdoor activities, such as walking, gardening, or simply sitting in a natural environment, can also foster social interactions and physical exercise, further contributing to improved mental health. In a world where digital and urban stressors are prevalent, reconnecting with nature offers a simple yet powerful means to nurture mental well-being.";
const fashionResponse = "Fashion plays a significant role in improving mental health by fostering self-expression, boosting confidence, and enhancing mood. Wearing clothes that reflect one's personality and style can empower individuals, helping them feel more authentic and confident. The act of dressing up, experimenting with different styles, and following fashion trends can be a form of creative expression, which can be therapeutic and uplifting. Additionally, the social aspect of fashion, such as receiving compliments and engaging in fashion communities, can improve self-esteem and promote a sense of belonging. Ultimately, fashion can be a powerful tool for enhancing one's mental well-being and overall sense of happiness.";
const actorResponse = "Before achieving success, many actors and stars endure significant hardships, including discrimination, hatred, struggles, and trolls. They often face casting biases based on their appearance, race, or background, leading to limited opportunities and constant rejections. The relentless scrutiny and negative comments from critics and the public can be mentally draining, as trolls target their personal lives and professional choices. These challenges test their resilience and mental health, making the journey to stardom fraught with emotional turmoil. However, overcoming these obstacles not only paves the way for their success but also strengthens their resolve and ability to inspire others facing similar struggles.";

function cleanResponseText(text) {
  // Remove **, ##, and * from the text
  let cleanedText = text.replace(/\*\*/g, '').replace(/##/g, '').replace(/\*/g, '');

  // Split text into sentences
  let sentences = cleanedText.match(/[^.!?]+[.!?]*/g) || [];

  let resultText = '';
  let wordCount = 0;

  // Add sentences until we reach the word limit
  for (let sentence of sentences) {
    let words = sentence.split(/\s+/).length;
    if (wordCount + words > MAX_RESPONSE_WORDS) {
      break;
    }
    resultText += sentence;
    wordCount += words;
  }

  // Ensure the response is at least the minimum word count
  if (wordCount < MIN_RESPONSE_WORDS) {
    resultText = cleanedText; // Fallback to the full text if not enough words
  }

  return resultText;
}

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([ { sender: 'bot', text: 'Hi! I am your mental health assistant. How can I help you today?' },
    ]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100
            }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 1200,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 1000,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function generateAnswer() {
    if (question.trim() === '') return;

    const userMessage = { sender: 'user', text: question };
    setConversation([...conversation, userMessage]);
    setQuestion('');

    // Check if the question contains mental health-related keywords
    const containsMentalHealthKeyword = mentalHealthKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Check if the question contains sports-related keywords
    const containsSportsKeyword = sportsKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Check if the question contains nature-related keywords
    const containsNatureKeyword = natureKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Check if the question contains suicide/death-related keywords
    const containsSuicideKeyword = suicideKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Check if the question contains fashion-related keywords
    const containsFashionKeyword = fashionKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    // Check if the question contains actor-related keywords
    const containsActorKeyword = actorKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    if (containsSuicideKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: suicideResponse,
        },
      ]);
      return;
    }

    if (containsSportsKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: sportsResponse,
        },
      ]);
      return;
    }

    if (containsNatureKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: natureResponse,
        },
      ]);
      return;
    }

    if (containsFashionKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: fashionResponse,
        },
      ]);
      return;
    }

    if (containsActorKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: actorResponse,
        },
      ]);
      return;
    }

    if (!containsMentalHealthKeyword) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:"Thank you for reaching out.You might be interested in that topic.But,My primary focus is on providing support and information related to mental health. If you have questions or need assistance in this area, I'm here to help. For inquiries outside of mental health, I recommend seeking advice from the appropriate professionals or resources. Your understanding is greatly appreciated."
        },
      ]);
      return;
    }

    setConversation((prev) => [...prev, { sender: 'bot', text: 'Loading.....' }]);

    try {
      const response = await axios({
        url: modelEndpoint,
        method: 'post',
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const botMessage = { sender: 'bot', text: cleanResponseText(response.data.candidates[0].content.parts[0].text) };
      setConversation((prev) => {
        const updatedConversation = [...prev];
        updatedConversation[updatedConversation.length - 1] = botMessage;
        return updatedConversation;
      });
    } catch (error) {
      console.error('Error fetching the answer:', error);
      setConversation((prev) => {
        const updatedConversation = [...prev];
        updatedConversation[updatedConversation.length - 1] = {
          sender: 'bot',
          text: 'An error occurred. Please try again.',
        };
        return updatedConversation;
      });
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnswer();
    }
  };

  return (
    <div>
      <div id="particles-js"></div>
      <div className="chat-container">
        <div className="conversation">
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <img
                  src="bot_Image.png"
                  alt="Bot"
                  className="avatar"
                  width="40"
                  height="40"
                />
              ) : null}
              {msg.text}
              {msg.sender === 'user' ? (
                <img
                  src="human2_processed.jpeg"
                  alt="User"
                  className="avatar user-avatar"
                  width="40"
                  height="40"

                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="input-container">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            placeholder="Type your message..."
          />
          <button onClick={generateAnswer}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
