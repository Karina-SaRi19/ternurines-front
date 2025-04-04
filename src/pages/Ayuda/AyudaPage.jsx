import React from "react";
import Components from "../Components/Components"; // Ajusta la ruta según tu estructura
import "./AyudaPage.css"; // Asegúrate de tener los estilos
import teddyImage from "../../images/ternu19.jpeg"; // Importamos la imagen del oso de peluche

const AyudaPage = () => {
  return (
    <div>
      <Components />

      {/* Sección de ayuda con iconos */}
      <div className="ayuda-container">
        <div className="ayuda-image">
          <img src={teddyImage} alt="Oso de peluche de ayuda" className="teddy-image" />
        </div>
        <div className="help-section">
          <h2>¿Hola, cómo podemos ayudarte?</h2>
          <div className="help-options">
            <div className="option-button">
              <img src="https://cdn-icons-png.flaticon.com/512/5024/5024724.png" alt="Estado del pedido" />
              <p>Estado del pedido</p>
            </div>
            <div className="option-button">
              <img src="https://cdn-icons-png.flaticon.com/512/1073/1073348.png" alt="Envíos y entregas" />
              <p>Envíos y entregas</p>
            </div>
            <div className="option-button">
              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828743.png" alt="Asistencia con regalos" />
              <p>Asistencia con regalos</p>
            </div>
            <div className="option-button">
              <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Problemas con tu pedido" />
              <p>Problemas con tu pedido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de tarjetas estilo cards */}
      <div className="cards-container">
        <div className="card">
          <div className="card-icon">📦</div>
          <h3>Estado del pedido</h3>
          <p>¿Quieres saber dónde está tu pedido lleno de ternura? Haz clic aquí para rastrearlo fácilmente.</p>
        </div>
        <div className="card">
          <div className="card-icon">🚚</div>
          <h3>Envíos y entregas</h3>
          <p>Encuentra toda la información sobre nuestras opciones de envío y tiempos de entrega.</p>
        </div>
        <div className="card">
          <div className="card-icon">🎁</div>
          <h3>Asistencia con regalos</h3>
          <p>¿Necesitas ideas para regalar o personalizar algo especial? ¡Estamos aquí para inspirarte!</p>
        </div>
        <div className="card">
          <div className="card-icon">⚠️</div>
          <h3>Problemas con un pedido</h3>
          <p>¿Tu paquete llegó incompleto o algo no era lo que esperabas? Lo solucionamos rápidamente.</p>
        </div>
        <div className="card">
          <div className="card-icon">✏️</div>
          <h3>Personalización de productos</h3>
          <p>¿Tienes dudas sobre cómo personalizar tu pedido? Te explicamos cómo hacerlo paso a paso.</p>
        </div>
        <div className="card">
          <div className="card-icon">❓</div>
          <h3>Preguntas frecuentes</h3>
          <p>Respuestas rápidas para las dudas más comunes sobre Ternurines.</p>
        </div>
      </div>
    </div>
  );
};

export default AyudaPage;
