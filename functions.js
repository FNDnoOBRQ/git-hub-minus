const form = document.getElementById('form');
const aside = document.getElementById("aside");


const display = document.getElementById("tutorial");
const messageBox = document.getElementById('messageBox');
const overlay = document.getElementById('overlay');
const textArea = document.getElementById("textArea");
const exit = document.getElementById("Exit");
const save = document.getElementById("Save");
let currentFile = null;

display.classList.add('hide')
messageBox.classList.add('hide');
overlay.classList.add('hide');


//loading...
form.addEventListener('submit', async(e) => {
  e.preventDefault();
  const dataForm = new FormData(form);
  const data = Object.fromEntries(dataForm.entries());
  await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  loadDoc();
});


function loadDoc() {
  fetch("file.json?" + new Date().getTime())
    .then(res => res.json())
    .then(data => {

      
      aside.innerHTML = "";


      for (const folder in data) {

        const div = document.createElement("div");
        div.textContent = folder+": ";
        div.appendChild(document.createElement("br"));


        for (const file in data[folder]) {

          const text_button = document.createElement("div");
          text_button.setAttribute("category", folder);
          text_button.setAttribute("fileName", file);

          const fileName = document.createElement("span");
          fileName.textContent = "• "+file.replace(".txt", ": ");
          fileName.addEventListener('click', ()=>{showTheMessage(data[folder][file], folder, file.replace(".txt", ":"), text_button)});


          const button = document.createElement("button");
          button.setAttribute("class", "deleteButton");
          button.textContent = "▢";
          button.addEventListener('click', ()=>{delElement(text_button)});


          text_button.appendChild(fileName);
          text_button.appendChild(button);
          div.appendChild(text_button);
        }


        aside.appendChild(div);
      }
    })
    .catch(err =>{ "Find an error ", err});
}





// Dlete the DIV: ....
function delElement(div){
  div.remove();
  sendDeleteRequest(div);
  loadDoc();
}
async function sendDeleteRequest(div) {

  const category = div.getAttribute("category");
  const fileName = div.getAttribute("fileName");
  const raw = {"category": category, "fileName": fileName};

  await fetch("/deleteFile", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raw)
  });

  location.reload();
}


async function sendUpdateRequest(div, text){
  const category = div.getAttribute("category");
  const fileName = div.getAttribute("fileName");
  const raw = {"category": category, "fileName": fileName, "text": text};

  await fetch("/updateFile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raw)
  });

  location.reload();
} 






//close this messageBox
exit.addEventListener('click', ()=>{
  overlay.classList.add('hide');
  messageBox.classList.add('hide');
  messageBox.style.transform = "translate(-1400px, -850px)";
});

//save file and and exit
save.addEventListener('click', ()=>{
  if(currentFile){
    sendUpdateRequest(currentFile, textArea.value);
  }

  setTimeout(()=>{
    overlay.classList.add('hide');
    messageBox.classList.add('hide');
    messageBox.style.transform = "translate(-1400px, -850px)";
  }, 700);
});





//Show the text of the SPAN
function showTheMessage(span, folderName, fileName, updateInformations){
  overlay.classList.remove('hide');
  messageBox.classList.remove('hide');
  messageBox.style.transform = "translate(1400px, 850px)";
  textArea.value = span;
  document.getElementById("foldersName").textContent = folderName[0].toUpperCase() + folderName.slice(1);
  document.getElementById("subFilesName").textContent = fileName;

  currentFile = updateInformations;
}






function hideAll(){
  aside.style.display = "none";
  form.hidden = true;
}

function showAll(){
  aside.style.display = "flex";
  form.hidden = false;
}


function settings(){
  const buttonExit = document.getElementById("buttonExit");
  const buttonChangeMode = document.getElementById("buttonChangeMode");
  let normalMode = true;
  overlay.classList.remove('hide');
  display.classList.remove('hide');
  display.style.transform = "translate(1400px, 900px)";

  buttonExit.addEventListener('click', ()=>{
    overlay.classList.add('hide');
    display.classList.add('hide');
  display.style.transform = "translate(-1400px, -900px)";
  })


  buttonChangeMode.addEventListener('click', ()=>{
    if(normalMode){
      document.body.style.backgroundColor = "#C0C0C0";
      document.getElementById("nav").style.backgroundColor = "#2A3439";
      document.getElementById("category").style.backgroundColor = "#2A3439";
      document.getElementById("filesName").style.backgroundColor = "#2A3439";
      document.getElementById("text").style.backgroundColor = "#2A3439";
      form.style.backgroundColor = "#a9beaf";
      aside.style.backgroundColor="#a9beaf";
      messageBox.style.backgroundColor="#2A3439";
      display.style.backgroundColor="#2A3439";
      normalMode = false;
    }
    else{
      document.body.style.backgroundColor = "#14191b";
      document.getElementById("nav").style.backgroundColor = "#010508";
      document.getElementById("category").style.backgroundColor = "#14191b";
      document.getElementById("filesName").style.backgroundColor = "#14191b";
      document.getElementById("text").style.backgroundColor = "#14191b";
      form.style.backgroundColor = "#020d16";
      aside.style.backgroundColor="transparent";
      messageBox.style.backgroundColor="#020d16";
      display.style.backgroundColor="#020d16";
      normalMode = true;
    }
  });
}

window.addEventListener('load', loadDoc);

