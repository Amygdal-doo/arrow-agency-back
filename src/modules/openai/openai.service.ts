import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";
import { IInstructions } from "./interfaces/instructions.interface";

const MODEL = "gpt-4o-mini";
const TEMPERATURE = 0.7;

// const ICvDatainterface =
//   "interface IExperience {position: string; company: string; startDate: string; endDate?: string; description: string;} interface IProject {name: string; description: string; startDate: string; endDate?: string; url?: string;} interface IEducation {institution: string; degree: string; field: string; startDate: string; endDate?: string;} interface ISocial {name: string; url: string;} interface ICourse {name: string; url: string; startDate: string; endDate?: string;} interface ICvLanguage {name: string; efficiency: string;} interface ICertificate {name: string; issuer: string; issueDate: string; expirationDate?: string; url?: string;} interface ICvData {firstName: string; lastName: string; email: string; phone: string; summary: string; skills: skills[]; hobies: string[]; experience: IExperience[]; projects: IProject[]; educations: IEducation[]; certificates: ICertificate[]; languages: ICvLanguage[]; socials: ISocial[]; courses: ICourse[];}";
const ICvDatainterface =
  'enum EfficiencyLevel { null = "null", beginner = "beginner", intermediate = "intermediate", advanced = "advanced", expert = "expert"; } interface IExperience { position: string; company: string; startDate: string; endDate?: string; description: string; } interface IProject { name: string; description: string; startDate: string; endDate?: string; url?: string; } interface IEducation { institution: string; degree: string; field: string; startDate: string; endDate?: string; } interface ISocial { name: string; url: string; } interface ICourse { name: string; url: string; startDate: string; endDate?: string; } interface ICvLanguage { name: string; efficiency: EfficiencyLevel; } interface ICertificate { name: string; issuer: string; issueDate: string; expirationDate?: string; url?: string; } interface skills { name: string; efficiency: EfficiencyLevel; } interface ICvData { firstName: string; lastName: string; email: string; phone: string; summary: string; skills: skills[]; hobies: string[]; experience: IExperience[]; projects: IProject[]; educations: IEducation[]; certificates: ICertificate[]; languages: ICvLanguage[]; socials: ISocial[]; courses: ICourse[]; }';

const CHAT_INSTRUCTIONS_3 = `
    You are helpfull assistant that will return STRINGIFIED json object based on provided text from pdf. So youre response should always be in json format.Retun simple clean stringified json object.without anything els youre comments or anything`;

// const CHAT_INSTRUCTIONS_4 = `You are helpfull assistant that will exctract emails, phone numbers from text.Youre response will always be in english even whe you are provided text in other languages."`;
const CHAT_INSTRUCTIONS_5 =
  "I want you to return STRINGIFIED json object based on provided text from pdf. So youre response should always be in json format.Retun simple clean stringified json object.without anything els youre comments or anything. use this interface as how should the json object look like: interface ICvData {firstName: string;lastName: string;email: string;phone: string;summary: string;skills: string[];experience: Array<{position: string;company: string;startDate: string;endDate?: string;description: string;}>;}";

const CHAT_INSTRUCTIONS_6 = `I want you to return STRINGIFIED json object based on provided text from pdf. So youre response should always be in json format. Return simple clean stringified json object.without anything else youre comments or anything. use this interface as how should the json response object look like: ${ICvDatainterface} - Dont give me partial object of the interface. Only return the complete object.`;
@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}

  async createJsonObject(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: CHAT_INSTRUCTIONS_6 },
        { role: "user", content: text },
      ],
      temperature: 0.1,
    });
    return chatCompletion.choices[0].message.content;
  }

  async chatCompletion(
    msg: ChatCompletionUserMessageParam,
    history: ChatCompletionMessageParam[],
    instructions: IInstructions
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
      messages: [{ role: "system", content: content }, ...history, msg],
      temperature: TEMPERATURE,
    });

    const message = chatCompletion.choices[0].message;

    return {
      content: message.content,
      role: message.role,
    };
  }
}
