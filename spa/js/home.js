/* home.js */

import { customiseNavbar } from "../util.js";

export async function setup(node) {
  console.log("HOME: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "Home";
    customiseNavbar(["home", "foo", "logout"]); // navbar if logged in
    const token = localStorage.getItem("authorization");
    console.log(token);
    if (token === null) customiseNavbar(["home", "register", "login"]); //navbar if logged out

    //call functions here
    console.log('SURVEYS')
    //await addContent(node)
    await addSurvey(node)
  } catch (err) {
    console.error(err);
  }
}

/*
async function addContent(node){
	const url = 'https://jsonplaceholder.typicode.com/comments'
	const rsp = await fetch(url)
	//console.log(rsp)
	const comments = await rsp.json()
	console.log(comments)
	const template = document.querySelector('template#comments')
	for(const comment of comments){		
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = comment.email
		fragment.querySelector('p').innerText = comment.body
		node.appendChild(fragment)
	}
}
*/


async function addSurvey(node){
	console.log('SHOWING SURVEYS')
	const url = "/api/v1/surveys"
	const options = {
		method: "GET",
		headers: {
			"Content-Type":"application/vnd.api+json",
			"Authorization": localStorage.getItem("authorization"),
		}
	}
	console.log(url, JSON.stringify(options, null, 2))
	const rsp = await fetch(url)
	const surveyObj = await rsp.json()
	console.log(surveyObj)
	const template = document.querySelector('template#surveys')
	for(const survey of surveyObj.data){		
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = survey.name
		fragment.querySelector('p').innerText = survey.description
		fragment.querySelector('time').innerText = survey.created
		fragment.querySelector('b').innerText = survey.questions
		fragment.querySelector('a').innerText = survey.href
		node.appendChild(fragment)
	}
}



/*
async function addSurvey(node){
	console.log('GETTING SURVEYS')
	const url = "/api/v1/surveys"
	const options = {
		method: "GET",
		headers: {
			"Content-Type":"application/vnd.api+json",
			"Authorization": localStorage.getItem("authorization"),
		}
	}
	console.log(url, options)
	const rsp = await fetch(url, options)
	const json = await rsp.json();
	console.log(json)
	const template = document.querySelector('template#surveys')
	for(const survey of json.data){		
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = survey.name
		fragment.querySelector('p').innerText = survey.description
		fragment.querySelector('time').innerText = survey.created
		fragment.querySelector('b').innerText = survey.questions
		fragment.querySelector('a').innerText = survey.href
		node.appendChild(fragment)
	}
}*/



/*
// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	const response = await fetch('/uploads/quotes.json')
	const quotes = await response.json()
	const template = document.querySelector('template#quote')
	for(const quote of quotes.data) {
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = quote.author
		fragment.querySelector('p').innerText = quote.quote
		node.appendChild(fragment)
	}
	//const node = template.content.cloneNode(true) // get a copy of the template node
}
*/