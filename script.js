
const circle = document.querySelectorAll(".circle");
const tangent = document.querySelector(".tangent");

[...circle].map((el) => addListener(el, selectSmallCircleWithNumber));

document.addEventListener("keyup", handleKeyUp, true);

let root = document.documentElement;

function addListener(el, fn) {
      el.onclick = fn;
}

let lastClick = "";

let rotation = {
      p1degree: 0,
      p2degree: 0
}

function handleKeyUp(e) {
      if (e.keyCode == '37') {
            // left arrow
            if (rotation.p1degree + rotation.p2degree) {
                  decreaseDegree(45);
            }

      }
      else if (e.keyCode == '39') {
            // right arrow
            increaseDegree(-45);
      }
}

function increaseDegree(v) {
      if (+rotation.p1degree === -180) {
            //rotate p2
            if (rotation.p2degree === -135) {
                  rotate(-180, "p2");
                  circleBorderWithDegree(-180, "p2");
                  pushLabelWithDeg(-180, "p2");
                  let pies = document.querySelectorAll(".pie");
                  setTimeout(() => {
                        root.style.setProperty('--p1-degree', '-360deg');

                        root.style.setProperty('--h1', '12');
                        root.style.setProperty('--h2', '10');

                        root.style.setProperty('--p2-degree', '-540deg');
                        root.style.setProperty('--p1-degree', '-405deg');
                        [...pies].map(pie => {
                              pie.style.setProperty("transition-duration", "0ms")
                        })
                        circleBorderWithDegree(-45, "p1");
                        pushLabelWithDeg(-45, "p1");
                  }, 190)

                  setTimeout(() => {
                        rotation = {
                              p1degree: -45,
                              p2degree: 0
                        }
                        root.style.setProperty('--p1-degree', '0deg');
                        root.style.setProperty('--p2-degree', '0deg');
                  }, 200);
                  setTimeout(() => {
                        [...pies].map(pie => {
                              pie.style.setProperty("transition-duration", "200ms")
                        })
                        root.style.setProperty('--p1-degree', '-45deg');
                  }, 350)

            }
            if (rotation.p2degree > -135) {
                  rotation.p2degree += v;
                  rotate(rotation.p2degree, "p2");
                  circleBorderWithDegree(rotation.p2degree, "p2");
                  pushLabelWithDeg(rotation.p2degree, "p2");
            }
      } else {
            //rotate p1
            rotation.p1degree += v;
            rotate(rotation.p1degree, "p1");
            circleBorderWithDegree(rotation.p1degree, "p1");
            pushLabelWithDeg(rotation.p1degree, "p1");
      }
}

function decreaseDegree(v) {
      if (+rotation.p2degree === 0) {
            //rotate p1
            rotation.p1degree += v
            rotate(rotation.p1degree, "p1");
            circleBorderWithDegree(rotation.p1degree, "p1");
            pushLabelWithDeg(rotation.p1degree, "p1");

            if (rotation.p1degree === 0) {
                  setProperty(tangent, "border-color", "#CCCCCC");
            }
      } else {
            //rotate p2
            rotation.p2degree += v;
            rotate(rotation.p2degree, "p2");
            circleBorderWithDegree(rotation.p2degree, "p2");
            pushLabelWithDeg(rotation.p2degree, "p2");
      }
}

function selectSmallCircleWithNumber(e) {
      const degree = e.target.dataset.degree;
      const type = e.target.dataset.type;
      rotate(degree, type);
      changeBorderColor(e.target);
      pushLabel(e.target.textContent);
}

function rotate(degree, type) {
      setProperty(tangent, "border-color", "var(--light-blue)");

      //rotate half pie p1
      if (type === "p1") {
            root.style.setProperty('--p2-degree', '0deg');
            rotation.p2degree = 0;
            function playZindex() {
                  root.style.setProperty('--h1', '12'); //h1 is z-index for half pie  
                  root.style.setProperty('--h2', '10'); //h2 is z-index for another half pie
            }
            if (lastClick = "p2" && degree === "-180") {
                  setTimeout(() => {
                        playZindex();
                  }, 200);
            } else {
                  playZindex();
            }
            rotation.p1degree = +degree;
            root.style.setProperty('--p1-degree', `${degree}deg`);
            lastClick = "p1";
      }

      //rotate half pie p2
      if (type === "p2") {
            root.style.setProperty('--p1-degree', '-180deg');
            rotation.p1degree = -180;
            function playZindex() {
                  root.style.setProperty('--h1', '99');
                  root.style.setProperty('--h2', '98');
                  rotation.p2degree = +degree;
                  root.style.setProperty('--p2-degree', `${degree}deg`);
            }
            if (lastClick === "p2") {
                  playZindex();
            } else {
                  setTimeout(() => {
                        playZindex();
                  }, 200);
            }
            lastClick = "p2";
      }
}

function circleBorderWithDegree(deg, type) {
      if (+deg === 0 && type === "p2") {
            const filtered = getElementFilteredWithDeg(-180, "p1");
            filtered && changeBorderColor(filtered);
      } else {
            const filtered = getElementFilteredWithDeg(deg, type);
            filtered && changeBorderColor(filtered);
      }
}

function setProperty(el, prop, val) {
      el.style.setProperty(prop, val);
}

function changeBorderColor(el) {
      [...circle].map(v => v.textContent < el.textContent
            ? setProperty(v, "border-color", "var(--light-blue)")
            : setProperty(v, "border-color", "#CCCCCC"));
}

function pushLabel(times) {
      root.style.setProperty('--lb-push-times', `${+times}`);
}

function getElementFilteredWithDeg(deg, type) {
      const fn = v => (+v.dataset.degree === deg && v.dataset.type === type);
      const filtered = [...circle].filter(fn);
      return filtered[0];
}

function pushLabelWithDeg(deg, type) {
      if (+deg === 0 && type === "p2") {
            const el = getElementFilteredWithDeg(-180, "p1");
            el ? pushLabel(el.textContent) : pushLabel(0);
      } else {
            const el = getElementFilteredWithDeg(deg, type);
            el ? pushLabel(el.textContent) : pushLabel(0);
      }
}