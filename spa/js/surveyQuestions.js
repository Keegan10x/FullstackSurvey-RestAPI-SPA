/* surveyQuestions.js */

import {
  customiseNavbar,
  file2DataURI,
  loadPage,
  secureGet,
  showMessage,
} from "../util.js";

export async function setup(node) {
  console.log("surveyQuetions: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "Survey Questions";
    customiseNavbar(["home", "logout", "newsurvey"]);
    if (localStorage.getItem("authorization") === null) loadPage("login");
    // there is a token in localstorage
    
	  
    await getQuestions(node)
    node.querySelector("form").addEventListener("submit", await respond);
  } catch (err) {
    console.error(err);
  }
}

async function getQuestions(node){
	console.log('GETTING SURVEY QUESTIONS')
	const uriParams = new URLSearchParams(window.location.search)
	const surveyid = uriParams.get('survey')
	console.log(surveyid)			      
	const uri = `/api/v1/surveys/${surveyid}`
	const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/vnd.api+json",
				"Authorization": localStorage.getItem("authorization"),
			},
		}
	const rsp = await fetch(uri, options)
	const surveyObj = await rsp.json()
	window.myGlobalVariable = surveyObj
	console.log(surveyObj.data.questions)
	popSurveyForm(node, surveyObj)
}


function popSurveyForm(node, obj){
	const template = document.querySelector('template#surveyQuestions')
	const fragment = template.content.cloneNode(true)
	
	const form = document.createElement('form')
		for(const qst of obj.data.questions){	 
			
			 const fieldset = document.createElement('fieldset') 
			 const legend = document.createElement('legend')
			 const dscr = document.createElement('p')
			 
			 const lb1 = document.createElement('label')
			 const radio1 = document.createElement('input')
			 
			 const lb2 = document.createElement('label')
			 const radio2 = document.createElement('input')
			 
			 const lb3 = document.createElement('label')
			 const radio3 = document.createElement('input')
			 
			 const lb4 = document.createElement('label')
			 const radio4 = document.createElement('input')
			 
			 const lb5 = document.createElement('label')
			 const radio5 = document.createElement('input')

			 legend.innerText = qst.title
			 dscr.innerText = qst.description
			
			 radio1.setAttribute('type', 'radio')
			 radio1.setAttribute('name', qst.title)
			 radio1.setAttribute('value', "1")
			 radio1.setAttribute('id', qst.id)
			 lb1.innerText = 'Strongly Disagree (1 point)'
			
			 radio2.setAttribute('type', 'radio')
			 radio2.setAttribute('name', qst.title)
			 radio2.setAttribute('value', "2")
			 radio2.setAttribute('id', qst.id)
			 lb2.innerText = 'Disagree (2 points)'
			
			
			 radio3.setAttribute('type', 'radio')
			 radio3.setAttribute('name', qst.title)
			 radio3.setAttribute('value', "3")
			 radio3.setAttribute('id', qst.id)
			 lb3.innerText = 'Neither agree nor disagree (3 points)'
			
			 radio4.setAttribute('type', 'radio')
			 radio4.setAttribute('name', qst.title)
			 radio4.setAttribute('value', "4")
			 radio4.setAttribute('id', qst.id)
			 lb4.innerText = 'Agree (4 points)'
			
			 radio5.setAttribute('type', 'radio')
			 radio5.setAttribute('name', qst.title)
			 radio5.setAttribute('value', "5")
			 radio5.setAttribute('id', qst.id)
			 lb5.innerText = 'Strongly agree (5 points)'
			
			 fieldset.appendChild(legend)
			 fieldset.appendChild(dscr)
			
			 fieldset.appendChild(lb1)
			 fieldset.appendChild(radio1)
			
			 fieldset.appendChild(lb2)
			 fieldset.appendChild(radio2)
			
			 fieldset.appendChild(lb3)
			 fieldset.appendChild(radio3)
			
			 fieldset.appendChild(lb4)
			 fieldset.appendChild(radio4)
			
			 fieldset.appendChild(lb5)
			 fieldset.appendChild(radio5)
			
			
			 console.log(fragment)
			 form.appendChild(fieldset)
		}
	fragment.appendChild(form)
	//node.appendChild(fragment)
	node.appendChild(fragment)
	
	const submit = document.createElement('input')
	submit.setAttribute('type', 'submit')
	form.appendChild(submit)
	
	}

async function respond(event) {
  console.log("RESPONSE FUNCTION")
  const uriParams = new URLSearchParams(window.location.search)
  const surveyid = uriParams.get('survey')	
	
  const obj = window.myGlobalVariable
  event.preventDefault();	
  
  const questions = obj.data.questions
  const elems = []
  for(const qst of questions){
	  const element = document.querySelector(`input[id="${qst.id}"]:checked`)
	  //console.log(element.name)
	  elems.push({questionId: parseInt(element.id), response: parseInt(element.value)})
	  //console.log()
  }
 
  //console.log(elems);
  
  const uri = `/api/v1/surveys/${surveyid}`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Authorization": localStorage.getItem("authorization"),
    },
    body: JSON.stringify(elems)
  }
  
  try{
	  const rsp = await fetch(uri, options)
	  const json = await rsp.json()
	  console.log(json)
  }catch(err){
	  console.log(err)
  }finally{	
	  loadPage("home")  
  } 
}
