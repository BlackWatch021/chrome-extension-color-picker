const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");
btn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectedResults) => {
      const [data] = injectedResults;
      if (data.result) {
        const color = data.result.sRGBHex;

        //copy to clipboard
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.error(err);
        }

        //These styling can be done in .css file.
        (colorGrid.style.backgroundColor = color),
          (colorGrid.style.width = "30px");
        colorGrid.style.height = "10px";
        colorGrid.style.display = "inline-block";
        colorGrid.style.margin = "auto";
        colorGrid.style.border = ".1px solid black";
        colorValue.innerHTML = color;
        colorValue.style.marginLeft = "5px";
        colorValue.style.fontWeight = "700";
      }
    }
  );
});

//Above code is running in the extension

//Below code is running in the opened tab
//Because with "chrome.scripting.executeScript" we are running a script for the web page.

async function pickColor() {
  //picker
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}
