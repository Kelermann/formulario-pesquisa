document.addEventListener('DOMContentLoaded', function() {
    // 1. CAPTURAR PARÂMETRO DO PARCEIRO DA URL
    const urlParams = new URLSearchParams(window.location.search);
    const parceiroParam = urlParams.get('parceiro');

    if (parceiroParam) {
        try {
            const parceiroNome = decodeURIComponent(parceiroParam);
            document.getElementById('parceiro').value = parceiroNome;
            
            // Mostrar visualmente qual parceiro está sendo usado
            const parceiroInfo = document.createElement('div');
            parceiroInfo.className = 'parceiro-info';
            parceiroInfo.innerHTML = `<i class="fas fa-handshake"></i> Indicado por: <strong>${parceiroNome}</strong>`;
            document.querySelector('.welcome-message').appendChild(parceiroInfo);
            
            // Marcar automaticamente "Indicação" como opção selecionada
            document.getElementById('indicacao').checked = true;
        } catch (e) {
            console.error("Erro ao processar parâmetro do parceiro:", e);
        }
    }

    // 2. MÁSCARAS PARA OS CAMPOS
    $('#telefone').mask('(00) 00000-0000');
    
    // 3. ELEMENTOS DO FORMULÁRIO
    const form = document.getElementById('uniclanForm');
    const submitBtn = document.getElementById('submit-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    // 4. ELEMENTOS DO MODAL
    const lgpdLink = document.getElementById('lgpd-link');
    const lgpdModal = document.getElementById('lgpd-modal');
    const closeModal = document.querySelector('.close-modal');

    // 5. ABRIR MODAL LGPD
    lgpdLink.addEventListener('click', function(e) {
        e.preventDefault();
        lgpdModal.style.display = 'block';
    });

    // 6. FECHAR MODAL LGPD
    closeModal.addEventListener('click', function() {
        lgpdModal.style.display = 'none';
    });

    // 7. FECHAR MODAL AO CLICAR FORA
    window.addEventListener('click', function(e) {
        if (e.target === lgpdModal) {
            lgpdModal.style.display = 'none';
        }
    });

    // 8. VALIDAÇÃO EM TEMPO REAL
    form.addEventListener('input', function(e) {
        const input = e.target;
        if (input.name === 'nome') validateNome();
        if (input.name === 'telefone') validateTelefone();
        if (input.name === 'cidade') validateCidade();
        if (input.name === 'email') validateEmail();
    });

    // 9. FUNÇÕES DE VALIDAÇÃO
    function validateNome() {
        const nomeInput = document.getElementById('nome');
        const errorElement = document.getElementById('nome-error');
        
        if (nomeInput.value.trim() === '') {
            showError(nomeInput, errorElement, 'Por favor, informe seu nome completo');
            return false;
        } else if (nomeInput.value.trim().split(' ').length < 2) {
            showError(nomeInput, errorElement, 'Por favor, informe seu nome completo');
            return false;
        } else {
            removeError(nomeInput, errorElement);
            return true;
        }
    }

    function validateTelefone() {
        const telefoneInput = document.getElementById('telefone');
        const errorElement = document.getElementById('telefone-error');
        const telefone = telefoneInput.value.replace(/\D/g, '');
        
        if (telefoneInput.value.trim() === '') {
            showError(telefoneInput, errorElement, 'Por favor, informe seu telefone');
            return false;
        } else if (telefone.length < 11) {
            showError(telefoneInput, errorElement, 'Por favor, informe um telefone válido');
            return false;
        } else {
            removeError(telefoneInput, errorElement);
            return true;
        }
    }

    function validateCidade() {
        const cidadeInput = document.getElementById('cidade');
        const errorElement = document.getElementById('cidade-error');
        
        if (cidadeInput.value.trim() === '') {
            showError(cidadeInput, errorElement, 'Por favor, informe sua cidade');
            return false;
        } else {
            removeError(cidadeInput, errorElement);
            return true;
        }
    }

    function validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() === '') {
            showError(emailInput, errorElement, 'Por favor, informe seu e-mail');
            return false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, errorElement, 'Por favor, informe um e-mail válido');
            return false;
        } else {
            removeError(emailInput, errorElement);
            return true;
        }
    }

    function validateConheceu() {
        const conheceuSelected = document.querySelector('input[name="conheceu"]:checked');
        const errorElement = document.getElementById('conheceu-error');
        const radioGroup = document.querySelector('.radio-container[name="conheceu"]');
        
        if (!conheceuSelected) {
            showError(radioGroup, errorElement, 'Por favor, selecione uma opção');
            return false;
        } else {
            removeError(radioGroup, errorElement);
            return true;
        }
    }

    function validateContato() {
        const contatoSelected = document.querySelector('input[name="contato"]:checked');
        const errorElement = document.getElementById('contato-error');
        const radioGroup = document.querySelector('.radio-container[name="contato"]');
        
        if (!contatoSelected) {
            showError(radioGroup, errorElement, 'Por favor, selecione uma opção');
            return false;
        } else {
            removeError(radioGroup, errorElement);
            return true;
        }
    }

    function validateLGPD() {
        const lgpdCheckbox = document.getElementById('lgpd');
        const errorElement = document.getElementById('lgpd-error');
        
        if (!lgpdCheckbox.checked) {
            showError(lgpdCheckbox, errorElement, 'Por favor, aceite a política de privacidade');
            return false;
        } else {
            removeError(lgpdCheckbox, errorElement);
            return true;
        }
    }

    // 10. FUNÇÕES AUXILIARES PARA MOSTRAR/REMOVER ERROS
    function showError(input, errorElement, message) {
        input.classList.add('has-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function removeError(input, errorElement) {
        input.classList.remove('has-error');
        errorElement.style.display = 'none';
    }

    // 11. ENVIO DO FORMULÁRIO
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos os campos
        const isNomeValid = validateNome();
        const isTelefoneValid = validateTelefone();
        const isCidadeValid = validateCidade();
        const isEmailValid = validateEmail();
        const isConheceuValid = validateConheceu();
        const isContatoValid = validateContato();
        const isLGPDAccepted = validateLGPD();
        
        if (isNomeValid && isTelefoneValid && isCidadeValid && isEmailValid && 
            isConheceuValid && isContatoValid && isLGPDAccepted) {
            
            // Mostrar loading
            submitBtn.style.display = 'none';
            loadingSpinner.style.display = 'block';
	      
	(async function () {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');

    const supabase = createClient(
	 'https://lrmhohppvcbdgecczjus.supabase.co',
	 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybWhvaHBwdmNiZGdlY2N6anVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDEzNjMsImV4cCI6MjA2MTUxNzM2M30.tkRlxE1eYFdM9F8O327CLMeI-N44T_trc130Otqtg40'
      );

    const formData = new FormData(form);

    const { error } = await supabase.from('leads').insert([{
        nome: formData.get('nome'),
        telefone: formData.get('telefone'),
        cidade: formData.get('cidade'),
        email: formData.get('email'),
        conheceu: formData.get('conheceu'),
        contato: formData.get('contato'),
        parceiro: parceiroParam || 'anonimo',
        status: 'novo'
    }]);

    submitBtn.style.display = 'inline-flex';
    loadingSpinner.style.display = 'none';

    if (error) {
        alert('Erro ao enviar: ' + error.message);
    } else {
        form.reset();
        alert('Formulário enviado com sucesso!');
    }
})();



      

        } else {
            // Rolar até o primeiro erro
            const firstError = document.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // 12. VALIDAÇÃO INICIAL DOS CAMPOS AO SAIR DO CAMPO
    document.getElementById('nome').addEventListener('blur', validateNome);
    document.getElementById('telefone').addEventListener('blur', validateTelefone);
    document.getElementById('cidade').addEventListener('blur', validateCidade);
    document.getElementById('email').addEventListener('blur', validateEmail);

    // 13. VALIDAÇÃO DOS RADIOS
    document.querySelectorAll('input[name="conheceu"]').forEach(radio => {
        radio.addEventListener('change', validateConheceu);
    });

    document.querySelectorAll('input[name="contato"]').forEach(radio => {
        radio.addEventListener('change', validateContato);
    });

    // 14. VALIDAÇÃO DO CHECKBOX LGPD
    document.getElementById('lgpd').addEventListener('change', validateLGPD);
});