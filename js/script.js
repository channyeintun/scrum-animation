let root = document.documentElement;

const circles = document.querySelectorAll(".circle");
const labelInsideCircle = document.querySelector("._label");
const labelTitle = document.querySelector(".lb-title");
const labelDescription = document.querySelector(".lb-desc");
const labelPuller = document.querySelector(".label-pull-down");

[...circles].map((el) => addListener(el, selectSmallCircleWithNumber));

let lastClick = "";

let rotation = {
    p1degree: 0,
    p2degree: 0,
};

document.addEventListener("keyup", handleKeyUp, true);

function handleKeyUp(e) {
    if (e.keyCode == "37") {
        // left arrow
        if (rotation.p1degree + rotation.p2degree) {
            decreaseDegree(45);
        }
    } else if (e.keyCode == "39") {
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
            let pies = document.querySelectorAll(".pie");
            setTimeout(() => {
                setProperty(root, "--p1-degree", "-360deg");

                setProperty(root, "--h1", "12");
                setProperty(root, "--h2", "10");

                setProperty(root, "--p2-degree", "-540deg");
                setProperty(root, "--p1-degree", "-405deg");
                [...pies].map((pie) => {
                    setProperty(pie, "transition-duration", "0ms");
                });
                circleBorderWithDegree(-45, "p1");
            }, 190);

            setTimeout(() => {
                rotation = {
                    p1degree: -45,
                    p2degree: 0,
                };
                setProperty(root, "--p1-degree", "0deg");
                setProperty(root, "--p2-degree", "0deg");
            }, 200);
            setTimeout(() => {
                [...pies].map((pie) => {
                    setProperty(pie, "transition-duration", "200ms");
                });
                setProperty(root, "--p1-degree", "-45deg");
            }, 350);
        }
        if (rotation.p2degree > -135) {
            rotation.p2degree += v;
            rotate(rotation.p2degree, "p2");
            circleBorderWithDegree(rotation.p2degree, "p2");
        }
    } else {
        //rotate p1
        rotation.p1degree += v;
        rotate(rotation.p1degree, "p1");
        circleBorderWithDegree(rotation.p1degree, "p1");
    }
}

function decreaseDegree(v) {
    if (+rotation.p2degree === 0) {
        //rotate p1
        rotation.p1degree += v;
        rotate(rotation.p1degree, "p1");
        circleBorderWithDegree(rotation.p1degree, "p1");
    } else {
        //rotate p2
        rotation.p2degree += v;
        rotate(rotation.p2degree, "p2");
        circleBorderWithDegree(rotation.p2degree, "p2");
    }
}

function selectSmallCircleWithNumber(e) {
    const degree = e.target.dataset.degree;
    const type = e.target.dataset.type;
    rotate(degree, type);
    changeBorderColor(e.target);

    animateLabel(+e.target.textContent);
}

function rotate(degree, type) {
    if (type === "p1") {
        rotatePie1(degree);
    } else {
        rotatePie2(degree);
    }
}

function rotatePie1(degree) {
    root.style.setProperty("--p2-degree", "0deg");
    rotation.p2degree = 0;
    function playZindex() {
        root.style.setProperty("--h1", "12"); //h1 is z-index for half pie
        root.style.setProperty("--h2", "10"); //h2 is z-index for another half pie
    }
    if ((lastClick = "p2" && degree === "-180")) {
        setTimeout(() => {
            playZindex();
        }, 200);
    } else {
        playZindex();
    }
    rotation.p1degree = +degree;
    setProperty(root, "--p1-degree", `${degree}deg`);
    lastClick = "p1";
}

function rotatePie2(degree) {
    setProperty(root, "--p1-degree", "-180deg");
    rotation.p1degree = -180;
    function playZindex() {
        setProperty(root, "--h1", "99");
        setProperty(root, "--h2", "98");
        rotation.p2degree = +degree;
        setProperty(root, "--p2-degree", `${degree}deg`);
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

function circleBorderWithDegree(degree, type) {
    if (+degree === 0 && type === "p2") {
        const filtered = getElementFilteredWithDeg(-180, "p1");
        if (filtered) {
            animateLabel(+filtered.textContent);
            changeBorderColor(filtered);
        } else {
            animateLabel(0);
        }
    } else {
        const filtered = getElementFilteredWithDeg(degree, type);
        if (filtered) {
            animateLabel(+filtered.textContent);
            changeBorderColor(filtered);
        } else {
            animateLabel(0);
        }
    }
}

function changeBorderColor(element) {
    [...circles].map((circle) =>
        circle.textContent < element.textContent
            ? setProperty(circle, "border-color", "var(--light-blue)")
            : setProperty(circle, "border-color", "#CCCCCC")
    );
}

function getElementFilteredWithDeg(deg, type) {
    const fn = (element) =>
        +element.dataset.degree === deg && element.dataset.type === type;
    const filtered = [...circles].filter(fn);
    return filtered[0];
}

function animateLabel(index) {
    if (index < 0 || index > 7) {
        return;
    }
    labelInsideCircle.classList.add("fake-in-label", "pull-down-label");
    labelPuller.classList.add("pull-down");
    setTimeout(() => {
        if (index === 0) {
            labelDescription.classList.add("text-light-blue");
        } else {
            labelDescription.classList.remove("text-light-blue");
        }
        labelPuller.classList.remove("pull-down");
        labelTitle.textContent = labelArray[index]["title"];
        labelDescription.textContent = labelArray[index]["description"];
        labelInsideCircle.classList.remove("fake-in-label");
    }, 310);
}

function setProperty(element, prop, value) {
    element.style.setProperty(prop, value);
}

function addListener(el, fn) {
    el.onclick = fn;
}

const labelArray = [
    {
        title: "Use ← & → arrow keys",
        description: "(or click on the spots to play)",
    },
    {
        title: "Plan Requirements",
        description:
            "defining scope, establishing approach, process, standards.",
    },
    {
        title: "Analysis & Design",
        description: "architecture design, detailed UX/UI design.",
    },
    {
        title: "Development",
        description:
            "implementation in sprints, developing potentially shippable products. (increments).",
    },
    {
        title: "Testing",
        description:
            "validating user stories, executing regression tests, raising effects.",
    },
    {
        title: "Deployment",
        description: "preparation a version for the client review.",
    },
    {
        title: "Evaluation",
        description: "demo of a given version and evualation.",
    },
    {
        title: "Next Iteration",
        description: "",
    },
];
