document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const playButton = document.getElementById("play-button");
    const resetButton = document.getElementById("reset-button");
    const levelSelect = document.getElementById("level-select");

    const colors = [
        "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
        "cyan", "magenta", "lime", "teal", "indigo", "violet", "gold", "silver",
        "maroon", "navy", "olive", "coral",
    ];
    const tubes = [];
    let selectedTube = null;
    let levelCount = 1;

    // 更新關卡數
    function chooseLevel(level) {
        levelCount = level;
        document.getElementById("level-count").textContent = levelCount;
    }

    // 監聽關卡選擇變更
    levelSelect.addEventListener("change", (event) => {
        const selectedLevel = parseInt(event.target.value, 10);
        chooseLevel(selectedLevel);
    });

    // 檢查遊戲狀態，判斷是否完成
    function checkGameState() {
        const allSameColor = (tube) => {
            const waters = Array.from(tube.children);
            return (
                waters.length === 4 &&
                waters.every(
                    (water) =>
                        water.style.backgroundColor === waters[0].style.backgroundColor
                )
            );
        };

        let completedTubes = 0;
        tubes.forEach((tube) => {
            if (allSameColor(tube)) {
                completedTubes++;
            }
        });
        document.getElementById("completed-tubes-count").textContent = completedTubes;

        if (
            tubes.every((tube) => tube.childElementCount === 0 || allSameColor(tube))
        ) {
            if (levelCount === 10) {
                alert("恭喜你全部玩完了^^");
            } else {
                alert("恭喜你過關了^^");
                levelCount++;
                document.getElementById("level-count").textContent = levelCount;
                document.getElementById("completed-tubes-count").textContent = 0;
                chooseLevel(levelCount);
                createTubes();
                fillTubes();
            }
        }
    }

    // 倒水邏輯
    function pourWater(fromTube, toTube) {
        let fromWater = fromTube.querySelector(".water:last-child");
        let toWater = toTube.querySelector(".water:last-child");

        if (!toWater) {
            const color = fromWater ? fromWater.style.backgroundColor : null;
            while (
                fromWater &&
                fromWater.style.backgroundColor === color &&
                toTube.childElementCount < 4
            ) {
                toTube.appendChild(fromWater);
                fromWater = fromTube.querySelector(".water:last-child");
            }
        } else {
            while (
                fromWater &&
                fromWater.style.backgroundColor === toWater.style.backgroundColor &&
                toTube.childElementCount < 4
            ) {
                toTube.appendChild(fromWater);
                fromWater = fromTube.querySelector(".water:last-child");
                toWater = toTube.querySelector(".water:last-child");
            }
        }
        checkGameState();
    }

    // 選擇試管
    function selectTube(tube) {
        if (selectedTube) {
            if (selectedTube !== tube) {
                pourWater(selectedTube, tube);
            }
            selectedTube.classList.remove("selected");
            selectedTube = null;
        } else {
            selectedTube = tube;
            tube.classList.add("selected");
        }
    }

    // 建立試管
    function createTubes() {
        gameContainer.innerHTML = "";
        tubes.length = 0;

        for (let i = 0; i < levelCount + 1; i++) {
            const tube = document.createElement("div");
            tube.classList.add("tube");
            tube.addEventListener("click", () => selectTube(tube));
            gameContainer.appendChild(tube);
            tubes.push(tube);
        }

        for (let i = 0; i < 2; i++) {
            const emptyTube = document.createElement("div");
            emptyTube.classList.add("tube");
            emptyTube.addEventListener("click", () => selectTube(emptyTube));
            gameContainer.appendChild(emptyTube);
            tubes.push(emptyTube);
        }
    }

    // 填充試管
    function fillTubes() {
        const gameColors = colors.slice(0, Math.min(levelCount + 1, colors.length));
        const waterBlocks = [];

        gameColors.forEach((color) => {
            for (let i = 0; i < 4; i++) {
                waterBlocks.push(color);
            }
        });

        waterBlocks.sort(() => 0.5 - Math.random());
        let blockIndex = 0;
        tubes.slice(0, levelCount + 1).forEach((tube) => {
            for (let i = 0; i < 4; i++) {
                if (blockIndex < waterBlocks.length) {
                    const water = document.createElement("div");
                    water.classList.add("water");
                    water.style.backgroundColor = waterBlocks[blockIndex];
                    water.style.height = "20%";
                    tube.appendChild(water);
                    blockIndex++;
                }
            }
        });
    }

    function selectTube(tube) {
        if (selectedTube) {
            if (selectedTube !== tube) {
                pourWater(selectedTube, tube);
            }
            selectedTube.classList.remove("selected");
            selectedTube = null;
        } else {
            selectedTube = tube;
            tube.classList.add("selected");
        }
    }

    function pourWater(fromTube, toTube) {
        let fromWater = fromTube.querySelector(".water:last-child");
        let toWater = toTube.querySelector(".water:last-child");

        if (!toWater) {
            const color = fromWater ? fromWater.style.backgroundColor : null;
            while (
                fromWater &&
                fromWater.style.backgroundColor === color &&
                toTube.childElementCount < 4
            ) {
                toTube.appendChild(fromWater);
                fromWater = fromTube.querySelector(".water:last-child");
            }
        } else {
            while (
                fromWater &&
                fromWater.style.backgroundColor === toWater.style.backgroundColor &&
                toTube.childElementCount < 4
            ) {
                toTube.appendChild(fromWater);
                fromWater = fromTube.querySelector(".water:last-child");
                toWater = toTube.querySelector(".water:last-child");
            }
        }
    }

    playButton.addEventListener("click", () => {
        createTubes();
        fillTubes();
    });

    // 新增重新挑戰按鈕的功能
    resetButton.addEventListener("click", () => {
        const confirmReset = confirm("你確定要重新挑戰當前關卡嗎？");
        if (confirmReset) {
            const confirmAgain = confirm("再次確認是否重新挑戰？");
            if (confirmAgain) {
                createTubes();
                fillTubes();
                alert("重新挑戰當前關卡！");
            }
        }
    });

    // 確認退出遊戲
    function confirmExit() {
        return confirm("你確定要退出遊戲嗎？");
    }
});