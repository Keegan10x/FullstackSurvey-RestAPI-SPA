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
    await addContent(node)
  } catch (err) {
    console.error(err);
  }
}



async function addContent(node){
	const url = 'https://jsonplaceholder.typicode.com/comments'
	const rsp = await fetch(url)
	//console.log(rsp)
	const comments = await rsp.json()
	console.log(comments)
	const template = document.querySelector('template#comments')
	for(const index in comments){
		const email = comments[index].email
		const body = comments[index].body
		
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = email
		fragment.querySelector('p').innerText = body
		node.appendChild(fragment)
	}
}

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