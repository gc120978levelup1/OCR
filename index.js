//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
  //////START JS CODE
  // DOM Identification
  const textOutput = document.getElementById("textsOutput");
  const fileDOM = document.getElementById("imagFileInput");
  const imageDOM = document.getElementById("imageDOM");

  // Otical Character Recognition
  const startOCR = (URL) => {
    Tesseract.recognize(URL, "eng", {
      logger: (m) => {
        textOutput.innerHTML = "Processing .... <br/>" + JSON.stringify(m);
      },
    }).then(({ data: { text } }) => {
      console.log(text);
      let split_str = text.split("\n");
      textOutput.innerHTML = ""; //split_str[0];
      split_str.forEach((element, i) => {
        textOutput.innerHTML = textOutput.innerHTML + `${i})  ${element} <br>`;
      });
    });
  };

  // start initial OCR
  startOCR(imageDOM.src);

  // Open an Image file to perform OCR
  fileDOM.addEventListener("change", (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      imageDOM.src = reader.result;
      startOCR(reader.result);
    };
  });
  //////END JS CODE
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
