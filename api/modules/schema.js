import Ajv from './ajv.js'

const ajv = new Ajv({allErrors: true})

//sechema for creating account
export const creds = ajv.compile({
	properties: {
		user: {
			type: "string",
			minLength: 2,
		},
		pass: {
			type: "string",
			minLength: 2,
		},
	},
	required: ['user', 'pass']
})


//schema for posting surveys
export const survey = ajv.compile({
  properties: {
    surveyName: { 
	    type: "string",
	    minLength: 2,
	    maxLength: 30
    },
    surveyDescription: {
	    type: "string",
	    minLength: 2,
	    maxLength: 280
    }
  },
  required: ['surveyName', 'surveyDescription']
})


//schema for posting questions
export const question = ajv.compile({
	type: 'array',
	minItems: 1,
	items: {
		type: 'object',
		properties: {
			title: {
				type: 'string',
				minLength: 2,
				maxLength: 30
			},
			description: {
				type: 'string',
				minLength: 2,
				maxLength: 280
			}
		},
		required: ['title', 'description']
	},
	required: ['items']
})


//schema for posting responses
export const response = ajv.compile({
	type: 'array',
	minItems: 1,
	items: {
		type: 'object',
		properties: {
			questionId: {
				type: 'integer',
			},
			response: {
				type: 'integer',
				minimum: 1,
				maximum: 5
			}
		},
		required: ['questionId', 'response']
	},
	required: ['items']
})







export let surveySch = {
		  jsonapi: {
			  version: '1.0'
		  },
		  methods: ['GET'],
		  name: 'Surveys',
		  desc: 'A list of all existing survey with submission links',
		  schema: {
			  id: 'number',
			  usr: 'number',
			  name: 'string',
			  description: 'string',
			  created: 'ISO8601 string',
			  type: 'survey',
			  questions: 'number',		  
			  href: 'string',
			  avgScore: 'string'
		  },
		  links: {}
	  }

export let mysurveySch = {
		  jsonapi: {
			  version: '1.0'
		  },
		  methods: ['GET', 'POST'],
		  name: 'Surveys',
		  desc: 'A list of all my created surveys with add question links',
		  schema: {
			  id: 'number',
			  usr: 'number',
			  name: 'string',
			  description: 'string',
			  created: 'ISO8601 string',
			  type: 'survey',
			  questions: 'number',		  
			  href: 'string',
		  },
		  links: {}
	  }


export let questionSch = {
		  jsonapi: {
			  version: '1.0'
		  },
		  methods: ['GET', 'POST'],
		  name: 'Questions',
		  desc: 'Getting all questions related to survey',
		  schema: {
			  id: 'number',
			  title: 'string',
			  description: 'string',
			  type: 'question'
		  },
		  links: {}
	  }



export let accountsSch = {
		  jsonapi: {
			  version: '1.0'
		  },
		  methods: ['GET', 'POST'],
		  name: 'Accounts',
		  desc: 'Get logged in user',
		  schema: {
			  username: 'string',
		  },
		  links: {}
	  }


export let mysurveyPostSch = {
	
		  jsonapi: {
			  version: '1.0'
		  },
	
		  methods: ['GET', 'POST'],
		  name: 'Surveys',
		  desc: 'Posting surveys',
	
		  schema: {
			  surveyName: 'string',
			  surveyDescription: 'string',
		  },
	
		  links: {}
	  }


export let myquestionsPostSch = {
	
		  jsonapi: {
			  version: '1.0'
		  },
	
		  methods: ['GET', 'POST'],
		  name: 'Surveys',
		  desc: 'Posting survey questions',
	
		  schema: [ {title:"string", description:"string"} ],		
	
		  links: {}
	  }


export let myresponsesPostSch = {
	
		  jsonapi: {
			  version: '1.0'
		  },
	
		  methods: ['GET', 'POST'],
		  name: 'Responses',
		  desc: 'Posting question responses',
	
		  schema: [ {questionId:"number", response:"number"} ],		
	
		  links: {}
	  }


export let myaccountsPostSch = {
	
		  jsonapi: {
			  version: '1.0'
		  },
	
		  methods: ['GET', 'POST'],
		  name: 'Accounts',
		  desc: 'Registering an account',
	
		  schema: {user: 'string', pass: 'string'},		
	
		  links: {}
	  }