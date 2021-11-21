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






//Feedback
export let surveySch = {
		  name: 'surveys',
		  desc: 'a list of all created survey',
		  schema: {
			  id: 'number',
			  usr: 'number',
			  name: 'string',
			  description: 'string',
			  created: 'ISO8601 string',
			  questions: 'number'
		  },
	  }