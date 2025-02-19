import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Sorpresa = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [puedeSalir, setPuedeSalir] = useState(false);

  useEffect(() => {
    // Reproducir la música automáticamente
    audioRef.current = new Audio("/cancion_sorpresa.mp3");
    audioRef.current.loop = true;
    audioRef.current.play().catch((error) => console.error("Error al reproducir:", error));

    // Lanzar fuegos artificiales al cargar la imagen
    lanzarFuegosArtificiales();

    // Habilitar la salida después de 2 segundos
    const timer = setTimeout(() => setPuedeSalir(true), 2000);

    return () => {
      clearTimeout(timer);
      audioRef.current.pause(); // Detener la música si se desmonta el componente
      audioRef.current = null;
    };
  }, []);

  const lanzarFuegosArtificiales = () => {
    let duration = 3 * 1000; // Duración de 3 segundos
    let animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: randomInRange(50, 100),
        spread: randomInRange(60, 100),
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#A0A0A0", "#C0C0C0", "#1E90FF", "#87CEEB"], // Plateado y azul
      });
    }, 300);
  };

  const handleRedirect = () => {
    if (puedeSalir) {
      navigate("/"); // Redirige a la invitación después de 2 segundos
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-black"
      onClick={handleRedirect} // Detecta clics en cualquier parte de la pantalla
    >
      <img 
        src="/imagen_sorpresa.png" 
        alt="Sorpresa" 
        className="max-w-full max-h-screen cursor-pointer"
      />
    </div>
  );
};

export default Sorpresa;
