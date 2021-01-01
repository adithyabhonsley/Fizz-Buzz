/**
 * Educational Alexa Skill for playing Fizz Buzz counting game!
 * Author: Adithya Bhonsley
 * Date: 12/31/2020
 * */

// ****************  Initialize Constants  *****************************

const Alexa = require("ask-sdk-core");
const https = require("https");
const invocationName = "fizz buzz game";

// ****************  Intent Handlers  *****************************
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const say = 'Welcome to Fizz Buzz! We’ll each take turns counting up from one. However, you must replace numbers divisible by 3 '+
                        'with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. If a number is divisible '+
                        'by both 3 and 5, you should instead say “fizz buzz”. If you get one wrong, you lose. Let\'s get started! '+
                        'Alright, I\'ll start... one';
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        sessionAttributes.counter = 2;

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

// Helper method to get expected user input for verification
function getCorrectResponse(counter)
{
    let output = '';
    
    if(counter % 3 == 0)
    {
        if(counter % 5 == 0)
        {
            output += 'fizz buzz';
        }
        else
        {
            output = 'fizz'
        }
    }
    else if(counter % 5 == 0)
    {
        output = 'buzz';
    }
    else
    {
        output = counter.toString();
    }
    
    return output;
}

const NumberResponseIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberResponseIntent';
    },
    handle(handlerInput) {
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let userNumber = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'number'), 10);
    let counter = sessionAttributes.counter;
    let expectedResponse = getCorrectResponse(counter);
    let speakOutput = '';
    
    if(userNumber ==  expectedResponse)
    {
        sessionAttributes.counter += 2;
        counter = sessionAttributes.counter;
        speakOutput = getCorrectResponse(counter - 1);
    }
    else
    {
        speakOutput = 'I’m sorry, the correct response was “' + getCorrectResponse(counter) + '”. You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!'
    }
    

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

// If user responds with fizz and/or buzz, we check whether it's correct
const FizzBuzzIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FizzBuzzIntent';
    },
    handle(handlerInput) {
        
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let userResponse = Alexa.getSlotValue(handlerInput.requestEnvelope, 'fizzBuzz');
        let counter = sessionAttributes.counter;
        let expectedResponse = getCorrectResponse(counter);
        let speakOutput = '';
    
    if(userResponse ==  expectedResponse)
    {
        sessionAttributes.counter += 2;
        counter = sessionAttributes.counter;
        speakOutput = getCorrectResponse(sessionAttributes.counter - 1);
    }
    else
    {
        speakOutput = 'I’m sorry, the correct response was “' + getCorrectResponse(counter) + '”. You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!'
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'To play Fizz Buzz, we\'ll count up from one. As we count up, all numbers divisible by 3 should be replaced with "Fizz"? '+
                            'and all numbers divisible by 5 should be replaced by "Buzz." For numbers that are divisible by both '

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatIntent';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let say = 'I said ' + (getCorrectResponse(sessionAttributes.counter - 1).toString()) + '. Your turn!';
    
        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// ****************  Error/Unsupported Command Handling  *****************************
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. When playing the game, please make sure to respond with a single number. '+
                            'If you need help, simply say "help." If you would like to end the game, simply say "stop".';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// ****************  Setup Intent Handler Functions  *****************************
const skillBuilder = Alexa.SkillBuilders.custom()
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NumberResponseIntent,
        RepeatIntentHandler,
        FizzBuzzIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
