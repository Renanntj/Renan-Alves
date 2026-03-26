(function () {
    'use strict';

    /* ── Minha inicialização do EmailJS ── */
    emailjs.init({ publicKey: 'zuFdurFQCGvUHG4J5' });

    /* ── Atualizo o ano do meu rodapé automaticamente ── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Controlo o estado da minha barra de navegação ao rolar ── */
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
        if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ── Lógica do meu menu mobile (drawer) ── */
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');

    function toggleDrawer(open) {
        if (!burger || !drawer) return;
        burger.classList.toggle('open', open);
        drawer.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (burger) {
        burger.addEventListener('click', function () {
            toggleDrawer(!drawer.classList.contains('open'));
        });
    }

    document.querySelectorAll('[data-drawer-link]').forEach(function (link) {
        link.addEventListener('click', function () { toggleDrawer(false); });
    });

    /* ── Destaco o link ativo na navegação ── */
    // Ajustei aqui para usar as classes .nav__link e .drawer-link do seu HTML
    var navLinks = document.querySelectorAll('.nav__link, .drawer-link');

    document.querySelectorAll('section[id]').forEach(function (section) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    // Verifico se o href do link bate com o ID da seção atual
                    link.classList.toggle('active', link.getAttribute('href') === '#' + section.id);
                });
            });
        }, { threshold: 0.35 }).observe(section);
    });

    /* ── Faço os elementos aparecerem com fade (reveal) ── */
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObs.observe(el);
    });

    /* ── Lógica do meu formulário de contato ── */
    var form = document.getElementById('contactForm');
    var feedback = document.getElementById('formFeedback');
    var nameInput = document.getElementById('fname');
    var emailInput = document.getElementById('femail');
    var msgInput = document.getElementById('fmessage');

    function setError(input, errorId, show) {
        if (!input) return;
        input.classList.toggle('error', show);
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.classList.toggle('visible', show);
    }

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function showFeedback(type, msg) {
        if (!feedback) return;
        feedback.className = 'form__feedback ' + type;
        feedback.textContent = msg;
    }

    if (nameInput) nameInput.addEventListener('input', function () { if (nameInput.value.trim()) setError(nameInput, 'nameError', false); });
    if (emailInput) emailInput.addEventListener('input', function () { if (isValidEmail(emailInput.value)) setError(emailInput, 'emailError', false); });
    if (msgInput) msgInput.addEventListener('input', function () { if (msgInput.value.trim()) setError(msgInput, 'messageError', false); });

    /* ── Minha função de envio integrada com o EmailJS ── */
    function sendForm(name, email, message) {
        showFeedback('info', 'Enviando mensagem...');

        var serviceID = 'service_niav6vj';
        var templateID = 'template_nwfcgki'; 

        var templateParams = {
            name: name,
            email: email,
            message: message
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function () {
                showFeedback('success', 'Mensagem enviada com sucesso!');
                form.reset();
            }, function (error) {
                showFeedback('error-msg', 'Erro ao enviar. Tente novamente.');
                console.error('EmailJS Error:', error);
            });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = nameInput.value.trim();
            var email = emailInput.value.trim();
            var message = msgInput.value.trim();
            var valid = true;

            setError(nameInput, 'nameError', false);
            setError(emailInput, 'emailError', false);
            setError(msgInput, 'messageError', false);

            if (!name) { setError(nameInput, 'nameError', true); valid = false; }
            if (!isValidEmail(email)) { setError(emailInput, 'emailError', true); valid = false; }
            if (!message) { setError(msgInput, 'messageError', true); valid = false; }

            if (valid) sendForm(name, email, message);
        });
    }

}());