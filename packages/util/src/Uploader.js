export async function uploadFile(accept = [], multiple = false) {
  return new Promise((resolve, reject) => {
    const element = document.createElement('input');
    element.addEventListener('change', (e) => {
      if (multiple) {
        resolve(e.target.files);
      } else {
        resolve(e.target.files[0]);
      }
    });
    element.type = 'file';
    element.accept = accept.join(',');
    element.style.display = 'none';
    element.toggleAttribute('multiple', multiple);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
}
