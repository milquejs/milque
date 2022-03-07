window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);

export function error(e) {
  if (e instanceof PromiseRejectionEvent) {
    window.alert(e.reason.stack);
  } else if (e instanceof ErrorEvent) {
    window.alert(e.error.stack);
  } else {
    window.alert(JSON.stringify(e));
  }
}
