let converter

window.addEventListener('input', async event => {
  converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
  const options = converter.getOptions()
  console.log(options)

  const markdown = document.querySelector("textarea[name='description']").value
  console.log(markdown)
  const html = converter.makeHtml(markdown)
  console.log(html)
  document.querySelector("input[name='surveyDescription']").value = html
  document.getElementById("mkdn").innerHTML = html
})



/* newsurvey.js */

import {
  customiseNavbar,
  file2DataURI,
  loadPage,
  secureGet,
  showMessage,
} from "../util.js";

export async function setup(node) {
  console.log("newsurvey: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "New Survey";
    customiseNavbar(["home", "logout", "newsurvey"]);
    if (localStorage.getItem("authorization") === null) loadPage("login");
    // there is a token in localstorage
    node.querySelector("form").addEventListener("submit", await createSurvey);
  } catch (err) {
    console.error(err);
  }
}

async function createSurvey(event){
	event.preventDefault();
	const surveyname = document.querySelector('input[name="surveyName"]')
	const surveydesc = document.querySelector('input[name="surveyDescription"]')
	console.log({ surveyName: surveyname.value, surveyDescription: surveydesc.value})
}


async function uploadData(event) {
  console.log("func UPLOAD DATA");
  event.preventDefault();
  const element = document.querySelector('input[name="file"]');
  console.log(element);
  //useful -------
  const file = document.querySelector('input[name="file"]').files[0];
  file.base64 = await file2DataURI(file);
  //useful -------
  file.user = localStorage.getItem("username");
  console.log(file);
  const url = "/api/v1/files";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Authorization": localStorage.getItem("authorization"),
    },
    body: JSON.stringify(file),
  };
  const response = await fetch(url, options);
  console.log(response);
  const json = await response.json();
  console.log(json);
  showMessage("file uploaded");
  loadPage("home");
}
