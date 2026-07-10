// global declaration
let fields;
let urlField;
let pageTitle;
let description;
let category;
let image;
let authorName;
let readingTime;
let metaKeywords;
let submitButton;

// check page url to add button to fill json data
const allowedSites = ["oxmaint", "ifactoryapp", "heavyvehicleinspection"];
let hostname = window.location.hostname;
let isAllowed = allowedSites.some((site) => hostname.includes(site));

let pageUrl = window.location.href;
if (isAllowed && pageUrl.includes("manage-post-2k26/add_post")) {
  let filBtn = document.createElement("button");
  filBtn.className = "fillJson";
  filBtn.innerText = "Fill Json Data";
  filBtn.style.backgroundColor = "#15227a";
  filBtn.style.color = "#fff";
  filBtn.style.marginLeft = "20px";
  filBtn.style.borderRadius = "14px";
  filBtn.style.padding = "6px 12px";
  filBtn.style.cursor = "pointer";
  let header = document
    .querySelector(".container_12")
    ?.querySelector(".grid_10")
    ?.querySelector("h2");
  console.log(header);
  if (header) {
    header.appendChild(filBtn);

    // New Generate + Fill Page Button
    let genBtn = document.createElement("button");
    genBtn.id = "btn-generate-fill";
    genBtn.className = "generateFillJson";
    genBtn.innerText = "Generate + Fill Page";
    genBtn.style.backgroundColor = "#28a745";
    genBtn.style.color = "#fff";
    genBtn.style.marginLeft = "10px";
    genBtn.style.borderRadius = "14px";
    genBtn.style.padding = "6px 12px";
    genBtn.style.cursor = "pointer";
    header.appendChild(genBtn);
  }
  getInputFields();
}

//    click autofill button
document.addEventListener("click", async function (event) {
  const target = event.target;
  
  if (target.className === "fillJson") {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      alert("Extension updated: Please completely refresh the page (F5) to continue.");
      return;
    }
    chrome.storage.local.get("jsonData", function (result) {
      if (!result.jsonData) {
        showToast("No JSON selected");
        return;
      }
      autofillForm(result.jsonData);
    });
  }

  // AI Generation functionality
  if (target.id === "btn-generate-fill") {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      alert("Extension updated: Please completely refresh the page (F5) to continue.");
      return;
    }
    const btn = target;
    chrome.storage.local.get("jsonData", async function (result) {
      if (!result.jsonData) {
        showToast("No JSON selected to send to AI");
        return;
      }
      
      const originalText = btn.innerText;
      btn.innerText = "Generating...";
      btn.style.opacity = "0.7";
      btn.style.cursor = "wait";
      btn.disabled = true;
      
      try {
        chrome.runtime.sendMessage(
          { action: "generatePage", payload: { data: result.jsonData, hostname: window.location.hostname } },
          (response) => {
            if (response && response.success) {
              autofillForm(response.data);
              showToast("✅ Page Generated & Filled Successfully!");
            } else {
              console.error("AI Generation Error:", response?.error || "Unknown error");
              showToast("❌ Failed to generate content.");
            }
            // Reset button state inside callback
            btn.innerText = originalText;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            btn.disabled = false;
          }
        );
      } catch (error) {
        console.error("Extension Messaging Error:", error);
        showToast("❌ Extension Error. Please reload page.");
        btn.innerText = originalText;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.disabled = false;
      }
    });
  }
});

// get all input fields that need to be filled
function getInputFields() {
  // console.log("goint to get inputs");
  fields = document.querySelectorAll(
    'input[name="title"], input[name="heading"], input[name="descr"], select[name="category_id"], input[name="image"], input[name="author"], input[name="time"], input[name="tags"], input[name="submit"]',
  );
  if (!fields) {
    return;
  } else {
    urlField = fields[0];
    pageTitle = fields[1];
    description = fields[2];
    category = fields[3];
    image = fields[4];
    authorName = fields[5];
    readingTime = fields[6];
    metaKeywords = fields[7];
    submitButton = fields[8];
    // checkEmptyFields();
  }
}
//    AUTOFILL FORM
function autofillForm(jsonData) {
  if (!jsonData) jsonData = {};

  // console.log("inside autofill function");
  let jsonDataKeys = Object.keys(jsonData);
  jsonDataKeys.forEach((key) => {
    if (key.toLowerCase().includes("url")) {
      urlField.value = jsonData[key];
    }
    if (key.toLowerCase().includes("title")) {
      pageTitle.value = jsonData[key];
    }
    if (key.toLowerCase().includes("description")) {
      description.value = jsonData[key];
    }
    if (key.toLowerCase().includes("type")) {
      Array.from(category.options).forEach((option) => {
        if (jsonData[key].toLowerCase() == option.text.toLowerCase()) {
          category.value = option.value;
        }
      });
    }
    if (key.toLowerCase().includes("keywords")) {
      metaKeywords.value = jsonData[key];
    }
    if (key.toLowerCase().includes("content")) {
      let contentInjected = false;
      const codeBox = document.querySelector("rte-codebox");
      if (codeBox) {
        const codeTextarea = codeBox.querySelector("textarea");
        if (codeTextarea) {
          codeTextarea.value = jsonData[key];
          codeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
          codeTextarea.dispatchEvent(new Event("change", { bubbles: true }));
          contentInjected = true;
        }
      }
      const wysiwyg = document.querySelector('div[contenteditable="true"]');
      if (wysiwyg) {
        wysiwyg.innerHTML = jsonData[key];
        wysiwyg.dispatchEvent(new Event("input", { bubbles: true }));
        contentInjected = true;
      }
      
      document.querySelectorAll('iframe').forEach(iframe => {
        try {
           if (iframe.contentDocument && iframe.contentDocument.body) {
               iframe.contentDocument.body.innerHTML = jsonData[key];
               contentInjected = true;
           }
        } catch(e) {}
      });

      // Always copy to clipboard as a foolproof fallback (using execCommand to avoid Uncaught Promise Rejections)
      try {
          const textArea = document.createElement("textarea");
          textArea.value = jsonData[key];
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);
          if (successful) {
              showToast("✅ HTML Content copied to clipboard! Paste it into the editor.");
          }
      } catch (fallbackErr) {
          console.warn("Silent fallback clipboard copy failed (expected if no gesture):", fallbackErr);
      }
    }
    
    if (key === "imageBase64" && jsonData[key]) {
       console.log("Attaching AI Image from Base64...");
       try {
           const byteCharacters = atob(jsonData[key]);
           const byteNumbers = new Array(byteCharacters.length);
           for (let i = 0; i < byteCharacters.length; i++) {
               byteNumbers[i] = byteCharacters.charCodeAt(i);
           }
           const byteArray = new Uint8Array(byteNumbers);
           const blob = new Blob([byteArray], { type: 'image/jpeg' });
           const file = new File([blob], "generated-image.jpg", { type: "image/jpeg" });
           
           const dataTransfer = new DataTransfer();
           dataTransfer.items.add(file);
           
           const imageInput = document.querySelector('input[type="file"]') || document.querySelector('input[name="image"]') || image;
           if (imageInput) {
               imageInput.files = dataTransfer.files;
               imageInput.dispatchEvent(new Event('change', { bubbles: true }));
               imageInput.dispatchEvent(new Event('input', { bubbles: true }));
               checkEmptyFields(); 
               console.log("Image successfully attached to Upload Image input!");
           }
       } catch (err) {
           console.error("Error attaching base64 image:", err);
       }
    }
    authorName.value = "James Smith";
    readingTime.value = setReadingTime();
  });

  // Ensure default/fallback values for missing properties after parsing
  if (urlField && !urlField.value) urlField.value = "generated-url-slug-" + Date.now();
  if (pageTitle && !pageTitle.value) pageTitle.value = "Generated Title - Please Update";
  if (description && !description.value) description.value = "Generated description. Please update with relevant information.";
  if (metaKeywords && !metaKeywords.value) metaKeywords.value = "maintenance, software, ai";
  
  if (category && (!category.value || category.options[category.selectedIndex].text === "Select Category")) {
    Array.from(category.options).forEach((option) => {
      if (option.text.toLowerCase().includes("article")) {
        category.value = option.value;
      }
    });
  }

  let contentInjected = false;
  const wysiwyg = document.querySelector('div[contenteditable="true"]');
  if (wysiwyg && wysiwyg.innerHTML && wysiwyg.innerHTML.trim().length > 0) contentInjected = true;
  
  if (!contentInjected) {
      let fallbackContent = "<p>Content generation failed or is missing. Please try again.</p>";
      const codeBox = document.querySelector("rte-codebox");
      if (codeBox) {
        const codeTextarea = codeBox.querySelector("textarea");
        if (codeTextarea) {
          codeTextarea.value = fallbackContent;
          codeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
          codeTextarea.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      if (wysiwyg) {
        wysiwyg.innerHTML = fallbackContent;
        wysiwyg.dispatchEvent(new Event("input", { bubbles: true }));
      }
  }

  checkEmptyFields();
  showToast("Form autofilled");
}

// set reading time
function setReadingTime() {
  return (pageReadingTime = Math.floor(Math.random() * 2) + 4);
}
// checking empty fields
function checkEmptyFields() {
  // console.log("Checking empty fields");
  submitButton.disabled = true;
  submitButton.style.backgroundColor = "grey";
  submitButton.style.cursor = "not-allowed";
  if (
    urlField.value !== "" &&
    blogUrlHasNoHyphens(urlField) &&
    pageTitle.value !== "" &&
    description.value !== "" &&
    category.options[category.selectedIndex].text !== "Select Category" &&
    image.value !== "" &&
    authorName.value !== "" &&
    readingTime.value !== "" &&
    metaKeywords.value !== ""
  ) {
    console.log("All fields are filled");
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "";
    submitButton.style.cursor = "";
  } else {
    // console.log("At least one fild is empty");
  }
}

// remove ( - ) from url automatically
function blogUrlHasNoHyphens(urlField) {
  // console.log(urlField.value)
  if (urlField.value.includes("-")) {
    // wait 4 seconds after typing
    clearTimeout(urlField.delayTimer);
    urlField.delayTimer = setTimeout(() => {
      urlField.value = urlField.value.replace(/-/g, " ");
      // console.log(urlField.value);
    }, 4000);
  }
  return true;
}

// Check uploaded image size (max 1MB)
function checkImageSize() {
  if (!image || !image.files || image.files.length === 0) {
    return true;
  }

  let file = image.files[0];

  // 1 MB = 1024 * 1024 bytes
  let maxSize = 1024 * 1024;

  if (file.size > maxSize) {
    alert("Image size is more than 1 MB. Please upload a smaller image.");

    image.value = ""; // remove selected image

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "grey";
    submitButton.style.cursor = "not-allowed";

    return false;
  }

  return true;
}

//    show TOAST message
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.background = "#28a745";
  toast.style.color = "#fff";
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

document.addEventListener("input", function (event) {
  // FIX: Prevent error if fields is undefined on other websites like chatgpt.com
  if (!fields) return;
  
  const inputFieldsArray = Array.from(fields);

  if (inputFieldsArray.includes(event.target)) {
    if (event.target === image) {
      if (!checkImageSize()) {
        return;
      }
    }

    checkEmptyFields();
  }
});

const codeButton = document.querySelector(".rte_command_code");
if (codeButton) {
  codeButton.addEventListener("click", function () {
    console.log("code button clicked");
    if (this.classList.contains("rte-command-deactive")) {
      console.log("class active");
      const codeBox = document.querySelector("rte-codebox");
      if (codeBox) {
        const codeTextarea = codeBox.querySelector("textarea");
        if (codeTextarea) {
          console.log("Code textarea found and active");
          codeTextarea.addEventListener("change", function () {
            console.log("Change detected in code textarea");
            // if(codeButton.classList.contains("rte-command-active")){
            checkPageCode(codeTextarea);
            // console.log(codeTextarea.value);
            // }
          });
        } else {
          console.log("Code textarea not found");
        }
      } else {
        console.log("rte-codebox not found");
      }
    } else {
      console.log("Code button is not active");
    }
  });
} else {
  console.log("rte_command_code button not found");
}


function checkPageCode(codeTextarea) {
  let htmlCode = codeTextarea.value;

  let errors = [];

  // Create temporary DOM
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlCode;

  // =========================
  // Check first p tag
  // =========================

  let firstP = tempDiv.querySelector("p");

  if (firstP) {
    if (firstP.hasAttribute("class")) {
      errors.push("First p tag contains class name");
    }

    if (firstP.hasAttribute("style")) {
      errors.push("First p tag contains inline CSS");
    }
  }

  // =========================
  // Check h1 tag
  // =========================

  if (tempDiv.querySelector("h1")) {
    errors.push("Code contains h1 tag");
  }

  // =========================
  // Check style tag CSS
  // =========================

  let styleTags = tempDiv.querySelectorAll("style");

  styleTags.forEach((style) => {
    let css = style.innerHTML;

    // Remove comments first
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Get only selectors before {
    let selectors = css.match(/[^{}]+(?=\s*\{)/g) || [];

    selectors.forEach((selector) => {
      selector = selector.trim();

      // Check universal selector
      if (
        selector === "*" ||
        selector.includes("*,") ||
        selector.includes(",*") ||
        selector.includes("*::before") ||
        selector.includes("*::after")
      ) {
        errors.push("CSS contains * selector");
      }

      // Check body selector
      if (
        selector === "body" ||
        selector.startsWith("body,") ||
        selector.includes(",body")
      ) {
        errors.push("CSS contains body selector");
      }
    });
  });

  // =========================
  // Show all alerts together
  // =========================

  if (errors.length > 0) {
    confirm(errors.join("\n"));

    return false;
  }

  console.log("Code validation passed");

  return true;
}
