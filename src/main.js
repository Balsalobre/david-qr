/**
 * QR Generator para mi amigo David
 * Aplicación para generar códigos QR con funcionalidad de descarga y compartir
 */

import './style.css';
import QRCode from 'qrcode';

// ===========================
// Ocultar loader cuando la app esté lista
// ===========================
window.addEventListener('load', () => {
  const loader = document.getElementById('app-loader');
  document.body.classList.add('loaded');

  // Ocultar loader con transición suave
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
      // Remover el loader del DOM después de la transición
      setTimeout(() => {
        loader.remove();
      }, 300);
    }
  }, 100);
});

// ===========================
// Referencias al DOM
// ===========================
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrOutputContainer = document.getElementById('qr-output-container');
const qrCanvas = document.getElementById('qr-canvas');
const downloadBtn = document.getElementById('download-btn');
const warningMessage = document.getElementById('warning-message');

// ===========================
// Estado de la aplicación
// ===========================
let currentQRData = null;

// ===========================
// Función para generar el código QR
// ===========================
async function generateQR() {
  // Obtener y validar el texto
  const text = textInput.value.trim();

  if (!text) {
    // Mostrar advertencia si no hay texto
    showWarning();
    return;
  }

  // Ocultar advertencia si estaba visible
  hideWarning();

  try {
    // Ajustar el tamaño del QR según el ancho de la pantalla
    const isMobile = window.innerWidth < 768;
    const qrWidth = isMobile ? 220 : 300;

    // Generar el QR en el canvas
    await QRCode.toCanvas(qrCanvas, text, {
      width: qrWidth,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });

    // Guardar los datos actuales del QR
    currentQRData = text;

    // Mostrar el contenedor del QR con animación
    qrOutputContainer.classList.remove('hidden');

    // Habilitar botón de descarga
    downloadBtn.disabled = false;

  } catch (error) {
    console.error('Error al generar el código QR:', error);
    alert('Hubo un error al generar el código QR. Por favor, inténtalo de nuevo.');
  }
}

// ===========================
// Función para mostrar advertencia
// ===========================
function showWarning() {
  warningMessage.classList.remove('hidden');

  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    hideWarning();
  }, 3000);
}

// ===========================
// Función para ocultar advertencia
// ===========================
function hideWarning() {
  warningMessage.classList.add('hidden');
}

// ===========================
// Función para descargar el QR como PNG
// ===========================
function downloadQR() {
  if (!currentQRData) return;

  try {
    // Convertir el canvas a un blob y descargarlo
    qrCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Generar nombre de archivo basado en el texto (simplificado)
      const filename = `qr-${Date.now()}.png`;

      link.href = url;
      link.download = filename;
      link.click();

      // Liberar el objeto URL
      URL.revokeObjectURL(url);
    });

  } catch (error) {
    console.error('Error al descargar el QR:', error);
    alert('Hubo un error al descargar el código QR.');
  }
}


// ===========================
// Event Listeners
// ===========================

// Generar QR al hacer clic en el botón
generateBtn.addEventListener('click', generateQR);

// Generar QR al presionar Enter en el input
textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateQR();
  }
});

// Descargar QR
downloadBtn.addEventListener('click', downloadQR);

// ===========================
// Inicialización
// ===========================

// Deshabilitar botón de descarga inicialmente
downloadBtn.disabled = true;

// Focus automático en el input al cargar la página (solo en desktop)
if (window.innerWidth >= 768) {
  textInput.focus();
}

// ===========================
// Manejo del teclado móvil
// ===========================
// Cuando el input recibe focus en móvil, hacer scroll al main-container
if (textInput) {
  textInput.addEventListener('focus', () => {
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
          // Scroll al inicio del main-container
          mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  });
}

console.log('✅ QR Generator para mi amigo David - Inicializado correctamente');
