document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envio do formulário
        setTimeout(() => {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Rolando para a mensagem de sucesso
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Opcional: Limpar o formulário
            form.reset();
        }, 1000);
    });
});