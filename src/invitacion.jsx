import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Volume2, VolumeX, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Invitacion = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mensaje, setMensaje] = useState("Se viene la mejor fiesta del año...");
  const [modoAzul, setModoAzul] = useState(false);
  const [animarBrillo, setAnimarBrillo] = useState(false);
  const [mostrarZoom, setMostrarZoom] = useState(true);
  const [musica, setMusica] = useState(false);
  const [interaccionUsuario, setInteraccionUsuario] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(""); // Estado para la cuenta regresiva
  const [mensajeMusica, setMensajeMusica] = useState(""); // ✅ Agregado correctamente
  const [contadorFondo, setContadorFondo] = useState(0); // ✅ Contador de cambios de fon

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/musica_fiesta.mp3");
    audioRef.current.loop = true;

    const handleUserInteraction = () => {
      setInteraccionUsuario(true);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      audioRef.current.pause(); // Pausar la música si el componente se desmonta
      audioRef.current = null;
    };
  }, []);

  const toggleMusica = () => {
    if (!interaccionUsuario) return;

    if (musica) {
      audioRef.current.pause();
      setMensajeMusica("Música apagada");
    } else {
      audioRef.current.play().catch((error) =>
        console.error("Error al reproducir:", error)
      );
      setMensajeMusica("Música encendida");
    }

    setMusica(!musica);

    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => setMensajeMusica(""), 1000);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && musica) {
        audioRef.current.pause();
        setMusica(false); // Asegurar que el estado refleje la pausa
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [musica]);
  


  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            lanzarConfeti();
            setTimeout(() => setMostrarZoom(false), 500);
          }, 500);
          return 100;
        } else {
          // Normalizamos el índice para evitar valores incorrectos
          const indiceMensaje = Math.floor((prev / 100) * mensajesCarga.length);
          setMensaje(mensajesCarga[indiceMensaje]);
  
          return prev + 5;
        }
      });
    }, 200);
  
    return () => clearInterval(interval);
  }, []);
  

  // Cuenta regresiva
  useEffect(() => {
    const fechaEvento = new Date("2025-04-19T21:00:00"); // Cambia la fecha del evento

    const actualizarTiempo = () => {
      const ahora = new Date();
      const diferencia = fechaEvento - ahora;

      if (diferencia <= 0) {
        setTiempoRestante("🎉 ¡La fiesta ha comenzado! 🎉");
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
      const segundos = Math.floor((diferencia / 1000) % 60);

      setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    };

    actualizarTiempo();
    const interval = setInterval(actualizarTiempo, 1000);

    return () => clearInterval(interval);
  }, []);

  const mensajesCarga = [
    "Se viene la mejor fiesta del año...",
    "Es momento de activar los prohibidos...",
    "Hay que ponerse bien facheritos...",
    "Code dress: Elegante Sport"
  ];

  const lanzarConfeti = () => {
    let count = 200;
    let defaults = {
      origin: { y: 0.7 },
      colors: ["#A0A0A0", "#C0C0C0", "#1E90FF", "#87CEEB"],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 50, startVelocity: 55 });
    fire(0.2, { spread: 100 });
    fire(0.35, { spread: 150, decay: 0.9 });
    fire(0.1, { spread: 200, startVelocity: 35, decay: 0.92 });
    fire(0.1, { spread: 250, startVelocity: 45 });
  };


  const navigate = useNavigate(); // Agrega esta línea dentro de tu componente
  const toggleFondo = (e) => {
    if (e.target.tagName !== "DIV") return;
  
    setAnimarBrillo(true);
    setModoAzul(!modoAzul);
  
    setTimeout(() => {
      setAnimarBrillo(false);
    }, 500);
  
    lanzarConfeti();
  
    // ✅ Solo aumenta el contador, sin redirigir aún
    setContadorFondo((prev) => prev + 1);
  };
  useEffect(() => {
    if (contadorFondo >= 10) {
      navigate("/sorpresa"); // ✅ Ahora la redirección es segura
    }
  }, [contadorFondo]); // Se ejecuta solo cuando cambia contadorFondo  



  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      {loading ? (
        <div className="flex flex-col items-center">
          <p className="text-white text-lg mb-2 animate-fadeIn">{mensaje}</p>
          <div className="w-64 bg-gray-700 rounded-full h-4 overflow-hidden relative">
            <div
              className="bg-blue-500 h-full transition-all ease-in-out duration-200 animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div
          className={`relative glow w-[360px] h-[640px] md:w-[450px] md:h-[800px] lg:w-[540px] lg:h-[960px] bg-cover bg-center rounded-2xl shadow-lg cursor-pointer transition-all flex flex-col items-center justify-end pb-10 
          ${animarBrillo ? "animate-flash" : ""} 
          ${mostrarZoom ? "animate-zoomIn" : ""} `}
          style={{
            backgroundImage: `url('${
              modoAzul ? "/invitacion_black.png" : "/invitacion_blue.png"
            }')`
          }}
          onClick={toggleFondo}
        >

      {/* Botón de música */}
      <button
  onClick={toggleMusica}
  className="absolute top-4 right-4 bg-gray-300 text-black p-1.5 rounded-full shadow-md hover:bg-gray-400 transition transform hover:scale-110 
    w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-xs md:text-sm"
>
  {musica ? <Volume2 size={20} /> : <VolumeX size={20} />}
</button>


      {/* Mensaje temporal de música */}
      {mensajeMusica && (
        <div className="absolute top-16 right-4 bg-black text-white text-sm px-3 py-2 rounded-md shadow-lg animate-fadeIn">
          {mensajeMusica}
        </div>
      )}

          {/* Contenedor de botones */}
          <div className="flex flex-col items-center gap-3 absolute bottom-4.5 md:bottom-5 w-full px-4">
            <a
              href="https://wa.me/+5491125316881/?text=⚽%20Confirmo%20Asistencia%20⚽"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-slideUp glow bg-gray-300 text-black font-semibold text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-md hover:bg-gray-400 transition transform hover:scale-105 hover:shadow-lg w-auto min-w-[150px] max-w-[200px] md:w-64 text-center"
            >
              Toca para confirmar
            </a>

            {/* Enlace a Google Maps */}
            <a href="https://www.google.com/maps?q=Boulogne+Sur+Mer+1407+Libertad+Merlo" target="_blank" rel="noopener noreferrer" className="text-white underline text-xs md:text-sm lg:text-base text-center w-full max-w-[250px]">
              Ver ubicación en Google Maps
            </a>

{/* Cuenta regresiva */}
<p className="text-white text-sm md:text-base font-semibold bg-black bg-opacity-40 px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-md w-auto min-w-[150px] max-w-[200px] md:w-64 text-center transition-all ease-in-out duration-500 flex items-center justify-center gap-2">
  <Clock size={20} className="flex-shrink-0" />
  <span className="leading-none">{tiempoRestante}</span>
</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitacion;
