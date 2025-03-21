document.addEventListener('DOMContentLoaded', () => {

  
  // Elementos generales
  const startButton = document.getElementById('startButton');
  const overlay = document.getElementById('overlay');
  let titulo = document.getElementById('titulo');
  let poemaContainer = document.getElementById('poema-container');
  let typedTextElem = document.getElementById('typedText');
  let pageIndicatorElem = document.getElementById('pageIndicator');
  let mainContainer = document.getElementById('mainContainer');
  const audioFondo = document.getElementById('audioFondo');

  
  const audioPoema = document.getElementById('audioPoema');
  const audioNovios = document.getElementById('audioNovios');

  // Datos del poema en francés
  const pages_fr = [
    `Hier, je me suis éveillé en me demandant
si aujourd’hui tu m’aimerais de tout ton être,
car dans la douce consolation de ton sourire,
j’ai trouvé l’ardeur qui éclaire mon aurore.`,
    `Les pétales de ton essence dansent doucement
dans la tendre lueur du crépuscule,
et lorsque tes lèvres s’entrouvrent,
mon regard s’émerveille de leur éclat,
comme le vernis qui pare la lumière du soir.`,
    `Ô, magnifique tulip, serre-moi dans tes bras
pour que je me perde dans la passion
et me livre sans remède à cet envoûtement.
    
Ne crains pas la fragilité de l’amour ;
je te porterai dans mes bras,
même si le chemin devient incertain.`,
    `À présent que tu es maîtresse de mes sentiments,
laissons la lumière d’un réverbère
guider notre destinée,
tandis que l’enivrante sensation
de baisers entre tes mains et mes lèvres
éveille un univers sans fin.`
  ];
  const importantWords_fr = ["ardeur", "crépuscule", "passion", "sentiments"];

  // Datos del poema en español
  const pages_es = [
    `Ayer desperté preguntándome
si hoy me amarás con todo tu ser,
pues en el dulce consuelo de tu sonrisa
hallé el fervor que alumbra mi amanecer.`,
    `Danzan suavemente los pétalos de tu esencia
en el tierno ocaso del día,
y al abrir tus labios,
mi mirada se deleita en su brillo,
como el charol que engalana la luz del crepúsculo.`,
    `Oh, hermoso tulipán, abrázame con tus brazos
para perderme en la pasión
y rendirme sin remedio a este embeleso.`,
    `No temas a la fragilidad del amor;
te llevaré en mis brazos incluso cuando el camino se torne incierto.
Ahora que eres dueña de mis sentimientos,
dejemos que la luz de un farol
guíe nuestro destino,
mientras la embriagadora sensación
de besos entre tus manos y mis labios
despierta un universo sin final.`
  ];
  
  const importantWords_es = ["fervor", "crepúsculo", "pasión", "sentimientos"];

  let currentPage = 0;
  const typeSpeed = 40; // ms por carácter

  // Función typewriter
  function typeWriter(text, elem, speed, callback) {
    elem.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        elem.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  // Resalta la palabra importante cuando el texto ha sido digitado (con retardo opcional)
  function highlightImportantWord(word) {
    const regex = new RegExp(`\\b(${word})\\b`);
    // Se espera 300ms antes de resaltar (opcional)
    setTimeout(() => {
      const newHTML = typedTextElem.innerHTML.replace(regex, `<span class="highlight animated-highlight">$1</span>`);
      typedTextElem.innerHTML = newHTML;
    }, 300);
  }

  // Función para iniciar efecto de partículas usando tsParticles
  function startParticlesRain(type) {
    // type: "hearts" o "droplets"
    let shape, color;
    if (type === "hearts") {
      shape = { type: "char", character: { value: "❤", font: "Arial", style: "", weight: "400" } };
      color = { value: "#ff69b4" };
    } else if (type === "droplets") {
      shape = { type: "char", character: { value: "💧", font: "Arial", style: "", weight: "400" } };
      color = { value: "#555" };
    }
    tsParticles.load("particles-js", {
      fpsLimit: 60,
      particles: {
        number: { value: 50, density: { enable: true, area: 800 } },
        color: color,
        shape: shape,
        opacity: { value: 0.8 },
        size: { value: 30, random: { enable: true, minimumValue: 10 } },
        move: { enable: true, speed: 5, direction: "bottom", outModes: { default: "out" } }
      },
      detectRetina: true,
      background: { color: { value: "transparent" } }
    });
  }

  

  // Función para mostrar cada página del poema y reproducir el audio al inicio
  function showPage(pagesArray, isSpanish = false) {
    if (currentPage >= pagesArray.length) return;
    pageIndicatorElem.textContent = `Página ${currentPage + 1}/${pagesArray.length}`;
    const currentSpeed = typeSpeed;
    const audioId = isSpanish ? 'audioES' + (currentPage + 1) : 'audioFR' + (currentPage + 1);
    const currentAudio = document.getElementById(audioId);
    currentAudio.play().catch(err => console.log(`Error al reproducir ${audioId}:`, err));
    typeWriter(pagesArray[currentPage], typedTextElem, currentSpeed, () => {
      if (isSpanish) {
        highlightImportantWord(importantWords_es[currentPage]);
      } else {
        highlightImportantWord(importantWords_fr[currentPage]);
      }
    });
    currentAudio.onended = () => {
      if (!isSpanish) {
        if (currentPage < pagesArray.length - 1) {
          currentPage++;
          typedTextElem.textContent = '';
          showPage(pagesArray, isSpanish);
        } else {
          const nextButton = document.createElement('button');
          nextButton.textContent = "Siguiente";
          nextButton.className = "btn btn-primary mt-3";
          nextButton.addEventListener('click', () => {
            showLanguageSelection();
          });
          poemaContainer.appendChild(nextButton);
        }
      } else {
        if (currentPage < pagesArray.length - 1) {
          currentPage++;
          typedTextElem.textContent = '';
          showPage(pagesArray, isSpanish);
        } else {
          showFinalCard();
        }
      }
    };
  }

  // Panel de selección de idioma
  function showLanguageSelection() {
    mainContainer.innerHTML = '';
    const langDiv = document.createElement('div');
    langDiv.className = "language-selection animate__animated animate__fadeIn";
    langDiv.innerHTML = `
      <h2>Idioma español</h2>
      <button id="spanishButton" class="btn btn-success mt-3">Iniciar Poema en Español</button>
      <div class="speaker-icon mt-3">&#128266;</div>
    `;
    mainContainer.appendChild(langDiv);
    document.getElementById('spanishButton').addEventListener('click', () => {
      mainContainer.innerHTML = `
        <h1 id="titulo" class="animate__animated animate__fadeInDown" style="font-family: 'Playfair Display', serif;">Amor de mi alma</h1>
        <div id="poema-container" class="poema-container" style="display: block;">
          <div id="typedText" class="typed-text"></div>
          <div id="pageIndicator" class="page-indicator"></div>
        </div>
      `;
      titulo = document.getElementById('titulo');
      poemaContainer = document.getElementById('poema-container');
      typedTextElem = document.getElementById('typedText');
      pageIndicatorElem = document.getElementById('pageIndicator');
      currentPage = 0;
      audioPoema.play().catch(err => console.log("Error al reproducir audioPoema:", err));
      showPage(pages_es, true);
    });
  }

  // Funciones para enviar email con plantillas diferenciadas usando EmailJS
  function sendEmailYes() {
    const templateParams = {
      to_email: "zanniancelis@gmail.com",
      subject: "Elección de usuario - Sí",
      message: "El usuario escogió la opción: Sí"
    };
    emailjs.send("service_5k81x9g", "template_5nergmb", templateParams)
      .then(response => console.log('Correo enviado (Sí)', response.status, response.text))
      .catch(err => console.log('Error al enviar correo (Sí)', err));
  }

  function sendEmailNo() {
    const templateParams = {
      to_email: "zanniancelis@gmail.com",
      subject: "Elección de usuario - No",
      message: "El usuario escogió la opción: No"
    };
    emailjs.send("service_5k81x9g", "template_q8to0vm", templateParams)
      .then(response => console.log('Correo enviado (No)', response.status, response.text))
      .catch(err => console.log('Error al enviar correo (No)', err));
  }

  // Función para mostrar la Tarjeta Final y gestionar acciones de botones
  function showFinalCard() {
    mainContainer.innerHTML = '';
    const finalCard = document.createElement('div');
    finalCard.className = "final-card animate__animated animate__fadeIn";
    finalCard.innerHTML = `
      <h3>Clic al emoji</h3>
      <div class="speaker-icon" id="finalSpeaker">&#128266;</div>
      <div class="btn-group mt-3">
        <button id="yesButton" class="btn btn-dark" disabled>Sí</button>
        <button id="noButton" class="btn btn-dark" disabled>No</button>
      </div>
    `;
    mainContainer.appendChild(finalCard);
    
    // Al hacer clic en el emoji, reproducir audio "novios" y activar botones al finalizar
    document.getElementById('finalSpeaker').addEventListener('click', () => {
      audioNovios.play().catch(err => console.log("Error al reproducir audioNovios:", err));
      audioNovios.onended = () => {
        document.getElementById('yesButton').disabled = false;
        document.getElementById('noButton').disabled = false;
        document.getElementById('yesButton').classList.remove('btn-dark');
        document.getElementById('yesButton').classList.add('btn-success');
        document.getElementById('noButton').classList.remove('btn-dark');
        document.getElementById('noButton').classList.add('btn-danger');
      };
    });
    
    // Acción para el botón Sí
    document.getElementById('yesButton').addEventListener('click', () => {
      sendEmailYes();
      // Esfumamos todo excepto el botón Sí
      mainContainer.innerHTML = '';
      const yesBtn = document.createElement('button');
      yesBtn.textContent = "Sí";
      yesBtn.className = "btn btn-success";
      yesBtn.style.position = "fixed";
      yesBtn.style.top = "50%";
      yesBtn.style.left = "50%";
      yesBtn.style.transform = "translate(-50%, -50%)";
      mainContainer.appendChild(yesBtn);
      // Cambiamos el fondo a tonos rosados
      document.body.style.background = "#ffb6c1";
      // Iniciamos animación del botón y la lluvia de corazones (usando tsParticles)
      yesBtn.classList.add('grow');
      startParticlesRain("hearts");
    });
    
    // Acción para el botón No
    document.getElementById('noButton').addEventListener('click', () => {
      sendEmailNo();
      // Detenemos la música de fondo
      audioFondo.pause();
      audioFondo.currentTime = 0;
      
      // Esfumamos todo excepto el botón No
      mainContainer.innerHTML = '';
      const noBtn = document.createElement('button');
      noBtn.textContent = "No";
      noBtn.className = "btn btn-danger";
      noBtn.style.position = "fixed";
      noBtn.style.top = "50%";
      noBtn.style.left = "50%";
      noBtn.style.transform = "translate(-50%, -50%)";
      mainContainer.appendChild(noBtn);
      // Aplicamos escala de grises a la interfaz
      document.body.classList.add('grayscale');
      // Iniciamos efecto de lluvia de gotas en tonos oscuros
      startParticlesRain("droplets");
    });
  }

  // Inicio: al hacer clic en el botón del overlay
  startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    audioFondo.play().catch(err => console.log("Error al reproducir audioFondo:", err));
    titulo.classList.add('animate__fadeInDown');
    setTimeout(() => {
      titulo.classList.remove('animate__fadeInDown');
      titulo.classList.add('animate__fadeOutUp');
      setTimeout(() => {
        titulo.style.display = 'none';
        poemaContainer.style.display = 'block';
        audioPoema.play().catch(err => console.log("Error al reproducir audioPoema:", err));
        showPage(pages_fr, false);
      }, 1000);
    }, 5000);
  });
});

startButton.addEventListener('click', () => {
  overlay.style.display = 'none';
  audioFondo.volume = 0.3; // Ajusta el volumen aquí
  audioFondo.play().catch(err => console.log("Error al reproducir audioFondo:", err));
  titulo.classList.add('animate__fadeInDown');
  
  setTimeout(() => {
      titulo.classList.remove('animate__fadeInDown');
      titulo.classList.add('animate__fadeOutUp');
      setTimeout(() => {
          titulo.style.display = 'none';
          poemaContainer.style.display = 'block';
          audioPoema.play().catch(err => console.log("Error al reproducir audioPoema:", err));
          showPage(pages_fr, false);
      }, 1000);
  }, 5000);
});

startButton.addEventListener('click', () => {
  overlay.style.display = 'none';
  audioFondo.volume = 0.1; // Ajusta el volumen aquí
  audioFondo.play().catch(err => console.log("Error al reproducir audioFondo:", err));
  titulo.classList.add('animate__fadeInDown');
  
  setTimeout(() => {
      titulo.classList.remove('animate__fadeInDown');
      titulo.classList.add('animate__fadeOutUp');
      setTimeout(() => {
          titulo.style.display = 'none';
          poemaContainer.style.display = 'block';
          audioPoema.play().catch(err => console.log("Error al reproducir audioPoema:", err));
          showPage(pages_fr, false);
      }, 1000);
  }, 5000);
});
