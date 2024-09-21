import './style.css';
import QRcode from 'qrcode';
import QrScanner from 'qr-scanner';

document.getElementById('app').innerHTML = `
<header class="navbar">
  <img src="logo3.png" alt="navbar__logo" class="navbar__logo">
</header>
<main>
<div class="tab">
  <input type="radio" name="tab-switch" id="generate" class="tab_input" checked value="generate">
  <label for="generate" class="tab_item">Generate</label>
  <input type="radio" name="tab-switch" id="scan" class="tab_input" value="scan">
  <label for="scan" class="tab_item">Scan</label>
</div>
<div class="generate_tab">
  <div class="genrate_tabs-accordians">
     <div class="generate_tab-accordian open">
        <div class="accordian-header">
           <h2><button>Content</button></h2>
           <img src="chevron.svg" alt="chevron_icon">
        </div>
        <div class="accordian-body">
           <label for="url">
              URL<br>
              <div class="text-field">
                 <input type="text" id="url" name="url" placeholder="Paste your link here" value="https://www.google.com/">
                 <span class="error-msg display">*Please enter the link to generate Qr code</span>
              </div>
           </label>
           <a href="#qrcode" class="primary-btn">Generate</a>
        </div>
     </div>
     <div class="generate_tab-accordian ">
        <div class="accordian-header">
           <h2><button>Customize</button></h2>
           <img src="chevron.svg" alt="chevron_icon">
        </div>
        <div class="accordian-body">
           <label for="bg-color">
           Background Color
           </label><br>
           <div class="color-selectors">
              <input type="color" name="bg-color" id="bg-color" value="#ffffff">
              <input type="text" id="bg-color-value" value="#ffffff">
              <span class="error-msg display">*Enter the valid hex code</span>
           </div>
           <label for="fg-color">
           Foreground Color
           </label>
           <div class="color-selectors">
              <input type="color" name="fg-color" id="fg-color" value="#000000">
              <input type="text" id="fg-color-value" value="#000000">
               <span class="error-msg display">*Enter the valid hex code</span>
           </div>
           <label for="error-correction">
           Error Correction
           </label>
           <div class="btn-group">
              <input type="radio" name="error-correction" value="L" id="low">
              <label for="low" class="error-level">Low</label>
              <input type="radio" name="error-correction" value="M" id="Medium">
              <label for="Medium" class="error-level">Medium</label>
              <input type="radio" name="error-correction" value="Q" id="Quartile">
              <label for="Quartile" class="error-level">Quartile</label>
              <input type="radio" name="error-correction" value="H" id="High" checked>
              <label for="High" class="error-level">High</label>
           </div>
        </div>
     </div>
  </div>
  <div class="generate_tb-qr generate_tab-accordian">
     <canvas id="qrcode"></canvas>
     <a href="" id="download">Download</a>
  </div>
</div>
<div class="scan_tab">
  <div class="scan_tb-accordian">
    <div class="camera-container">
    <video id="camera-stream"></video>
    <div class="overlay"></div>
  </div>
  
</div>
</div>
<div class="modal-overlay">
<div class="modal">
<input type="text" disabled class="qr-content">
<div class="button-group">
<button id="copy" class="primary-btn">Copy</button>
<button id="close" class="primary-btn">close</button>
</div>
</div>
</div>
</main>
`;

//Tabs switching generate and scan
const tabs = document.querySelectorAll("[name = 'tab-switch']");
const generateTab = document.querySelector('.generate_tab');
const scanTab = document.querySelector('.scan_tab');
const VideoStream = document.querySelector('#camera-stream')
scanTab.style.display = 'none';
const scanner = new QrScanner(
  VideoStream,
  (result) => {
    scanner.stop();
    showModal(result.data);
  },
  {returnDetailedScanResult: true}
);

tabs.forEach((tab) => {
  tab.addEventListener('change', (e) => {
    if (e.target.value === 'generate') {
      scanTab.style.display = 'none';
      generateTab.style.display = 'flex';
    } else {
      generateTab.style.display = 'none';
      scanTab.style.display = 'block';
      scanner.start().catch((error) => {
        alert(error);
      });
    }
  });
});

//Accordian Interaction
const accordianHeader = document.querySelectorAll('.accordian-header');
accordianHeader.forEach((header) => {
  header.addEventListener('click', (e) => {
    e.stopPropagation();
    const accordianContainer = e.target.closest('.generate_tab-accordian');
    accordianContainer.classList.toggle('open');
  });
});

//Input Error throwing
const error = document.querySelector('.text-field > span');
const UrlText = document.querySelector('#url');
const showError = function (e,errorType="*Please enter the link to generate QR") {
  error.textContent = errorType;
  e.target.value === ''
  ? error.classList.remove('display'):
  error.classList.add('display');
}
UrlText.addEventListener('input', showError)


//Syncing the colors with the qr code
const bgColor = document.querySelector('#bg-color');
const fgColor = document.querySelector('#fg-color');
const bgColorValue = document.querySelector('#bg-color-value');
const fgColorValue = document.querySelector('#fg-color-value');
const bgTextInput = document.querySelector('#bg-color + input');
const fgTextInput = document.querySelector('#fg-color + input');

const UpdateTextInput = (e) => {
  e.target.nextElementSibling.value = e.target.value;
};

bgColor.addEventListener('input', UpdateTextInput);
fgColor.addEventListener('input', UpdateTextInput);

//Error message for color handler

const isValidcode = function (hex) {
  const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexPattern.test(hex);
};

const UpdateColor = function (e) {
  if (isValidcode(e.target.value)) {
    e.target.nextElementSibling.classList.add('display');
    e.target.previousElementSibling.value = e.target.value;
  } else {
    e.target.nextElementSibling.classList.remove('display');
  }
};

//update color
bgColorValue.addEventListener('input', UpdateColor);
fgColorValue.addEventListener('input', UpdateColor);

//Generating QR

const qrCanvas = document.querySelector('#qrcode');
const GenerateBtn = document.querySelector('label[for="url"] + .primary-btn');

const maxContent = function(errorContent){
  if(errorContent == null){
    error.textContent = errorContent.message;
    error.classList.remove('display')
  }
}

const GenerateQR = (params) => {
  QRcode.toCanvas(qrCanvas, UrlText.value, {
    height: 312,
    width: 312,
    type:'img/png',
    errorCorrectionLevel: document.querySelectorAll(
      'input[name="error-correction"]:checked'
    ),
    color: { light: bgColorValue.value, dark: fgColorValue.value },
  },maxContent);
}

GenerateBtn.addEventListener('click', (e) => {
  UrlText.value == '' ||
  !isValidcode(bgColorValue.value) ||
  !isValidcode(fgColorValue.value)
  ? e.preventDefault()
  : GenerateQR();
});

[bgColor,fgColor].forEach((input) => {
  input.addEventListener('input',GenerateQR);
})
GenerateQR()

const downloadBtn = document.querySelector('#download')


//creating downloadable link
async function DataUri(params) {
  const uri = await QRcode.toDataURL(UrlText.value);
  downloadBtn.setAttribute('href',uri);
  downloadBtn.setAttribute('download','QRCODE')
}
DataUri()

const qrContent = document.querySelector('.qr-content');
const modal = document.querySelector('.modal-overlay')

const showModal = (qrResult) => {
    qrContent.value = qrResult;
    modal.style.display = 'flex';
}

const copyBtn = document.querySelector('#copy');
copyBtn.addEventListener('click',(e) => {
   e.preventDefault();
   qrContent.ariaSelected();
   qrContent.setSelectionRange(0,99999)
   navigator.clipboard.writeText(qrContent.value)
   copyBtn.textContent = "Copied!"
}) 

const closeBtn = document.querySelector('#close')
closeBtn.addEventListener('click',(e) => {
  modal.style.display = 'none';
  scanner.start();
})
