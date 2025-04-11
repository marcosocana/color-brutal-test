
import React from 'react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="brutalist-container my-12 max-w-3xl mx-auto">
        <h1 className="brutalist-title mb-12 text-center">ABOUT</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-xl md:text-2xl leading-relaxed">
            Un experimento interactivo creado por Marcos Ocaña. Inspirado por el brutalismo 
            digital y los test de percepción visual, esta web mezcla diseño y juego en una 
            experiencia que pone a prueba tu capacidad para ver (de verdad) los colores. 
            Todos los derechos reservados, pero los errores hexadecimales… son tuyos.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
