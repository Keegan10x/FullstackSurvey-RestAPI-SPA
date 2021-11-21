/* register.js */

import { customiseNavbar, loadPage, showMessage } from "../util.js";

export async function setup(node) {
  console.log('hitting here!!!!!!!!!!!')
  try {
    console.log("REGISTER: setup");
    console.log(node);
    document.querySelector("header p").innerText = "Register an Account";
    customiseNavbar(["home", "register", "login"]);
    node.querySelector("form").addEventListener("submit", await register);
  } catch (err) { // this will catch any errors in this script
    console.error(err);
  }
}

//application/json
async function register() {
	  console.log('callin register !!!!!!!!')
	  event.preventDefault();
	  const formData = new FormData(event.target);
	  console.log(formData)
	  const data = Object.fromEntries(formData.entries());
	  console.log(data);
	  const url = "/api/v1/accounts";
	  const options = {
		  method: "POST",
		  headers: {
			  "Content-Type":"application/vnd.api+json",
		  },
		  body: JSON.stringify(data),
		  };
	  console.log(options)
	  const response = await fetch(url, options);
	  const json = await response.json();
	  console.log(json);
	  showMessage("new account registered");
	  loadPage("login");
}
