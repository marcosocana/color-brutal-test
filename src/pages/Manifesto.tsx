
import React from 'react';
import Layout from '../components/Layout';

const Manifesto = () => {
  return (
    <Layout>
      <div className="brutalist-container my-12 max-w-3xl mx-auto">
        <h1 className="brutalist-title mb-12 text-center">MANIFIESTO</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-xl md:text-2xl leading-relaxed">
            Esta web celebra el ojo entrenado, el amor por el detalle y la obsesión cromática. 
            No es solo un juego: es una prueba de fuego para quienes dicen tener buen gusto. 
            Si aciertas los colores, enhorabuena. Si no… quizá deberías replantearte tu carrera. 
            Bienvenido a la prueba del color.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Manifesto;
