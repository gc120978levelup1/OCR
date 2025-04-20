//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("DOMContentLoaded", () => {
  //////START JS CODE
  // DOM Identification
  const textOutput = document.getElementById("textsOutput");
  const fileDOM = document.getElementById("imagFileInput");
  const imageDOM = document.getElementById("imageDOM");

  // Start OCR Parser for Drivers License
  const ocrToDriversLicenseJSON = (strOCR) => {
    let split_str = strOCR.split("\n");
    let data = {
      license_id: "",
      expiry: "",
      name: "",
      address: "",
      birthDate: "",
      nationality: "",
      sex: "",
    };
    split_str.forEach((str, i) => {
      let STR1 = str.toUpperCase();
      if (
        STR1.includes("LAST") ||
        STR1.includes("NAME") ||
        STR1.includes("FIRST") ||
        STR1.includes("MIDDLE")
      ) {
        console.log(
          `Name : ${split_str[i + 1]
            .replace(/[^A-Za-z,., ]/g, "")
            .replace(/^\s+/, "")}`
        );
        data.name = split_str[i + 1]
          .replace(/[^A-Za-z,., ]/g, "")
          .replace(/^\s+/, "");
      }
      if (
        STR1.includes("ADDRESS") ||
        STR1.includes("ADDR") ||
        STR1.includes("DDRESS") ||
        STR1.includes("ADDRES")
      ) {
        console.log(
          `Address : ${split_str[i + 1]
            .replace(/[^A-Z, ]/g, "")
            .replace(/^\s+/, "")} ${split_str[i + 2]
            .replace(/[^A-Z, ]/g, "")
            .replace(/^\s+/, "")}`
        );
        data.address =
          split_str[i + 1].replace(/[^A-Z, ]/g, "").replace(/^\s+/, "") +
          " " +
          split_str[i + 2].replace(/[^A-Z, ]/g, "").replace(/^\s+/, "");
      }
      if (
        STR1.includes("AGENCY") ||
        STR1.includes("EXPIRATION") ||
        STR1.includes("CODE")
      ) {
        console.log(
          `LicenseID : ${
            split_str[i + 1]
              .split(/\s+/)
              .filter((word) => word.includes("-"))[0]
          }`
        );
        data.license_id = split_str[i + 1]
          .split(/\s+/)
          .filter((word) => word.includes("-"))[0];
      }
      if (
        STR1.includes("AGENCY") ||
        STR1.includes("EXPIRATION") ||
        STR1.includes("CODE")
      ) {
        console.log(
          `ExpiryDate : ${
            split_str[i + 1]
              .split(/\s+/)
              .filter((word) => word.includes("/"))[0]
          }`
        );
        data.expiry = split_str[i + 1]
          .split(/\s+/)
          .filter((word) => word.includes("/"))[0];
      }
      if (STR1.includes("NATIONALITY") || STR1.includes("SEX")) {
        data.birthDate = split_str[i + 1].split(/\s+/).filter((word, k) => {
          ret = word.includes("/");
          if (ret) {
            console.log(
              `Nationality : ${split_str[i + 1]
                .split(/\s+/)
                [k - 2].replace(/[^A-Z,]/g, "")}`
            );
            console.log(
              `Sex : ${split_str[i + 1]
                .split(/\s+/)
                [k - 1].replace(/[^A-Z,]/g, "")}`
            );
            data.nationality = split_str[i + 1]
              .split(/\s+/)
              [k - 2].replace(/[^A-Z,]/g, "");
            data.sex = split_str[i + 1]
              .split(/\s+/)
              [k - 1].replace(/[^A-Z,]/g, "");
          }
          return ret;
        })[0];
        console.log(`ExpiryDate : ${data.birthDate}`);
      }
    });
    console.log(data);
    return data;
  };
  // End OCR Parser for Drivers License

  // Start Otical Character Recognition
  const startOCR = async (URL, File, outputDiv) => {
    let ret = null;
    Tesseract.recognize(URL, "eng", {
      logger: (m) => {
        if (outputDiv)
          outputDiv.innerHTML = "Processing .... <br/>" + JSON.stringify(m);
      },
    }).then(({ data: { text } }) => {
      console.log(text);
      ocrData = ocrToDriversLicenseJSON(text);
      ret = {
        file: File,
        URL: URL,
      };
      Object.assign(ret, ocrData); // merge ret and ocrData into ret
      ///////////////////////////////////////////////////////////////////////////////// vue emit here
      if (outputDiv) {
        let split_str = text.split("\n");
        outputDiv.innerHTML = ""; //split_str[0];
        split_str.forEach((element, i) => {
          outputDiv.innerHTML = outputDiv.innerHTML + `${i})  ${element} <br>`;
        });
        outputDiv.innerHTML = JSON.stringify(ret);
      }
      console.log("ret : ", ret);
    });
  };
  // End Otical Character Recognition

  // Start Open an Image file to perform OCR
  fileDOM.addEventListener("change", (event) => {
    const reader = new FileReader();
    let rawBase64 = "";
    let blob = null;
    reader.readAsDataURL(event.target.files[0]); // coverts file(blob) to base64 URL
    reader.onloadend = () => {
      imageDOM.src = reader.result;
      rawBase64 = reader.result;
      startOCR(rawBase64, event.target.files[0], textOutput); // for vue -> textOutput.value where textOutput = ref()
    };
  });
  // End Open an Image file to perform OCR

  //////END JS CODE
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
