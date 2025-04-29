import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 0. CONFIGURAÇÃO DO SUPABASE
const supabase = createClient(
    'https://lrmhohppvcbdgecczjus.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybWhvaHBwdmNiZGdlY2N6anVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDEzNjMsImV4cCI6MjA2MTUxNzM2M30.tkRlxE1eYFdM9F8O327CLMeI-N44T_trc130Otqtg40'
);

document.addEventListener('DOMContentLoaded', function() {
    // 1. CAPTURAR PARÂMETRO DO PARCEIRO DA URL
    const urlParams = new URLSearchParams(window.location.search);
    const parceiroParam = urlParams.get('parceiro');
    let parceiroNome = 'Anônimo';

    if (parceiroParam) {
        try {
            parceiroNome = decodeURIComponent(parceiroParam);
            document.getElementById('parceiro').value = parceiroNome;
            
            const parceiroInfo = document.createElement('div');
            parceiroInfo.className = 'parceiro-info';
            parceiroInfo.innerHTML = `<i class="fas fa-handshake"></i> Indicado por: <strong>${parceiroNome}</strong>`;
            document.querySelector('.welcome-message').appendChild(parceiroInfo);
            
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

    // 4. CONFIGURAÇÃO DO MODAL
    const lgpdLink = document.getElementById('lgpd-link');
    const lgpdModal = document.getElementById('lgpd-modal');
    const closeModal = document.querySelector('.close-modal');

    // 5. EVENT LISTENERS
    lgpdLink.addEventListener('click', (e) => {
        e.preventDefault();
        lgpdModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        lgpdModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === lgpdModal) lgpdModal.style.display = 'none';
    });

    // 6. FUNÇÕES DE VALIDAÇÃO
    const validations = {
        nome: function() {
            const input = document.getElementById('nome');
            const error = document.getElementById('nome-error');
            const value = input.value.trim();
            
            if (!value || value.split(' ').length < 2) {
                showError(input, error, 'Nome completo obrigatório');
                return false;
            }
            removeError(input, error);
            return true;
        },
        telefone: function() {
            const input = document.getElementById('telefone');
            const error = document.getElementById('telefone-error');
            const value = input.value.replace(/\D/g, '');
            
            if (!value || value.length < 11) {
                showError(input, error, 'Telefone inválido');
                return false;
            }
            removeError(input, error);
            return true;
        },
        cidade: function() {
            const input = document.getElementById('cidade');
            const error = document.getElementById('cidade-error');
            
            if (!input.value.trim()) {
                showError(input, error, 'Cidade obrigatória');
                return false;
            }
            removeError(input, error);
            return true;
        },
        email: function() {
            const input = document.getElementById('email');
            const error = document.getElementById('email-error');
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!input.value.trim()) {
                showError(input, error, 'E-mail obrigatório');
                return false;
            }
            if (!regex.test(input.value)) {
                showError(input, error, 'E-mail inválido');
                return false;
            }
            removeError(input, error);
            return true;
        },
        conheceu: function() {
            const checked = document.querySelector('input[name="conheceu"]:checked');
            const error = document.getElementById('conheceu-error');
            
            if (!checked) {
                showError(document.querySelector('.radio-container'), error, 'Selecione uma opção');
                return false;
            }
            removeError(document.querySelector('.radio-container'), error);
            return true;
        },
        contato: function() {
            const checked = document.querySelector('input[name="contato"]:checked');
            const error = document.getElementById('contato-error');
            
            if (!checked) {
                showError(document.querySelector('.radio-container'), error, 'Selecione uma opção');
                return false;
            }
            removeError(document.querySelector('.radio-container'), error);
            return true;
        },
        lgpd: function() {
            const input = document.getElementById('lgpd');
            const error = document.getElementById('lgpd-error');
            
            if (!input.checked) {
                showError(input, error, 'Aceite a política de privacidade');
                return false;
            }
            removeError(input, error);
            return true;
        }
    };

    // 7. FUNÇÕES AUXILIARES
    function showError(input, errorElement, message) {
        input?.classList?.add('has-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function removeError(input, errorElement) {
        input?.classList?.remove('has-error');
        if (errorElement) errorElement.style.display = 'none';
    }

    // 8. ENVIO DO FORMULÁRIO
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar todos os campos
        const isValid = Object.values(validations).every(fn => fn());
        
        if (!isValid) {
            const firstError = document.querySelector('.has-error');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Configurar loading
        submitBtn.style.display = 'none';
        loadingSpinner.style.display = 'block';

        try {
            // Montar objeto de dados
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                telefone: document.getElementById('telefone').value,
                cidade: document.getElementById('cidade').value.trim(),
                email: document.getElementById('email').value.trim(),
                conheceu: document.querySelector('input[name="conheceu"]:checked').value,
                contato: document.querySelector('input[name="contato"]:checked').value,
                plano_existente: document.getElementById('plano').value.trim() || null,
                observacao: document.getElementById('observacao').value.trim() || null,
                parceiro: parceiroNome,
                lgpd_aceito: document.getElementById('lgpd').checked,
                status: 'novo'
            };

            // Enviar para o Supabase
            const { error } = await supabase
                .from('leads')
                .insert([formData]);

            if (error) throw error;

            // Feedback e reset
            alert('Cadastro realizado com sucesso!');
            form.reset();
            
        } catch (error) {
            console.error('Erro no envio:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            submitBtn.style.display = 'inline-flex';
            loadingSpinner.style.display = 'none';
        }
    });

    // 9. VALIDAÇÃO EM TEMPO REAL
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.name && validations[input.name]) validations[input.name]();
        });
    });

    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            if (input.name === 'conheceu') validations.conheceu();
            if (input.name === 'contato') validations.contato();
            if (input.name === 'lgpd') validations.lgpd();
        });
    });
});