
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Home = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    
    localStorage.setItem('playerName', name);
    navigate('/game');
  };

  return (
    <Layout fullHeight>
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <h1 className="brutalist-title mb-8 text-center">
          ¿PUEDES REPLICAR EL COLOR EXACTO?
        </h1>
        
        <div className="max-w-xl w-full space-y-8">
          <div className="space-y-4">
            <label htmlFor="playerName" className="text-lg uppercase">
              INTRODUCE TU NOMBRE:
            </label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
              className={`bg-transparent border-white px-4 py-3 text-xl ${
                nameError ? 'border-destructive' : ''
              }`}
              placeholder="TU NOMBRE AQUÍ"
            />
            {nameError && (
              <p className="text-destructive text-sm">
                Por favor, introduce tu nombre para empezar.
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleStart}
            className="brutalist-button w-full mt-8"
          >
            INICIAR JUEGO
          </Button>
          
          <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
            5 RONDAS. 10 SEGUNDOS POR COLOR. ¿TIENES BUEN OJO O SOLO CREES QUE LO TIENES?
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
