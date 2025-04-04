// Import sound functions from our sounds.ts utility
import { playWinSound, playClickSound } from './sounds';

// Re-export for backward compatibility
export { playClickSound };

// Helper function to create confetti effects with enhanced animation
export function createConfetti() {
  // Updated color palette - replaced purple tones with red shades
  const colors = ['#F59E0B', '#10B981', '#DC2626', '#EF4444', '#B91C1C', '#7F1D1D', '#06B6D4', '#84CC16'];
  const confettiCount = 150; // Increased count for more vibrant effect

  // Play win sound
  playWinSound();

  // Create container for all confetti pieces
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(confettiContainer);

  // Create different confetti shapes
  const shapes = [
    'circle',
    'square',
    'triangle',
    'star'
  ];

  // Create and animate each confetti piece
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      
      // Random styling
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 15 + 5; // Larger size range
      const left = Math.random() * 100;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Apply styles
      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${left}vw`;
      confetti.style.top = '0';
      
      // Apply different shapes
      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
      } else if (shape === 'square') {
        confetti.style.borderRadius = '0';
      } else if (shape === 'triangle') {
        confetti.style.backgroundColor = 'transparent';
        confetti.style.width = '0';
        confetti.style.height = '0';
        confetti.style.borderLeft = `${size/2}px solid transparent`;
        confetti.style.borderRight = `${size/2}px solid transparent`;
        confetti.style.borderBottom = `${size}px solid ${color}`;
      } else if (shape === 'star') {
        confetti.style.backgroundColor = 'transparent';
        confetti.style.boxShadow = `0 0 ${size/4}px ${size/8}px ${color}`;
        confetti.style.borderRadius = '50%';
      }
      
      // Random spin and wobble for more dynamic movement
      confetti.style.opacity = Math.random().toString();
      confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.5})`;
      
      // More complex animation path
      const startX = 0;
      const startY = 0;
      const endX = (Math.random() - 0.5) * 150; // Random horizontal drift
      const endY = window.innerHeight * 1.2;
      const midX = startX + ((Math.random() - 0.5) * 200); // Curve control point
      
      // Apply animation with more dynamic movement
      confetti.animate(
        [
          { 
            transform: `translate(${startX}px, ${startY}px) rotate(0deg)`, 
            opacity: 1 
          },
          { 
            transform: `translate(${midX}px, ${endY/3}px) rotate(${180 + Math.random() * 180}deg)`, 
            opacity: 0.8 
          },
          { 
            transform: `translate(${endX}px, ${endY}px) rotate(${360 + Math.random() * 360}deg)`, 
            opacity: 0 
          }
        ], 
        {
          duration: 3000 + Math.random() * 3000,
          easing: 'cubic-bezier(0.11, 0.67, 0.43, 0.98)'
        }
      );
      
      // Add to container and remove after animation
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 6000);
    }, Math.random() * 800); // Longer stagger for more randomized effect
  }
  
  // Remove the container after all confetti should be gone
  setTimeout(() => {
    confettiContainer.remove();
  }, 7000);
}

// Export a function to create confetti and show winner modal with countdown
export function celebrateWinner(prize: string, onClose?: () => void) {
  // Start confetti animation immediately
  createConfetti();
  
  // Create modal element but don't add to DOM yet
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
  modal.style.animation = 'fadeIn 0.3s ease-out forwards';
  
  // The prize popup is already shown after a 3-second delay by the wheel component
  // so we don't need an additional delay here
  
  const timeoutDuration = 5; // 5 seconds countdown
  
  modal.innerHTML = `
    <div class="bg-white text-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all mx-4 animate-in fade-in-50 slide-in-from-bottom-10">
      <div class="text-center">
        <div class="text-5xl text-amber-500 mb-4">
          <i class="fas fa-trophy"></i>
        </div>
        <h2 class="text-3xl font-bold mb-2">Tebrikler!</h2>
        <p class="text-xl mb-6">Kazandınız: <span class="font-bold">${prize}</span></p>
        <p class="mb-4 text-gray-600">Ödülünüz kaydedildi. Oynadığınız için teşekkürler!</p>
        
        <div class="countdown-wrapper mb-6">
          <div class="countdown-ring relative mx-auto w-20 h-20">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle class="text-gray-200" stroke-width="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
              <circle id="countdown-circle" class="text-red-600" stroke-width="8" stroke-linecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
            </svg>
            <span id="countdown-timer" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-red-600">${timeoutDuration}</span>
          </div>
        </div>
        
        <button id="close-modal" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg">
          Kapat
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Get circle element for countdown animation
  const circle = modal.querySelector('#countdown-circle') as SVGCircleElement;
  const timer = modal.querySelector('#countdown-timer') as HTMLElement;
  
  // Set up countdown animation
  if (circle) {
    // Calculate circle properties
    const radius = parseInt(circle.getAttribute('r') || '42');
    const circumference = 2 * Math.PI * radius;
    
    // Set initial dash properties
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = '0';
    
    // Animate the countdown
    let timeLeft = timeoutDuration;
    const countdownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
      } else {
        // Update timer text
        if (timer) {
          timer.textContent = timeLeft.toString();
        }
        
        // Calculate new stroke dash offset
        const offset = circumference - (timeLeft / timeoutDuration) * circumference;
        circle.style.strokeDashoffset = offset.toString();
      }
    }, 1000);
  }
  
  // Add event listener to close button
  const closeButton = modal.querySelector('#close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      playClickSound();
      modal.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        modal.remove();
        if (onClose) onClose();
      }, 300);
    });
  }
  
  // Auto close after countdown time
  setTimeout(() => {
    if (document.body.contains(modal)) {
      modal.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (document.body.contains(modal)) {
          modal.remove();
          if (onClose) onClose();
        }
      }, 300);
    }
  }, timeoutDuration * 1000);
}

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
