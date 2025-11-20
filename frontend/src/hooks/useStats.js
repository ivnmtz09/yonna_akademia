// /src/hooks/useStats.js - VERSIÓN MEJORADA
import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';
import { authService } from '../services/authService';

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener perfil del usuario (esto SÍ funciona)
      const profileData = await authService.getProfile();
      setProfile(profileData);
      
      // Calcular estadísticas básicas desde el perfil
      const basicStats = calculateBasicStats(profileData);
      setStats(basicStats);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular estadísticas básicas desde el perfil
  const calculateBasicStats = (profileData) => {
    const userXp = profileData?.usuario?.xp || profileData?.xp || 0;
    const userLevel = profileData?.usuario?.level || profileData?.level || 1;
    
    // Calcular progreso al siguiente nivel
    const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
    let nextLevelXp = 100;
    let currentLevelMinXp = 0;
    
    for (let i = 0; i < xpThresholds.length; i++) {
      if (userXp < xpThresholds[i]) {
        nextLevelXp = xpThresholds[i];
        currentLevelMinXp = xpThresholds[i-1] || 0;
        break;
      }
    }
    
    const xpInCurrentLevel = userXp - currentLevelMinXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelMinXp;
    const progressToNextLevel = xpNeededForNextLevel > 0 ? 
      (xpInCurrentLevel / xpNeededForNextLevel * 100) : 100;

    return {
      user_level: userLevel,
      user_xp: userXp,
      next_level_xp: nextLevelXp,
      progress_to_next_level: Math.round(progressToNextLevel * 10) / 10,
      weekly_xp_gain: 0,  // Estos necesitan el endpoint de stats
      monthly_xp_gain: 0,
      courses_completed: 0,
      quizzes_attempted: 0,
      quizzes_passed: 0,
      success_rate: 0,
      current_streak: 0,
      rank: 0
    };
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    profile,
    loading,
    error,
    refetch: fetchStats
  };
};