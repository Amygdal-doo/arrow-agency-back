import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources';
import { IInstructions } from './interfaces/instructions.interface';

const MODEL = 'gpt-4o-mini';
const TEMPERATURE = 0.7;
const INSTRUCTIONS = `
    You are gonna be provided with text that i scraped from website/s (mostly software/IT websites) that i using puppeteer exctracted.Now i want you to extract the most valuble info from website so that i can use openai to write a better email.So return in text that you will be able to understand"
  `;
// const INSTRUCTIONS_2 = `
//   You are gonna be provided with textContent in string texts from a web page/s seperated with ';!' (mostly software/IT websites) that i using puppeteer exctracted,
//    and you will determine the most valuble info from website so that i can use it to write better email."
// `;

// const CHAT_INSTRUCTIONS = `
//     You are gonna be provided with textContent of certain tags from a web page/s (mostly software/IT websites) that i using puppeteer exctracted,
//      and you are gonna construct a sales email based on it. Any further prompts will be to fix/improve the email."`;

const CHAT_INSTRUCTIONS_2 = `
    You are helpfull assistant that will help me create sales email based on provided information about company. So youre response should always be in email format."`;

const CHAT_INSTRUCTIONS_3 = `
    You are helpfull assistant that will return STRINGIFIED json object based on provided text from pdf. So youre response should always be in json format.Retun simple clean stringified json object.without anything els youre comments or anything`;

// const CHAT_INSTRUCTIONS_4 = `You are helpfull assistant that will exctract emails, phone numbers from text.Youre response will always be in english even whe you are provided text in other languages."`;
const CHAT_INSTRUCTIONS_5 =
  'I want you to return STRINGIFIED json object based on provided text from pdf. So youre response should always be in json format.Retun simple clean stringified json object.without anything els youre comments or anything. use this interface as how should the json object look like: interface ICvData {firstName: string;lastName: string;email: string;phone: string;summary: string;skills: string[];experience: Array<{position: string;company: string;startDate: string;endDate?: string;description: string;}>;}';
@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}

  async returnSummerizedResponseOfArrayOfText(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: INSTRUCTIONS },
        { role: 'user', content: text },
      ],
      temperature: TEMPERATURE,
    });
    return chatCompletion.choices[0].message;
  }

  async createEmail(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: CHAT_INSTRUCTIONS_2 },
        { role: 'user', content: text },
      ],
      temperature: TEMPERATURE,
    });
    return chatCompletion.choices[0].message.content;
  }

  async createJsonObject(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: CHAT_INSTRUCTIONS_5 },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    });
    return chatCompletion.choices[0].message.content;
  }

  async chatCompletion(
    msg: ChatCompletionUserMessageParam,
    history: ChatCompletionMessageParam[],
    instructions: IInstructions,
  ) {
    console.log(instructions);

    let content = `You are helpfull assistant that will help me create sales email based on provided information about company. So youre response should always be in email format.`;
    if (instructions.howToAnswer) {
      content += `Instructions for response style: ${instructions.howToAnswer}.`;
    }
    if (instructions.betterAnswers) {
      content += `Preferred responses: ${instructions.betterAnswers}.`;
    }
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: content }, ...history, msg],
      temperature: TEMPERATURE,
    });

    const message = chatCompletion.choices[0].message;

    return {
      content: message.content,
      role: message.role,
    };
  }
}
