/**
 * Educational Alexa Skill for playing Fizz Buzz counting game!
 * Author: Adithya Bhonsley
 * Date: 12/31/2020
 * */

// ****************  (1) Initialize Constants  ************************

const Alexa = require("ask-sdk-core");
const invocationName = "fizz buzz game";

// ****************  (2) Intent Handlers  *****************************
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        // Starts counter to keep track of user expected response.
        sessionAttributes.counter = 2;
        
        // Welcome message and game instructions
        const say = 'Welcome to Fizz Buzz! We’ll each take turns counting up from one. However, you must replace numbers divisible by 3 '+
                        'with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. If a number is divisible '+
                        'by both 3 and 5, you should instead say “fizz buzz”. If you get one wrong, you lose. Let\'s get started! '+
                        'Alright, I\'ll start... one';

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

// Helper method to get expected response for current turn
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

// Check whether user's response is correct and respond accordingly
const UserResponseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UserResponseIntent';
    },
    handle(handlerInput) {
    
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let userResponse = Alexa.getSlotValue(handlerInput.requestEnvelope, 'fizzBuzz'); // Parse fizz/buzz from user response
    
    // If not fizz/buzz, parse number from response
    if(typeof userResponse === 'undefined') 
    {
        userResponse = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'number'), 10);
    }
    
    let expectedResponse = getCorrectResponse(sessionAttributes.counter); // Generate correct user response for current turn
    let speakOutput = '';
    
    if(userResponse ==  expectedResponse)
    {
        sessionAttributes.counter += 2; // Update counter for next round
        speakOutput = getCorrectResponse(sessionAttributes.counter - 1); // Generates correct Alexa response for current turn
    }
    else
    {
        speakOutput = 'I’m sorry, the correct response was “' + getCorrectResponse(sessionAttributes.counter) + '”. You lose! Thanks for playing Fizz Buzz. Would you like to play again or stop?';
    }
    

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

// Provides informative instructions if player gets stuck or confused
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'To play Fizz Buzz, we\'ll count up from one. As we count up, all numbers divisible by 3 should be replaced with "Fizz"? '+
                            'and all numbers divisible by 5 should be replaced by "Buzz." Numbers that are divisible by both 3 and 5 should be replaced ' +
                            'with "fizz buzz." Would you like to start a new game or continue?'

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Restarts game and updates counter accordingly
const PlayAgainIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayAgainIntent';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let userResponse = Alexa.getSlotValue(handlerInput.requestEnvelope, 'restartGame');
        let say = '';
        
        // Checks for any unsupported commmands that Alexa classifies under this intent
        if(userResponse != 'start over' && userResponse != 'play again' && userResponse != 'new game' && userResponse != 'restart game' && userResponse != 'again') 
        {
            say = ' Sorry, I had trouble doing what you asked. When playing the game, please make sure to respond with a single number or fizz/buzz. '+
                                 'If you need help, simply say "help." For starting a new game, simply say "new game." If you would like to end the game, simply say "stop".';
        }
        else
        {
            say = 'Okay, let\'s play again! I\'ll get us started ... One';
            sessionAttributes.counter = 2; // Resets counter for start of new game;
        }
        
    
        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

// Repeats last Alexa turn for user
const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatIntent';
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let userResponse = Alexa.getSlotValue(handlerInput.requestEnvelope, 'repeat');
        let say = '';
        
        // Checks for any unsupported commmands that Alexa classifies under this intent
        if(userResponse != 'continue' && userResponse != 'repeat' && userResponse != 'one more time' && userResponse != 'say that again' && userResponse != 'what did you say' && userResponse != 'once more') 
        {
            say = ' Sorry, I had trouble doing what you asked. When playing the game, please make sure to respond with a single number or fizz/buzz. '+
                                 'If you need help, simply say "help." For starting a new game, simply say "new game." If you would like to end the game, simply say "stop".';
        }
        else
        {
            say = 'I had said ' + (getCorrectResponse(sessionAttributes.counter - 1).toString()) + '. Your turn!';
        }
        
        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

// Ends game upon request
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Thanks for playing Fizz Buzz. Let\'s play again sometime!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Handles any fallback user responses
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
        const speakOutput = 'Sorry, I had trouble doing what you asked. When playing the game, please make sure to respond with a single number or fizz/buzz. '+
                            'If you need help, simply say "help." For starting a new game, simply say "new game." If you would like to end the game, simply say "stop".';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// ****************  (3) Export Intent Handler Functions  ************************
const skillBuilder = Alexa.SkillBuilders.custom()
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UserResponseIntentHandler,
        RepeatIntentHandler,
        PlayAgainIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();