const PATCH_VERSION = '1.0.1';

function repairModalInteractions(root = document) {
  root.querySelectorAll('.modal-sheet[onclick]').forEach((sheet) => {
    sheet.removeAttribute('onclick');
  });

  root.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    if (backdrop.dataset.interactionPatch === PATCH_VERSION) return;

    backdrop.dataset.interactionPatch = PATCH_VERSION;
    backdrop.removeAttribute('data-action');
    backdrop.addEventListener('click', (event) => {
      if (event.target !== backdrop) return;
      backdrop.querySelector('[data-action="close-modal"]')?.click();
    });
  });

  root.querySelectorAll('.freezer-card__main:not([data-action])').forEach((button) => {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    button.title = 'Для этой заготовки рецепт пока не привязан';
  });
}

const observer = new MutationObserver(() => repairModalInteractions());
observer.observe(document.documentElement, { childList: true, subtree: true });
repairModalInteractions();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => registration.update()).catch(() => {});

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const reloadKey = `kitchen-dream-sw-${PATCH_VERSION}`;
    if (sessionStorage.getItem(reloadKey)) return;
    sessionStorage.setItem(reloadKey, 'reloaded');
    location.reload();
  });
}
