import React from 'react';

// Ícone de peso/balança
export const WeightIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C13.1 3 14 3.9 14 5S13.1 7 12 7 10 6.1 10 5 10.9 3 12 3M21 9V7L15 1H9L3 7V9H21M3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H3V19Z" fill={color}/>
  </svg>
);

// Ícone de gráfico/estatísticas
export const ChartIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16,11V3H8V7H2V21H22V11H16M10,5H14V19H10V5M4,9H8V19H4V9M20,13V19H16V13H20Z" fill={color}/>
  </svg>
);

// Ícone de alvo/meta
export const TargetIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" fill={color}/>
  </svg>
);

// Ícone de fogo/sequência
export const FireIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.76 3.23 13.58 3.45 13.42 3.68C12.29 5.4 12.29 7.6 13.42 9.32C13.79 9.9 14.24 10.42 14.76 10.94C15.13 11.35 15.47 11.78 15.77 12.26C16.07 12.74 16.24 13.25 16.24 13.8C16.24 14.6 15.89 15.33 15.25 15.87C14.61 16.41 13.81 16.7 13 16.7C12.19 16.7 11.39 16.41 10.75 15.87C10.11 15.33 9.76 14.6 9.76 13.8V13.8C9.76 13.25 9.93 12.74 10.23 12.26C10.53 11.78 10.87 11.35 11.24 10.94C11.76 10.42 12.21 9.9 12.58 9.32C13.71 7.6 13.71 5.4 12.58 3.68C12.42 3.45 12.24 3.23 12.05 3C13 4.85 12.67 7.26 11.18 8.72C10.54 9.35 9.78 9.78 9.11 10.38C8.85 10.64 8.57 10.9 8.34 11.2C6.93 12.69 6.93 15.31 8.34 16.8C9.59 18.03 11.3 18.7 13 18.7C14.7 18.7 16.41 18.03 17.66 16.8C19.07 15.31 19.07 12.69 17.66 11.2Z" fill={color}/>
  </svg>
);

// Ícone de dumbbell/exercício
export const DumbbellIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
  </svg>
);

// Ícone de pessoa/perfil
export const UserIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
  </svg>
);

// Ícone de calendário
export const CalendarIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" fill={color}/>
  </svg>
);

// Ícone de raio/energia
export const BoltIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11,21H9L13,3H15L11,21M12,13H15L11,21V15H8L12,7V13Z" fill={color}/>
  </svg>
);

// Ícone de troféu
export const TrophyIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5,9V7H6V9H5M9,7V9H8V7H9M11,13H13V15H11V13M15,9V7H16V9H15M19,7V9H18V7H19M12,2L13.09,8.26L22,9L17,14L18.18,22.73L12,19.27L5.82,22.73L7,14L2,9L10.91,8.26L12,2Z" fill={color}/>
  </svg>
);

// Ícone de meta/bandeira
export const FlagIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C14,14 14,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3Z" fill={color}/>
  </svg>
);

// Ícone de trending up/progresso
export const TrendingUpIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
  </svg>
);

// Ícone de close/fechar
export const CloseIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill={color}/>
  </svg>
);

// Ícone de coração/saúde
export const HeartIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" fill={color}/>
  </svg>
);

// Ícone de check/sucesso
export const CheckIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill={color}/>
  </svg>
);

// Ícone de lâmpada/dica
export const LightbulbIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" fill={color}/>
  </svg>
);

// Ícone de olho/visão
export const EyeIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" fill={color}/>
  </svg>
);

// Ícone de smartphone/móvel
export const PhoneIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" fill={color}/>
  </svg>
);

// Ícone de pessoas/colaboração
export const GroupIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C12.42,14 16,15.79 16,18V20H0V18C0,15.79 3.58,14 8,14Z" fill={color}/>
  </svg>
);

// Ícone de star/avaliação
export const StarIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" fill={color}/>
  </svg>
);
