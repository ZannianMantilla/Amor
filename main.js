document.addEventListener('DOMContentLoaded', () => {
    // Elementos generales
    const startButton = document.getElementById('startButton');
    const overlay = document.getElementById('overlay');
    const titulo = document.getElementById('titulo');
    const poemaContainer = document.getElementById('poema-container');
    const typedTextElem = document.getElementById('typedText');
    const pageIndicatorElem = document.getElementById('pageIndicator');
    const mainContainer = document.getElementById('mainContainer');
    const audioFondo = document.getElementById('audioFondo');
    const audioPoema = document.getElementById('audioPoema');
  
    // Poema en francés (dividido en páginas)
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
      
      `Ô, magnifique tulipe,
  serre-moi dans tes bras
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
  
    // Poema en español (dividido en páginas) – usando el texto que enviaste
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
      
      `Oh, hermoso tulipán,
  abrázame con tus brazos
  para perderme en la pasión
  y rendirme sin remedio a este embeleso.`,
      
      `No temas a la fragilidad del amor;
  te llevaré en mis brazos
  incluso cuando el camino se torne incierto.
  Ahora que eres dueña de mis sentimientos,
  dejemos que la luz de un farol
  guíe nuestro destino,
  mientras la embriagadora sensación
  de besos entre tus manos y mis labios
  despierta un universo sin final.`
    ];
  
    // Para cada página en español, definimos una palabra importante a resaltar.
    const importantWords_es = ["fervor", "crepúsculo", "pasión", "sentimientos"];
  
    // Variables para el seguimiento de páginas y velocidad de tipeo
    let currentPage = 0;
    let typeSpeed = 10; // velocidad para francés (ms por carácter)
    let waitTime = 2000; // tiempo de espera entre páginas para francés
  
    // Función typewriter que escribe letra a letra
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
  
    // Función para resaltar la palabra importante en español
    function highlightImportantWord(word) {
      // Se utiliza replace para envolver la primera ocurrencia de la palabra
      const regex = new RegExp(`\\b(${word})\\b`);
      const newHTML = typedTextElem.innerHTML.replace(regex, `<span class="highlight animated-highlight">$1</span>`);
      typedTextElem.innerHTML = newHTML;
    }
  
    // Función para mostrar páginas; isSpanish define si es francés o español
    function showPage(pagesArray, isSpanish = false) {
      if (currentPage >= pagesArray.length) return;
      pageIndicatorElem.textContent = `Página ${currentPage + 1}/${pagesArray.length}`;
      const currentSpeed = isSpanish ? 120 : typeSpeed;
      typeWriter(pagesArray[currentPage], typedTextElem, currentSpeed, () => {
        if (isSpanish) {
          // Resalta la palabra importante en español
          highlightImportantWord(importantWords_es[currentPage]);
          // Espera para apreciar el resaltado antes de pasar a la siguiente página
          setTimeout(() => {
            if (currentPage < pagesArray.length - 1) {
              currentPage++;
              typedTextElem.textContent = '';
              showPage(pagesArray, isSpanish);
            } else {
              // En la última página, muestra el botón "Siguiente"
              const nextButton = document.createElement('button');
              nextButton.textContent = "Siguiente";
              nextButton.className = "btn btn-primary mt-3";
              nextButton.addEventListener('click', () => {
                // Aquí puedes definir la acción del botón "Siguiente"
                console.log("Botón Siguiente presionado en español");
              });
              typedTextElem.parentElement.appendChild(nextButton);
            }
          }, 1500); // Tiempo para apreciar el resaltado
        } else {
          // Para el poema en francés, simplemente espera y pasa de página
          if (currentPage < pagesArray.length - 1) {
            setTimeout(() => {
              currentPage++;
              typedTextElem.textContent = '';
              showPage(pagesArray, isSpanish);
            }, waitTime);
          } else {
            // Última página del francés: muestra botón "Siguiente"
            setTimeout(() => {
              const nextButton = document.createElement('button');
              nextButton.textContent = "Siguiente";
              nextButton.className = "btn btn-primary mt-3";
              nextButton.addEventListener('click', () => {
                showLanguageSelection();
              });
              poemaContainer.appendChild(nextButton);
            }, waitTime);
          }
        }
      });
    }
  
    // Función para limpiar la pantalla y mostrar el panel de selección de idioma
    function showLanguageSelection() {
      mainContainer.innerHTML = '';
      const langDiv = document.createElement('div');
      langDiv.className = "language-selection animate__animated animate__fadeIn";
      langDiv.innerHTML = `
        <h2>idioma español</h2>
        <button id="spanishButton" class="btn btn-success mt-3">Escuchar Poema en Español</button>
        <div class="speaker-icon mt-3">
          &#128266;
        </div>
      `;
      mainContainer.appendChild(langDiv);
      document.getElementById('spanishButton').addEventListener('click', () => {
        // Reconstruimos la estructura para el poema en español
        mainContainer.innerHTML = `
          <h1 id="titulo" class="animate__animated animate__fadeInDown" style="font-family: 'Playfair Display', serif;">Amor de mi alma</h1>
          <div id="poema-container" class="poema-container" style="display: block;">
            <div id="typedText" class="typed-text"></div>
            <div id="pageIndicator" class="page-indicator"></div>
          </div>
        `;
        // Reiniciamos variables para el nuevo poema
        currentPage = 0;
        // Actualizamos referencias de los elementos recién creados
        const newTypedText = document.getElementById('typedText');
        const newPageIndicator = document.getElementById('pageIndicator');
        newTypedText.textContent = '';
        newPageIndicator.textContent = '';
        // Iniciamos el audio del poema en español y el tipeo
        audioPoema.play().catch(err => console.log("Error al reproducir audioPoema:", err));
        showPage(pages_es, true);
      });
    }
  
    // Al hacer clic en el botón de inicio (overlay)
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
  