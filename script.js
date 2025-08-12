// Datos para Verdad o Mito
const truthMythFacts = [
    { fact: "Los humanos comparten el 50% de su ADN con los plátanos", answer: true, explanation: "¡Verdadero! Compartimos aproximadamente la mitad de nuestros genes con los plátanos." },
    { fact: "El sonido que hace un pato no hace eco", answer: false, explanation: "¡Falso! Los patos sí producen eco, es solo un mito urbano." },
    { fact: "En Japón hay más máquinas expendedoras que personas", answer: true, explanation: "¡Verdadero! Hay aproximadamente 1 máquina por cada 23 personas." },
    { fact: "El músculo más fuerte del cuerpo humano es la lengua", answer: false, explanation: "¡Falso! El más fuerte es el masetero (en la mandíbula), aunque la lengua es el más resistente." },
    { fact: "Las mariposas saborean con sus patas", answer: true, explanation: "¡Verdadero! Tienen receptores gustativos en las patas." }
];

// Random facts generator
const randomFacts = [
    "Los humanos comparten el 50% de su ADN con los plátanos.",
    "El sonido que hace un pato no hace eco y nadie sabe por qué.",
    "En Japón hay más máquinas expendedoras que personas.",
    "El músculo más fuerte del cuerpo humano es la lengua.",
    "Las mariposas saborean con sus patas.",
    "El nombre original de Google era 'Backrub'.",
    "Los ojos de un avestruz son más grandes que su cerebro."
];

// Nueva función fetchEpisodes mejorada
async function fetchEpisodes(isLibrary = false) {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://anchor.fm/s/108369df0/podcast/rss');
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('No se encontraron episodios');
        }
        
        const episodes = data.items.map(item => {
            return {
                title: item.title,
                pubDate: item.pubDate,
                audio: item.enclosure.link,
                image: item.thumbnail || 'default-cover.jpg',
                description: item.description,
                link: item.link
            };
        });
        
        if (isLibrary) {
            renderFullLibrary(episodes);
        } else {
            renderHomeEpisodes(episodes);
        }
    } catch (error) {
        console.error('Error fetching episodes:', error);
        if (isLibrary) {
            renderFullLibrary([]);
        } else {
            renderHomeEpisodes([]);
        }
    }
}

// Función para renderizar episodios en home
function renderHomeEpisodes(episodes) {
    const featuredContainer = document.getElementById('featured-episode');
    const gridContainer = document.getElementById('episodes-grid');
    
    if (episodes.length === 0) {
        featuredContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No se pudieron cargar los episodios. Por favor intenta más tarde.</p>
            </div>
        `;
        gridContainer.innerHTML = '';
        return;
    }

    // Último episodio (destacado)
    const featured = episodes[0];
    featuredContainer.innerHTML = `
        <div class="featured-episode-cover" style="background-image: url('${featured.image}')">
            <div class="featured-badge">NUEVO</div>
        </div>
        <div class="featured-episode-content">
            <h3>EPISODIO MÁS RECIENTE</h3>
            <h2>${featured.title}</h2>
            <div class="featured-meta">
                <span class="featured-date"><i class="far fa-calendar-alt"></i> ${formatDate(featured.pubDate)}</span>
            </div>
            <p class="featured-description">${truncateDescription(featured.description, 150)}</p>
            <div class="featured-buttons">
                <a href="${featured.link}" target="_blank" class="btn btn-accent"><i class="fab fa-spotify"></i> Escuchar en Spotify</a>
                <a href="${featured.link}" target="_blank" class="btn btn-outline"><i class="fas fa-external-link-alt"></i> Más plataformas</a>
            </div>
        </div>
    `;
    
    // Episodios anteriores (siguientes 3)
    gridContainer.innerHTML = '';
    
    const episodesToShow = episodes.slice(1, 4);
    episodesToShow.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <div class="episode-cover" style="background-image: url('${episode.image}')"></div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <div class="episode-meta">
                    <span class="episode-date"><i class="far fa-calendar-alt"></i> ${formatDate(episode.pubDate)}</span>
                </div>
                <div class="episode-buttons">
                    <a href="${episode.link}" target="_blank" class="btn btn-play"><i class="fas fa-headphones"></i> Escuchar</a>
                </div>
            </div>
        `;
        gridContainer.appendChild(episodeCard);
    });
}

// Juego Verdad o Mito
function setupTruthMythGame() {
    const truthMythText = document.getElementById('truth-myth-text');
    const truthMythResult = document.getElementById('truth-myth-result');
    const newFactBtn = document.getElementById('new-fact-btn');
    const truthBtn = document.querySelector('.btn-truth');
    const mythBtn = document.querySelector('.btn-myth');
    
    let currentFact = null;
    
    function getRandomFact() {
        const randomIndex = Math.floor(Math.random() * truthMythFacts.length);
        currentFact = truthMythFacts[randomIndex];
        truthMythText.textContent = currentFact.fact;
        truthMythResult.textContent = '';
        truthMythResult.className = 'truth-myth-result';
    }
    
    function checkAnswer(userAnswer) {
        if (!currentFact) return;
        
        const isCorrect = userAnswer === currentFact.answer;
        
        if (isCorrect) {
            triggerConfetti();
        }
        
        truthMythResult.textContent = isCorrect ? 
            '¡Correcto! 🎉' : '¡Incorrecto! 😅';
        truthMythResult.className = `truth-myth-result ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Mostrar explicación después de 1 segundo
        setTimeout(() => {
            truthMythResult.textContent += ` ${currentFact.explanation}`;
        }, 1000);
    }
    
    truthBtn.addEventListener('click', () => checkAnswer(true));
    mythBtn.addEventListener('click', () => checkAnswer(false));
    newFactBtn.addEventListener('click', getRandomFact);
    
    // Iniciar con un fact aleatorio
    getRandomFact();
}

// Función para lanzar confeti
function triggerConfetti() {
    const confettiSettings = {
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    };
    
    if (window.confetti) {
        confetti(confettiSettings);
    }
}

// Funciones auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function truncateDescription(text, maxLength) {
    if (!text) return '';
    // Eliminar etiquetas HTML si las hay
    const div = document.createElement('div');
    div.innerHTML = text;
    const cleanText = div.textContent || div.innerText || '';
    
    return cleanText.length > maxLength ? 
        `${cleanText.substring(0, maxLength)}...` : cleanText;
}

// Configuración inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar episodios
    fetchEpisodes();
    
    // Random fact generator
    document.addEventListener('click', function(e) {
        if (e.target.id === 'randomFactBtn') {
            const randomFactDisplay = document.getElementById('randomFactDisplay');
            const randomIndex = Math.floor(Math.random() * randomFacts.length);
            randomFactDisplay.textContent = randomFacts[randomIndex];
            randomFactDisplay.style.display = 'block';
            
            // Animación
            randomFactDisplay.style.animation = 'none';
            void randomFactDisplay.offsetWidth; // Trigger reflow
            randomFactDisplay.style.animation = 'flipIn 0.6s ease';
        }
    });
    
    // Verdad o Mito
    setupTruthMythGame();
    
    // Smooth scroll para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Reveal animations al hacer scroll
    const revealElements = document.querySelectorAll('.episodes, .wtf-fact, .about, .subscribe, .truth-myth');
    
    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', checkReveal);
    
    // Efecto parallax para el hero
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
});

// Añadir animación de flip al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes flipIn {
        0% {
            transform: perspective(400px) rotateX(90deg);
            opacity: 0;
        }
        100% {
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Cargar librería de confeti
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);
// Efecto especial para el nombre en el footer
document.querySelectorAll('.name-part').forEach((part, index) => {
    part.style.animationDelay = `${index * 0.1}s`;
    
    part.addEventListener('mouseenter', () => {
        part.style.transform = 'translateY(-5px)';
        part.style.textShadow = `0 5px 15px rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
    });
    
    part.addEventListener('mouseleave', () => {
        part.style.transform = '';
        part.style.textShadow = '';
    });
});

// Efecto de confeti al hacer clic en el nombre
document.querySelector('.dev-name').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Confeti personalizado
    if (window.confetti) {
        const colors = ['#ff0033', '#00ff88', '#0099ff'];
        
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0.8, y: 1 },
            colors: colors
        });
        
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 0.2, y: 1 },
            colors: colors
        });
    }
    
    // Abre el enlace después de la animación
    setTimeout(() => {
        window.open(e.target.href, '_blank');
    }, 500);
});
// Banco de 50 preguntas únicas (no aparecen en otras secciones)
const quizQuestions = [
    {
        question: "¿El olor a hierba recién cortada es en realidad una señal de socorro de las plantas?",
        answer: true,
        explanation: "VERDAD. Es un compuesto químico que liberan para advertir a otras plantas."
    },
    {
        question: "¿Los astronautas crecen aproximadamente 5 cm de altura en el espacio?",
        answer: true,
        explanation: "VERDAD. Sin la gravedad, la columna vertebral se expande."
    },
    {
        question: "¿El vodka puede ser usado como combustible para autos?",
        answer: true,
        explanation: "VERDAD. Contiene etanol, que puede usarse como combustible alternativo."
    },
    {
        question: "¿Las abejas reconocen rostros humanos?",
        answer: true,
        explanation: "VERDAD. Pueden aprender y recordar características faciales."
    },
    {
        question: "¿El orgasmo de un cerdo dura 30 minutos?",
        answer: false,
        explanation: "MENTIRA. Dura aproximadamente 15 minutos (aún así es impresionante)."
    },
    {
        question: "¿Los cocodrilos pueden trepar árboles?",
        answer: true,
        explanation: "VERDAD. Algunas especies pueden escalar hasta 3 metros de altura."
    },
    {
        question: "¿El polvo que ves flotando en un rayo de luz es en su mayoría piel muerta?",
        answer: true,
        explanation: "VERDAD. Aproximadamente el 80% de ese polvo son células epiteliales."
    },
    {
        question: "¿Los pingüinos tienen rodillas?",
        answer: true,
        explanation: "VERDAD. Están ocultas bajo su plumaje y piel gruesa."
    },
    {
        question: "¿El cerebro humano puede sobrevivir 5 minutos sin oxígeno?",
        answer: false,
        explanation: "MENTIRA. El daño cerebral comienza después de solo 1 minuto sin oxígeno."
    },
    {
        question: "¿Existe un hongo que sabe exactamente a pollo frito?",
        answer: true,
        explanation: "VERDAD. El hongo Laetiporus tiene ese sabor característico."
    },
    {
        question: "¿Los gatos no pueden saborear lo dulce?",
        answer: true,
        explanation: "VERDAD. Carecen del receptor genético para detectar sabores dulces."
    },
    {
        question: "¿Las ratas se ríen cuando les hacen cosquillas?",
        answer: true,
        explanation: "VERDAD. Emiten sonidos ultrasónicos similares a risas."
    },
    {
        question: "¿El agua caliente se congela más rápido que la fría?",
        answer: true,
        explanation: "VERDAD. Es el efecto Mpemba, aún no completamente explicado."
    },
    {
        question: "¿Los humanos tienen más bacterias que células en su cuerpo?",
        answer: true,
        explanation: "VERDAD. La proporción es aproximadamente 1.3:1 a favor de las bacterias."
    },
    {
        question: "¿Las cabras tienen acentos diferentes según su región?",
        answer: true,
        explanation: "VERDAD. Adaptan sus balidos al dialecto local."
    },
    {
        question: "¿El corazón de una ballena azul es del tamaño de un auto pequeño?",
        answer: true,
        explanation: "VERDAD. Puede pesar hasta 900 kg y medir 1.5 metros."
    },
    {
        question: "¿Los ojos de los avestruces son más grandes que su cerebro?",
        answer: true,
        explanation: "VERDAD. Sus ojos miden 5 cm de diámetro."
    },
    {
        question: "¿El olor a lluvia tiene nombre científico?",
        answer: true,
        explanation: "VERDAD. Se llama 'petricor', causado por bacterias y aceites vegetales."
    },
    {
        question: "¿Los pulpos tienen sangre azul?",
        answer: true,
        explanation: "VERDAD. Usan hemocianina (cobre) en lugar de hemoglobina (hierro)."
    },
    {
        question: "¿Las zanahorias eran originalmente moradas?",
        answer: true,
        explanation: "VERDAD. Las naranjas fueron creadas en el siglo XVI en honor a la casa real holandesa."
    },
    {
        question: "¿Los elefantes no pueden saltar?",
        answer: true,
        explanation: "VERDAD. Son los únicos mamíferos incapaces de saltar."
    },
    {
        question: "¿El unicornio es el animal nacional de Escocia?",
        answer: true,
        explanation: "VERDAD. Fue adoptado como símbolo en el siglo XII."
    },
    {
        question: "¿Los caracoles pueden dormir hasta 3 años?",
        answer: true,
        explanation: "VERDAD. En condiciones de sequía extrema."
    },
    {
        question: "¿El veneno de algunas arañas puede disolver carne humana?",
        answer: true,
        explanation: "VERDAD. La araña reclusa parda tiene veneno necrótico."
    },
    {
        question: "¿Las vacas tienen mejores amigos?",
        answer: true,
        explanation: "VERDAD. Forman vínculos estrechos con individuos específicos."
    },
    {
        question: "¿El calamar gigante tiene los ojos más grandes del reino animal?",
        answer: true,
        explanation: "VERDAD. Pueden medir hasta 27 cm de diámetro."
    },
    {
        question: "¿Los humanos comparten el 60% de su ADN con los plátanos?",
        answer: false,
        explanation: "MENTIRA. Compartimos alrededor del 50%."
    },
    {
        question: "¿Las hormigas no duermen?",
        answer: false,
        explanation: "MENTIRA. Tienen ciclos de descanso de aproximadamente 8 minutos."
    },
    {
        question: "¿Los tiburones pueden detectar una gota de sangre en una piscina olímpica?",
        answer: true,
        explanation: "VERDAD. Su sentido del olfato es extremadamente sensible."
    },
    {
        question: "¿El pelo facial crece más rápido que el del cuero cabelludo?",
        answer: true,
        explanation: "VERDAD. La barba crece más rápido debido a la testosterona."
    },
    {
        question: "¿Las jirafas solo duermen 20 minutos al día?",
        answer: false,
        explanation: "MENTIRA. Duermen alrededor de 4 horas diarias en total."
    },
    {
        question: "¿Los koalas tienen huellas dactilares casi idénticas a las humanas?",
        answer: true,
        explanation: "VERDAD. Son indistinguibles incluso bajo microscopio electrónico."
    },
    {
        question: "¿El sonido viaja más rápido en el agua que en el aire?",
        answer: true,
        explanation: "VERDAD. Aproximadamente 4 veces más rápido (1482 m/s vs 343 m/s)."
    },
    {
        question: "¿Los delfines se llaman por su nombre?",
        answer: true,
        explanation: "VERDAD. Cada uno desarrolla un silbido único que funciona como nombre."
    },
    {
        question: "¿El pelo rubio es más común en adultos que en niños?",
        answer: false,
        explanation: "MENTIRA. Muchos niños rubios se oscurecen al crecer."
    },
    {
        question: "¿Los camellos almacenan agua en sus jorobas?",
        answer: false,
        explanation: "MENTIRA. Almacenan grasa, el agua está distribuida en su cuerpo."
    },
    {
        question: "¿El estrés puede cambiar el color del cabello?",
        answer: true,
        explanation: "VERDAD. El estrés extremo puede acelerar el encanecimiento."
    },
    {
        question: "¿Los ojos de los recién nacidos son siempre azules al principio?",
        answer: false,
        explanation: "MENTIRA. Depende de la etnia, muchos nacen con ojos oscuros."
    },
    {
        question: "¿El cerebro humano puede almacenar 2.5 petabytes de información?",
        answer: true,
        explanation: "VERDAD. Equivalente a aproximadamente 3 millones de horas de TV."
    },
    {
        question: "¿Las uñas de los pies crecen más lento que las de las manos?",
        answer: true,
        explanation: "VERDAD. Aproximadamente 4 veces más lento."
    },
    {
        question: "¿Los bebés tienen más huesos que los adultos?",
        answer: true,
        explanation: "VERDAD. Nacen con unos 300 huesos que luego se fusionan en 206."
    },
    {
        question: "¿El chocolate era usado como moneda por los aztecas?",
        answer: true,
        explanation: "VERDAD. Los granos de cacao eran altamente valorados."
    },
    {
        question: "¿Los humanos son los únicos animales que producen lágrimas emocionales?",
        answer: true,
        explanation: "VERDAD. Otras especies producen lágrimas, pero no por emoción."
    },
    {
        question: "¿El ajo cortado con cuchillo de metal pierde propiedades?",
        answer: false,
        explanation: "MENTIRA. El material del cuchillo no afecta sus propiedades."
    },
    {
        question: "¿Los peces dorados tienen memoria de solo 3 segundos?",
        answer: false,
        explanation: "MENTIRA. Pueden recordar cosas por meses."
    },
    {
        question: "¿El cabello humano es casi indestructible?",
        answer: true,
        explanation: "VERDAD. Se descompone muy lentamente y resiste muchos ácidos."
    },
    {
        question: "¿Los murciélagos siempre giran a la izquierda al salir de cuevas?",
        answer: false,
        explanation: "MENTIRA. No hay preferencia direccional comprobada."
    },
    {
        question: "¿El ojo humano puede distinguir 10 millones de colores diferentes?",
        answer: true,
        explanation: "VERDAD. Gracias a las combinaciones de conos oculares."
    },
    {
        question: "¿Los bebés no producen lágrimas hasta el primer mes?",
        answer: true,
        explanation: "VERDAD. Sus conductos lagrimales no están completamente desarrollados."
    },
    {
        question: "¿El café es en realidad una fruta?",
        answer: true,
        explanation: "VERDAD. Los granos son semillas de la baya del cafeto."
    }
];

// Variables del juego
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let startTime;
let timerInterval;
const totalQuestions = quizQuestions.length;
let usedQuestions = [];

// Elementos del DOM
const questionText = document.getElementById('question-text');
const currentQuestionElement = document.getElementById('current-question');
const progressBar = document.querySelector('.progress-bar');
const quizContainer = document.querySelector('.quiz-question-container');
const resultContainer = document.querySelector('.quiz-result');
const correctCountElement = document.getElementById('correct-count');
const wrongCountElement = document.getElementById('wrong-count');
const timeCounterElement = document.getElementById('time-counter');
const explanationText = document.getElementById('explanation-text');
const explanationContainer = document.querySelector('.explanation-container');
const nextQuestionButton = document.querySelector('.next-question');
const finalCorrectElement = document.getElementById('final-correct');
const finalWrongElement = document.getElementById('final-wrong');
const finalTimeElement = document.getElementById('final-time');
const performanceFill = document.querySelector('.performance-fill');
const performanceText = document.getElementById('performance-text');
const restartButton = document.getElementById('restart-quiz');
const shareButton = document.getElementById('share-results');
const options = document.querySelectorAll('.quiz-option');

// Función para seleccionar pregunta aleatoria sin repetir
function getRandomQuestion() {
    if (usedQuestions.length === quizQuestions.length) {
        usedQuestions = []; // Reiniciar si ya se usaron todas
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizQuestions.length);
    } while (usedQuestions.includes(randomIndex));
    
    usedQuestions.push(randomIndex);
    return quizQuestions[randomIndex];
}

// Iniciar temporizador
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

// Actualizar temporizador
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
    timeCounterElement.textContent = `${minutes}:${seconds}`;
}

// Detener temporizador
function stopTimer() {
    clearInterval(timerInterval);
}

// Cargar pregunta
function loadQuestion() {
    const question = getRandomQuestion();
    questionText.textContent = question.question;
    currentQuestionElement.textContent = currentQuestion + 1;
    progressBar.style.width = `${((currentQuestion + 1) / totalQuestions * 100)}%`;
    
    // Asignar valores correctos/incorrectos aleatorios a los botones
    const randomOrder = Math.random() > 0.5;
    options[0].dataset.correct = randomOrder ? question.answer : !question.answer;
    options[1].dataset.correct = !randomOrder ? question.answer : !question.answer;
    
    // Restablecer estilos de opciones
    options.forEach(option => {
        option.classList.remove('correct-answer', 'wrong-answer');
        option.disabled = false;
    });
    
    // Ocultar explicación
    explanationContainer.classList.add('hidden');
    
    // Iniciar temporizador si es la primera pregunta
    if (currentQuestion === 0) {
        startTimer();
    }
}

// Mostrar explicación
function showExplanation(question, selectedCorrect) {
    explanationText.textContent = question.explanation;
    explanationContainer.classList.remove('hidden');
    
    // Desplazar a la explicación
    explanationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Mostrar resultados finales
function showResults() {
    stopTimer();
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const elapsedTime = new Date(new Date() - startTime);
    const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
    
    // Actualizar estadísticas
    finalCorrectElement.textContent = correctAnswers;
    finalWrongElement.textContent = wrongAnswers;
    finalTimeElement.textContent = `${minutes}:${seconds}`;
    performanceFill.style.width = `${percentage}%`;
    
    // Mensaje de desempeño
    let performanceMessage;
    if (percentage >= 90) {
        performanceMessage = "¡Eres un GENIO de los datos WTF! 🤯";
    } else if (percentage >= 70) {
        performanceMessage = "¡Excelente! Sabes más que el promedio 🎯";
    } else if (percentage >= 50) {
        performanceMessage = "¡No está mal! Pero necesitas más F*CKFACTS 💪";
    } else {
        performanceMessage = "¡Ups! Necesitas una dosis diaria de F*CKFACTS 📚";
    }
    performanceText.textContent = performanceMessage;
    
    // Mostrar contenedor de resultados
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // Confeti para buenos resultados
    if (percentage >= 80) {
        triggerConfetti();
    }
}

// Reiniciar quiz
function restartQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    usedQuestions = [];
    correctCountElement.textContent = '0';
    wrongCountElement.textContent = '0';
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    loadQuestion();
}

// Compartir resultados
function shareResults() {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const text = `¡Acerté ${percentage}% en el F*CK QUIZ EXTREMO! ¿Te atreves a superarme? ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mis resultados F*CK QUIZ',
            text: text,
            url: window.location.href
        }).catch(() => {
            // Fallback si el usuario cancela
            copyToClipboard(text);
        });
    } else {
        // Fallback para navegadores sin API de share
        copyToClipboard(text);
        alert('¡Resultados copiados! Péguelos donde quiera compartirlos');
    }
}

// Copiar al portapapeles
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Event Listeners
options.forEach(option => {
    option.addEventListener('click', function() {
        const isCorrect = this.dataset.correct === 'true';
        const currentQ = quizQuestions[usedQuestions[usedQuestions.length - 1]];
        
        if (isCorrect) {
            correctAnswers++;
            this.classList.add('correct-answer');
        } else {
            wrongAnswers++;
            this.classList.add('wrong-answer');
        }
        
        // Actualizar contadores
        correctCountElement.textContent = correctAnswers;
        wrongCountElement.textContent = wrongAnswers;
        
        // Deshabilitar opciones
        options.forEach(opt => opt.disabled = true);
        
        // Mostrar explicación
        showExplanation(currentQ, isCorrect);
    });
});

nextQuestionButton.addEventListener('click', () => {
    currentQuestion++;
    
    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showResults();
    }
});

restartButton.addEventListener('click', restartQuiz);
shareButton.addEventListener('click', shareResults);

// Iniciar primer pregunta
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si estamos en la sección del quiz
    if (document.getElementById('fck-quiz')) {
        loadQuestion();
    }
});

// Efecto de confeti mejorado
function triggerConfetti() {
    if (window.confetti) {
        const colors = ['#ff0033', '#0099ff', '#ffffff'];
        
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['circle', 'star'],
            scalar: 1.2
        });
        
        // Efecto adicional
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 70,
                origin: { x: 0.2 },
                colors: colors
            });
            
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 70,
                origin: { x: 0.8 },
                colors: colors
            });
        }, 300);
    }
}
// Banco de 50 stats exclusivos (no repetidos en otras secciones)
const fuckStats = [
    {
        stat: "El 90% de las monedas y billetes tienen rastros de cocaína",
        category: "Sociedad"
    },
    {
        stat: "Los astronautas de la ISS ven 16 amaneceres cada 24 horas",
        category: "Espacio"
    },
    {
        stat: "El calentamiento global está haciendo que los días sean más largos",
        category: "Ciencia"
    },
    {
        stat: "El olor a lluvia es causado por bacterias que viven en el suelo",
        category: "Naturaleza"
    },
    {
        stat: "Los bebés tienen un 25% más de huesos que los adultos",
        category: "Anatomía"
    },
    {
        stat: "El 99.9% del espacio está completamente vacío",
        category: "Espacio"
    },
    {
        stat: "Los pulpos tienen cerebros en cada tentáculo que funcionan independientemente",
        category: "Biología"
    },
    {
        stat: "El lugar más seco del planeta (Desierto de Atacama) se convierte en un jardín floral cada 5-7 años",
        category: "Naturaleza"
    },
    {
        stat: "El sonido del mar en los caracoles es en realidad el ruido de tu propia sangre circulando",
        category: "Física"
    },
    {
        stat: "Los humanos son los únicos animales que disfrutan comiendo comida picante",
        category: "Antropología"
    },
    {
        stat: "El árbol más solitario del mundo (un abeto en Nueva Zelanda) tiene su vecino más cercano a 200km de distancia",
        category: "Naturaleza"
    },
    {
        stat: "El 60% de tu cuerpo no es humano: son bacterias, hongos y otros microorganismos",
        category: "Biología"
    },
    {
        stat: "Los relámpagos pueden calentar el aire circundante a 30,000°C (5 veces más caliente que el sol)",
        category: "Meteorología"
    },
    {
        stat: "El animal más ruidoso del planeta (un camarón pistola) puede generar sonidos de 200dB (más que un disparo)",
        category: "Biología"
    },
    {
        stat: "Existe un hongo que convierte a las hormigas en zombies controladores mentales",
        category: "Micología"
    },
    {
        stat: "El 10% de los huesos de un gato están en su cola",
        category: "Zoología"
    },
    {
        stat: "Los diamantes pueden quemarse si se calientan a 900°C en presencia de oxígeno",
        category: "Química"
    },
    {
        stat: "El lugar más profundo del océano (Fosa de las Marianas) podría contener el Monte Everest y sobrarían 2km",
        category: "Oceanografía"
    },
    {
        stat: "Los humanos son los únicos primates cuyos senos son visibles fuera del período de lactancia",
        category: "Antropología"
    },
    {
        stat: "El 95% de las especies marinas siguen sin ser descubiertas",
        category: "Biología"
    },
    {
        stat: "El material más resistente conocido (Grafeno) es 200 veces más fuerte que el acero pero 6 veces más ligero",
        category: "Tecnología"
    },
    {
        stat: "El cerebro humano puede almacenar el equivalente a 2.5 millones de gigabytes de información",
        category: "Neurociencia"
    },
    {
        stat: "El animal más viejo del planeta (una almeja llamada Ming) vivió 507 años hasta que los científicos la mataron por error",
        category: "Zoología"
    },
    {
        stat: "El 70% del oxígeno que respiramos proviene del fitoplancton oceánico, no de los árboles",
        category: "Ecología"
    },
    {
        stat: "Los gatos domésticos comparten un 95.6% de su genoma con los tigres",
        category: "Genética"
    },
    {
        stat: "El lugar más frío del universo conocido está en la Tierra (laboratorio del MIT a 0.0000000001°K)",
        category: "Física"
    },
    {
        stat: "El 99% del oro del planeta está enterrado en su núcleo (suficiente para cubrir la superficie con una capa de 4m)",
        category: "Geología"
    },
    {
        stat: "Los bebés humanos son los únicos mamíferos que no pueden nadar instintivamente al nacer",
        category: "Biología"
    },
    {
        stat: "El 40% de las parejas casadas en Japón no mantienen relaciones sexuales",
        category: "Sociedad"
    },
    {
        stat: "El agua caliente se congela más rápido que la fría (Efecto Mpemba)",
        category: "Física"
    },
    {
        stat: "El animal con el cerebro más grande proporcionalmente (hormiga bulldog) dedica el 15% de su cuerpo a su cerebro",
        category: "Zoología"
    },
    {
        stat: "El 90% de las células de tu cuerpo no son humanas (son microbios)",
        category: "Biología"
    },
    {
        stat: "El lugar con más biodiversidad del planeta (Parque Nacional Madidi) tiene 11% de todas las especies conocidas",
        category: "Ecología"
    },
    {
        stat: "Los humanos son los únicos animales que producen lágrimas emocionales",
        category: "Antropología"
    },
    {
        stat: "El 85% de las plantas del mundo aún no han sido estudiadas por sus propiedades medicinales",
        category: "Botánica"
    },
    {
        stat: "El material más oscuro conocido (Vantablack) absorbe el 99.965% de la luz visible",
        category: "Tecnología"
    },
    {
        stat: "El 60% de tu masa corporal está compuesta por átomos que estuvieron dentro de estrellas",
        category: "Astrofísica"
    },
    {
        stat: "Los pulpos pueden editar su propio ARN para adaptarse rápidamente a cambios ambientales",
        category: "Genética"
    },
    {
        stat: "El lugar con más rayos del planeta (Lago de Maracaibo) tiene 1.2 millones de relámpagos por año",
        category: "Meteorología"
    },
    {
        stat: "Los humanos comparten el 70% de su ADN con las babosas",
        category: "Genética"
    },
    {
        stat: "El 30% de los usuarios de internet son bots",
        category: "Tecnología"
    },
    {
        stat: "El animal más resistente (Tardígrado) puede sobrevivir en el espacio exterior",
        category: "Biología"
    },
    {
        stat: "El 95% de las comunicaciones intercontinentales pasan por cables submarinos",
        category: "Tecnología"
    },
    {
        stat: "Los bebés nacen sin rótulas (se desarrollan entre los 2-6 años)",
        category: "Anatomía"
    },
    {
        stat: "El lugar con más bacterias por cm² (aeropuertos) tiene superficies con 20,000 gérmenes por pulgada cuadrada",
        category: "Microbiología"
    },
    {
        stat: "Los humanos son los únicos animales que se sonrojan",
        category: "Antropología"
    },
    {
        stat: "El 80% de las imágenes en internet son de gatos",
        category: "Internet"
    },
    {
        stat: "El animal con mejor memoria (elefante) puede recordar rutas de migración de 20 años",
        category: "Zoología"
    },
    {
        stat: "El 99.999% del ADN humano es idéntico entre todas las personas",
        category: "Genética"
    },
    {
        stat: "Los bebés pueden respirar y tragar simultáneamente hasta los 7 meses de edad",
        category: "Anatomía"
    }
];

// Mostrar un stat aleatorio
function showRandomStat() {
    const randomIndex = Math.floor(Math.random() * fuckStats.length);
    const randomStat = fuckStats[randomIndex];
    
    const statElement = document.getElementById('random-stat');
    const categoryElement = document.getElementById('stat-category');
    
    // Animación de fade out/in
    statElement.classList.remove('stat-animate');
    categoryElement.classList.remove('stat-animate');
    
    setTimeout(() => {
        statElement.textContent = randomStat.stat;
        categoryElement.textContent = randomStat.category;
        
        statElement.classList.add('stat-animate');
        categoryElement.classList.add('stat-animate');
    }, 300);
}

// Recargar stat manualmente
document.getElementById('reload-stat').addEventListener('click', showRandomStat);

// Compartir stat
document.getElementById('share-stat').addEventListener('click', function() {
    const statText = document.getElementById('random-stat').textContent;
    const shareText = `🤯 F*CK STAT: "${statText}"\n\nDescubre más en ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'F*CK STAT Impactante',
            text: shareText
        }).catch(err => {
            console.log('Error al compartir:', err);
        });
    } else {
        // Fallback para navegadores sin API de share
        navigator.clipboard.writeText(shareText).then(() => {
            alert('¡Stat copiado! Pega para compartir');
        });
    }
});

// Guardar stat (simulado)
document.getElementById('save-stat').addEventListener('click', function() {
    const btn = this;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.backgroundColor = '#00ff88';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        btn.style.backgroundColor = '';
    }, 2000);
});

// Mostrar un stat al cargar la página
document.addEventListener('DOMContentLoaded', showRandomStat);

// Cambiar stat automáticamente cada 2 minutos
setInterval(showRandomStat, 120000);
