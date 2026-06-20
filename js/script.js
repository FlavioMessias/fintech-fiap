document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarToggle = document.getElementById('sidebarToggle');

  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeText');

  const entryForm = document.getElementById('entryForm');
  const valorInput = document.getElementById('valor');
  const dataInput = document.getElementById('data');
  const toast = document.getElementById('toast');

  /* ── Utilidades ─────────────────────────────────────── */
  function getTodayISODate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function setTodayDate() {
    if (dataInput) {
      dataInput.value = getTodayISODate();
    }
  }

  /* ── Sidebar Mobile ─────────────────────────────────── */
  function openSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');

    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');

    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleSidebar() {
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('translate-x-0');

    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);

    overlay.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        closeSidebar();
      }
    });
  }

window.addEventListener('resize', function () {
  if (window.innerWidth >= 1024) {
    closeSidebar();
  }
});

  /* ── Tema Claro/Escuro ───────────────────────────────── */
  function isLightTheme() {
    return root.classList.contains('light-theme');
  }

  function updateThemeButton() {
    if (!themeToggle || !themeText) return;

    const lightThemeActive = isLightTheme();

    themeText.textContent = lightThemeActive ? 'Tema escuro' : 'Tema claro';
    themeToggle.setAttribute('aria-pressed', String(lightThemeActive));
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }

    localStorage.setItem('theme', theme);
    updateThemeButton();
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(isLightTheme() ? 'dark' : 'light');
    });
  }

  /* ── Máscara de Moeda ────────────────────────────────── */
  function formatCentsToBRL(cents) {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');

    if (value === '') {
      input.value = '';
      return;
    }

    input.value = formatCentsToBRL(Number(value));
  }

  function parsePastedCurrency(text) {
    const normalizedText = text.trim();

    if (normalizedText === '') return null;

    const hasCurrencyFormat = /R\$|,|\./.test(normalizedText);

    if (!hasCurrencyFormat && /^\d+$/.test(normalizedText)) {
      return Number(normalizedText) * 100;
    }

    const numericText = normalizedText
      .replace(/R\$/g, '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    const numberValue = Number(numericText.replace(/[^0-9.]/g, ''));

    if (Number.isNaN(numberValue)) return null;

    return Math.round(numberValue * 100);
  }

  if (valorInput) {
    valorInput.addEventListener('input', function () {
      formatCurrencyInput(valorInput);
    });

    valorInput.addEventListener('paste', function (event) {
      event.preventDefault();

      const pastedText = event.clipboardData.getData('text');
      const pastedCents = parsePastedCurrency(pastedText);

      if (pastedCents === null) {
        valorInput.value = '';
        return;
      }

      valorInput.value = formatCentsToBRL(pastedCents);
    });
  }

  /* ── Toast de Sucesso ────────────────────────────────── */
  let toastTimeout;

  function showToast() {
    if (!toast) return;

    clearTimeout(toastTimeout);
    toast.classList.add('show');

    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  /* ── Submissão do Formulário ─────────────────────────── */
  if (entryForm) {
    entryForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!entryForm.checkValidity()) {
        entryForm.reportValidity();
        return;
      }

      showToast();
      entryForm.reset();
      setTodayDate();
    });
  }

  setTodayDate();
  updateThemeButton();
});
