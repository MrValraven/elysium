export const sleepNow = async (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const typeCode = async (element, word, letterDelay = 30) => {
  console.log("acessing element: " + element + " word: " + word);
  let selectedElement = document.querySelector(element);
  let index = 0;
  let maxIndex = word.length;
  let letter = "";

  while (index <= maxIndex) {
    await sleepNow(letterDelay);
    letter = word.slice(0, index);
    console.log(letter);
    selectedElement.textContent = letter;
    index++;
  }
};

export const typeAllCode = async (data) => {
  let delay = 0;
  for (let i = 0; i < data.length; i++) {
    await typeCode(data[i].element, data[i].text);

    if (i % 4 === 0) {
      await sleepNow(delay);
    }
  }
};

export const smoothScrollToBottomOfPage = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};
