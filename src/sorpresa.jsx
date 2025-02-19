import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const Sorpresa = () => {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const videoRef = useRef(null);

  const elementos = [
    { tipo: "video", src: "/videos/video1.mp4" },
    { tipo: "video", src: "/videos/video2.mp4" },
    { tipo: "video", src: "/videos/video3.mp4" },
    { tipo: "video", src: "/videos/video4.mp4" },
    { tipo: "imagen", src: "/videos/video5.jpg", duracion: 15000 },
    { tipo: "video", src: "/videos/video6.mp4" },
    { tipo: "video", src: "/videos/video7.mp4" },
    { tipo: "video", src: "/videos/video8.mp4" },
    { tipo: "video", src: "/videos/video9.mp4" },
    { tipo: "video", src: "/videos/video10.mp4" },
    { tipo: "video", src: "/videos/video11.mp4" },
    { tipo: "video", src: "/videos/video12.mp4" },
  ];

  useEffect(() => {
    setProgreso(0);
    let interval;

    if (elementos[indice].tipo === "video") {
      if (videoRef.current) {
        videoRef.current.muted = !isAudioEnabled;
        videoRef.current.play().catch(err => console.error("Error al reproducir:", err));

        interval = setInterval(() => {
          setProgreso(p => (p < 100 ? p + 1 : 100));
        }, (videoRef.current?.duration || 10) * 10);
      }
    } else {
      interval = setInterval(() => {
        setProgreso(p => (p >= 100 ? (avanzar(), 100) : p + (100 / (elementos[indice].duracion / 100))));
      }, 100);
    }

    return () => clearInterval(interval);
  }, [indice, isAudioEnabled]);

  // Activa el audio con el primer clic
  useEffect(() => {
    const enableAudio = () => {
      setIsAudioEnabled(true);
      document.removeEventListener("click", enableAudio);
    };

    if (!isAudioEnabled) {
      document.addEventListener("click", enableAudio, { once: true });
    }

    return () => document.removeEventListener("click", enableAudio);
  }, [isAudioEnabled]);

  const avanzar = () => {
    if (indice < elementos.length - 1) {
      setIndice(indice + 1);
    } else {
      navigate("/");
    }
  };

  const retroceder = () => {
    if (indice > 0) {
      setIndice(indice - 1);
    }
  };

  // Simulación de lluvia de corazones
  const lanzarLluviaCorazones = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 10,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#FF69B4", "#FF1493", "#FFC0CB"],
      });
    }, 200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative select-none">
      {/* Botón para salir */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/");
        }}
        className="absolute top-4 left-4 bg-gray-900 bg-opacity-60 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Barra de progreso (12 pequeñas barras) */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 flex gap-1">
        {elementos.map((_, i) => (
          <div key={i} className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: i === indice ? `${progreso}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Contenido (video o imagen) con eventos de toque */}
      {elementos[indice].tipo === "video" ? (
        <video
          ref={videoRef}
          src={elementos[indice].src}
          className="w-full h-full object-cover"
          autoPlay
          muted={!isAudioEnabled}
          playsInline
          onEnded={avanzar}
          onClick={(e) => {
            const clickX = e.nativeEvent.offsetX;
            const mitad = e.target.clientWidth / 2;
            clickX < mitad ? retroceder() : avanzar();
          }}
        />
      ) : (
        <img
          src={elementos[indice].src}
          className="w-full h-full object-cover"
          alt="Sorpresa"
          onClick={(e) => {
            const clickX = e.nativeEvent.offsetX;
            const mitad = e.target.clientWidth / 2;
            clickX < mitad ? retroceder() : avanzar();
          }}
        />
      )}

      {/* Botón de corazones */}
      <button
        onClick={lanzarLluviaCorazones}
        className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-500 transition"
      >
        <Heart size={24} />
      </button>
    </div>
  );
};

export default Sorpresa;
