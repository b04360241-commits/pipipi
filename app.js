let categoriaActual = "";
let dificultadActual = "";
let cantidadPreguntas = 0;
let preguntas = {};
let preguntasSeleccionadas = [];
let indicePregunta = 0;
let puntaje = 0;
let vidas = 3;

// =====================
// 1. Cambio de pantallas
// =====================
function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// =====================
// 2. Selección de categoría
// =====================
function selectCategory(categoria) {
  categoriaActual = categoria;

  // Cambiar imagen según el tema
  const themeImage = document.getElementById("theme-image");

  console.log ("categoria:", categoria);
  
    switch (categoria) {
    case "cultura_general": themeImage.src = "cultura_general.png"; break;
    case "ciencia": themeImage.src = "ciencia.png"; break;
    case "deportes": themeImage.src = "deportes.png"; break;
    case "geografia": themeImage.src = "geografia.png"; break;
    default: themeImage.src = "default.png";
  }

  console.log("themeImage:",themeImage.src);

  goToScreen("screen-difficulty");
}

// =====================
// 3. Selección de dificultad
// =====================
function selectDifficulty(dificultad) {
  dificultadActual = dificultad;

  if (dificultad === "facil") vidas = 5;
  if (dificultad === "medio") vidas = 3;
  if (dificultad === "dificil") vidas = Infinity; // sin límite de vidas

  goToScreen("screen-questions");
}

// =====================
// 4. Selección de cantidad de preguntas
// =====================
function setQuestions(cantidad) {
  cantidadPreguntas = cantidad;

  console.log (categoriaActual);

  // Convertimos a string porque en el JSON las claves son "5", "15", "20"
  let todas = preguntas[categoriaActual][dificultadActual][String(cantidad)];

  if (!todas) {
    console.error("No se encontraron preguntas para:", categoriaActual, dificultadActual, cantidad);
    alert("No hay preguntas cargadas para esta configuración");
    return;
  }

  // Copiamos y mezclamos aleatoriamente
  preguntasSeleccionadas = [...todas].sort(() => Math.random() - 0.5);
  indicePregunta = 0;
  puntaje = 0;

  mostrarPregunta();
  goToScreen("screen-game");
}

// =====================
// 5. Mostrar pregunta
// =====================
function mostrarPregunta() {
  let actual = preguntasSeleccionadas[indicePregunta];
  document.getElementById("question-text").innerText = actual.pregunta;

  let answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  actual.opciones.forEach(opcion => {
    let btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = opcion;
    btn.onclick = () => verificarRespuesta(opcion);
    answersDiv.appendChild(btn);
  });

  // Actualizar marcador
  document.getElementById("score").innerText = "Puntos: " + puntaje;
  updateLives();
}

// =====================
// 6. Verificar respuesta
// =====================
function verificarRespuesta(opcion) {
  let actual = preguntasSeleccionadas[indicePregunta];

  if (opcion === actual.respuesta) {
    //respuesta ok
    puntaje += 100;
    document.getElementById("result-message").innerText = "¡Correcto! 🎉";
  } else {
    //respuesta incorrecta
    if (dificultadActual !== "dificil") {
      vidas--;
    }
    document.getElementById("result-message").innerText = "Incorrecto 😢";
  }

  document.getElementById("score").innerText = "Puntos: " + puntaje;
  updateLives();

  goToScreen("screen-result");
}

// =====================
// 7. Siguiente pregunta
// =====================
function nextQuestion() {
  indicePregunta++;
  if (indicePregunta < cantidadPreguntas && vidas > 0) {
    mostrarPregunta();
    goToScreen("screen-game");
  } else {
    mostrarFinal();
  }
}

// =====================
// 8. Mostrar resultado final
// =====================
function mostrarFinal() {
  document.getElementById("final-score").innerText = "Puntos totales: " + puntaje;
  localStorage.setItem("kahootScore", puntaje);
  goToScreen("screen-final");
}

// =====================
// 9. Reiniciar juego
// =====================
function restartGame() {
  categoriaActual = "";
  dificultadActual = "";
  cantidadPreguntas = 0;
  preguntasSeleccionadas = [];
  indicePregunta = 0;
  puntaje = 0;
  vidas = 3;
  goToScreen("screen-start");
}

// =====================
// 10. Actualizar vidas
// =====================
function updateLives() {
  let livesContainer = document.getElementById("lives");
  livesContainer.innerHTML = "";

  console.log("vidas:", vidas);

  if (dificultadActual === "dificil") {
    livesContainer.textContent = "∞";
    return;
  }

  for (let i = 0; i < vidas; i++) {
    let heart = document.createElement("span");
    heart.classList.add("heart");
    heart.textContent = "❤️";
    if (i >= vidas) heart.classList.add("lost");
    livesContainer.appendChild(heart);
  }
}

// =====================
// 11. Cargar preguntas desde JSON
// =====================
fetch("./preguntas.json")
  .then(r => r.json())
  .then(data => {
    preguntas = data;
    console.log("Preguntas cargadas:", preguntas);
  })
  .catch(err => console.error("Error cargando preguntas.json", err));


