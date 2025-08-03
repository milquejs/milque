export default /* css */ `
:host {
  display: inline-block;
  flex: 1;
  --width: 300px;
  --height: 150px;
}
:host([scaling="noscale"]) {
  width: var(--width);
  height: var(--height);
}
:host([sizing="viewport"]) {
    position: fixed;
    top: 0;
    left: 0;
}
.container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.innerContainer {
  display: flex;
  flex-direction: column;
}
.padding {
  flex: 1;
}`;
