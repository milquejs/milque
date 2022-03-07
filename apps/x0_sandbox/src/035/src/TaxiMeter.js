export function load(world) {
  let container = document.createElement('div');
  let vacancyButton = document.createElement('button');
  vacancyButton.textContent = 'VACANT';
  vacancyButton.style.backgroundColor = '#aa3333';
  vacancyButton.style.color = '#eeeeee';
  vacancyButton.style.border = '0.3em ridge #660000';
  vacancyButton.style.fontSize = '1.5em';
  vacancyButton.style.padding = '0.1em 0.5em';
  vacancyButton.style.position = 'absolute';
  vacancyButton.style.left = '0.2em';
  vacancyButton.style.bottom = '0.2em';
  container.appendChild(vacancyButton);

  let distanceMeter = document.createElement('label');
  distanceMeter.textContent = '0000 fare';
  distanceMeter.style.color = '#eeeeee';
  distanceMeter.style.fontSize = '1.5em';
  distanceMeter.style.position = 'absolute';
  distanceMeter.style.bottom = '0.2em';
  distanceMeter.style.left = '7em';
  container.appendChild(distanceMeter);
  world.display.appendChild(container);
}

export function update(dt, world) {}

export function render(ctx, world) {}
