window.myGlobalVariable = []

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
    createForm(node)
	  
    await addQuestions(node)
  
    

    const questions = []
    const descriptions = []
    
    //node.append(document.createElement('article'))
    //node.append(document.createElement('main'))
	  
    //Handle dynamic question title creation and deletion.	  
    node.querySelector('input[name="title"]').addEventListener('keyup', (event)=>{
	    const template = document.querySelector('template#surveyQuestions')
	    const fragment = template.content.cloneNode(true)
	    if(event.key === 'Enter') {
	    const name = event.target.value
	    const li = document.createElement('li')
	    li.innerText = event.target.value
	    console.log("ADDING: ", event.target.value)
            questions.push(event.target.value)
	    li.addEventListener('click', (event)=>{
		    const index = [...event.target.parentNode.children]
		    .indexOf(event.target)
		    const deleted = document.querySelector('article').removeChild(li)
		    console.log("DELETING: ", deleted.innerText)
		    
		    const qIdx = questions.indexOf(deleted.innerText)
		    questions.splice(qIdx, 1);
		    console.log(questions)
		    //console.log(`item at index: ${index}`)
		    //document.querySelector('article').removeChild(li)
	    })
	    //const ol = document.createElement('ol')
	    event.target.value = ''
	    event.target.select()
	    document.querySelector('article').appendChild(li)
	    console.log(questions)
	  }
    })
    
	  
	  
    //Handle dynamic question description creation and deletion.	  
    node.querySelector('textarea').addEventListener('keyup', (event)=>{
	    const template = document.querySelector('template#surveyQuestions')
	    const fragment = template.content.cloneNode(true)
	    //markdown line below
	    let converter
	    if(event.key === 'Enter') {
	    const section = document.createElement('section')
	    //section.innerText = event.target.value
	    const str = event.target.value.replace('\n', '')
	    console.log("ADDING: ", str)
		    
	    //markdown stuff
	    converter = new showdown.Converter({'tables': true, 'tasklists': true, 'strikethrough': true})
            const options = converter.getOptions()
	    const markdown = str
	    const html = converter.makeHtml(markdown)
            section.innerHTML = html    	    
            descriptions.push(html)  
		    
	    section.addEventListener('click', (event)=>{
		    const index = [...event.target.parentNode.children]
		    .indexOf(event.target)
		    const deleted = document.querySelector('main').removeChild(section)
		    console.log("DELETING: ", deleted.innerText)
		    
		    const dscIdx = descriptions.indexOf(deleted.innerHTML)
		    descriptions.splice(dscIdx, 1);
		    console.log(descriptions)
		    //console.log(`item at index: ${index}`)
		    //document.querySelector('article').removeChild(li)
	    })
	    //const ol = document.createElement('ol')
	    event.target.value = ''
	    event.target.select()
	    document.querySelector('main').appendChild(section)
	    console.log(descriptions)
	  }
    })
	  
	  
	  	  
    //node.querySelector("form").addEventListener("submit", await respond);
  } catch (err) {
    console.error(err);
  }
}


function createForm(node){
	const template = document.querySelector('template#addQuestions')
	const fragment = template.content.cloneNode(true)
	//const form = document.createElement('form')
	const qstLabel = document.createElement('label')
	qstLabel.innerText = 'Question Title'
	const question = document.createElement('input')
	question.setAttribute('name', 'title')
	question.attributes["required"] = "required"
	const dscrLabel = document.createElement('label')
	dscrLabel.innerText = 'Question Description'
	const description = document.createElement('textarea')
	description.attributes["required"] = "required"
	qstLabel.appendChild(document.createElement('br'))
	
	fragment.appendChild(qstLabel)
	fragment.appendChild(question)
	
	fragment.appendChild(document.createElement('br'))
	dscrLabel.appendChild(document.createElement('br'))
	
	fragment.appendChild(dscrLabel)
	fragment.appendChild(description)

	node.appendChild(fragment)
}


async function addQuestions(node){
	console.log('ADDING QUESTIONS')
	const uriParams = new URLSearchParams(window.location.search)
	const surveyid = uriParams.get('mysurvey')
	console.log(surveyid)
}



