import Ajv from './ajv.js'

const ajv = new Ajv({allErrors: true})

//posting survey schema
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


//posting question schema
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


//posting response schema
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