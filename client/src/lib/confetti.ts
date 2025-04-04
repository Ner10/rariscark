// Helper function to create confetti effects
export function createConfetti() {
  const colors = ['#F59E0B', '#10B981', '#4F46E5', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  const confettiCount = 100;

  // Create container for all confetti pieces
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(confettiContainer);

  // Create and animate each confetti piece
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      
      // Random styling
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const isSquare = Math.random() > 0.5;
      
      // Apply styles
      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${left}vw`;
      confetti.style.top = '0';
      confetti.style.borderRadius = isSquare ? '0' : '50%';
      confetti.style.opacity = Math.random().toString();
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Apply animation
      confetti.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(100vh) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], 
        {
          duration: 3000 + Math.random() * 2000,
          easing: 'cubic-bezier(0.37, 0, 0.63, 1)'
        }
      );
      
      // Add to container and remove after animation
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }, Math.random() * 500); // Stagger the confetti creation
  }
  
  // Remove the container after all confetti should be gone
  setTimeout(() => {
    confettiContainer.remove();
  }, 6000);
}

// Export a function to create confetti and show winner modal
export function celebrateWinner(prize: string, onClose?: () => void) {
  createConfetti();
  
  // Create and display winner modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
  modal.style.animation = 'fadeIn 0.3s ease-out forwards';
  
  modal.innerHTML = `
    <div class="bg-white text-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all mx-4 animate-in fade-in-50 slide-in-from-bottom-10">
      <div class="text-center">
        <div class="text-5xl text-amber-500 mb-4">
          <i class="fas fa-trophy"></i>
        </div>
        <h2 class="text-3xl font-bold mb-2">Congratulations!</h2>
        <p class="text-xl mb-6">You've won: <span class="font-bold">${prize}</span></p>
        <p class="mb-8 text-gray-600">Your prize has been recorded. Thank you for playing!</p>
        <button id="close-modal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listener to close button
  const closeButton = modal.querySelector('#close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        modal.remove();
        if (onClose) onClose();
      }, 300);
    });
  }
  
  // Auto close after 5 seconds
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
  }, 5000);
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
