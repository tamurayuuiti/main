// 試し割り法
import { trialDivision, loadPrimes } from './Scripts/trialDivision.js';

// Pollard’s rho 法
import { pollardsRhoFactorization } from './Scripts/pollardsRho.js';

let primes = [];
let startTime = null;
let isCalculating = false;
const coreCount = navigator.hardwareConcurrency || 4;

const elements = {
    numberInput: document.getElementById("numberInput"),
    charCounter: document.getElementById("charCounter"),
    calculateButton: document.getElementById("calculateButton"),
    errorMessage: document.getElementById("errorMessage"),
    result: document.getElementById("result"),
    time: document.getElementById("time"),
    spinner: document.getElementById("spinner"),
    elapsedTime: document.getElementById("elapsed-time"),
    loading: document.getElementById("loading")
};

async function startFactorization() {
    try {
        if (isCalculating) return;

        hideErrorAndPrepare();

        const inputValue = elements.numberInput.value.trim();
        if (!inputValue || BigInt(inputValue) < 2n) {
            showError("有効な整数を入力してください");
            return;
        }

        const num = BigInt(inputValue);
        console.log(`素因数分解を開始: ${num}`);

        isCalculating = true;
        startTime = performance.now();

        setTimeout(() => {
            elements.elapsedTime.style.display = "block";
            updateProgress();
        }, 1000);

        if (primes.length === 0) {
            await loadPrimes();
            if (primes.length === 0) throw new Error("素数リストが空のため、計算できません");
        }

        console.log("試し割り法を実行します");
        let { factors, remainder } = await trialDivision(num, primes, msg => {
            elements.result.textContent = msg;
        });
        console.log(`試し割り法完了。残りの数: ${remainder}`);

        if (remainder > 1n) {
            console.log(`Pollard's rho を開始 (コア数: ${coreCount})`);
            const extraFactors = await pollardsRhoFactorization(remainder);

            if (extraFactors.includes("FAIL")) {
                console.error(`Pollard's Rho では因数を発見できませんでした。素因数分解を中断します。`);
                elements.result.textContent = "素因数分解失敗";
                return;
            }

            factors = factors.concat(extraFactors);
        }

        let elapsedTime = ((performance.now() - startTime) / 1000).toFixed(3);
        showFinalResult(factors, elapsedTime);
        console.log(`素因数分解完了: ${factors.join(" × ")}, 計算時間: ${elapsedTime} 秒`);
    } catch (error) {
        console.error("計算エラー:", error);
        elements.result.textContent = "計算中にエラーが発生しました";
    } finally {
        isCalculating = false;
        elements.spinner.style.display = "none";
        elements.elapsedTime.style.display = "none";
        elements.loading.style.display = "none";
    }
}

function updateProgress() {
    if (!startTime) return;
    let elapsedTime = ((performance.now() - startTime) / 1000).toFixed(1);
    elements.elapsedTime.textContent = `（経過時間: ${elapsedTime} 秒）`;
    requestAnimationFrame(updateProgress);
}

function hideErrorAndPrepare() {
    elements.time.textContent = "";
    elements.result.textContent = "";
    elements.time.style.display = "none";
    elements.result.style.display = "none";
    elements.elapsedTime.style.display = "none";
    elements.errorMessage.style.display = "none";
    elements.spinner.style.display = "block";
    elements.loading.style.display = "flex";
    console.clear();
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = "block";
    elements.time.textContent = "";
    elements.result.textContent = "";
    elements.time.style.display = "none";
    elements.result.style.display = "none";
}

function showFinalResult(factors, elapsedTime) {
    elements.time.textContent = `計算時間: ${elapsedTime} 秒`;
    elements.result.textContent = `素因数:\n${factors.sort((a, b) => (a < b ? -1 : 1)).join(" × ")}`;
    elements.time.style.display = "block";
    elements.result.style.display = "block";
}

elements.calculateButton.addEventListener("click", startFactorization);
elements.numberInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        startFactorization();
    }
});

elements.numberInput.addEventListener("beforeinput", (e) => {
    const { value, selectionStart, selectionEnd } = elements.numberInput;
    const nextLength = value.length - (selectionEnd - selectionStart) + (e.data?.length || 0);
    if (nextLength > 30) e.preventDefault();
  });

elements.numberInput.addEventListener("input", () => {
    const input = elements.numberInput;
    if (input.value.length > 30) input.value = input.value.slice(0, 30);
  
    const len = input.value.length;
    elements.charCounter.textContent = `現在の桁数: ${len}（最大30桁）`;
    elements.charCounter.classList.toggle("limit-reached", len >= 30);
    elements.charCounter.style.color = len === 30 ? "red" : "";
});

(async () => {
    primes = await loadPrimes();
})();
