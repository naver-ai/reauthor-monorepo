import { ChatOpenAI } from '@langchain/openai';
import {ChatPromptTemplate, HumanMessagePromptTemplate} from "@langchain/core/prompts"
import {SystemMessage} from "@langchain/core/messages"
import {z} from "zod";
import { chatModel } from '../../config/config';


const generateThemesFromContext = async (self_narrative: string, history_log: Array<string>, additional_instructions='') => {

  // TODO: mode setting
  // mode 0: extract initial (theme, quote) pair
  // mode 1: exploration themes
  // 그냥 함수를 따로 만들기

  const mode = history_log.length === 0 ? 0 : 1; // mode 0: Only initial narrative, mode 1: With history log

  const system_message = mode===0? 
  `
  You are an assistant that helps user explore and examin one's personal narrative for them to understand it better, in an empowering way. 
  The user will share one's personal narrative with you. 
  Your task is to identify 10 themes that the user can explore further. 
  The themes that you elicit will be directly be delivered to the user themselves, and they should feel inviting for the users.  
  Do not assume the user's emotions or thoughts based on the situation described. 
  Please ensure that these themes are directly derived from the user's own words and expressions. 
  Instead, focus on using the exact language and phrases used by the user. 
  The themes should be framed in a way that would likely engage and be inviting the user and highlight important aspects of their experience.
  Also, it's important to use the user's expression as much as possible. 
  Never judge or assume anything that would stigmatize oneself. They will not feel inviting to explore further. 
  Also, for each theme, also retrieve the most relevant part (It could be sentence(s), phrase(s) in the narrative, with each theme) in Korean.
  User narrative: 
  `:
  `` // TODO: System message with history log

  const systemMessage = new SystemMessage(system_message);

  const humanTemplate = "User's narrative: {user_narrative}"

  const humanMessage = HumanMessagePromptTemplate.fromTemplate(humanTemplate)

  const edgeSchema = z.object({
    themes: z.array(z.object({
      theme: z.string().describe("Each theme from the personal narrative shared by a user."),
      quote: z.string().describe("Most relevant part of the user's narrative to the theme")
    }))
  })

  const finalPromptTemplate = ChatPromptTemplate.fromMessages([
    systemMessage,
    humanMessage
  ])

  const structuredLlm = chatModel.withStructuredOutput(edgeSchema);

  const chain = finalPromptTemplate.pipe(structuredLlm);

  const result = await chain.invoke({user_narrative: self_narrative});

  console.log("Theme result: ", result)

  return result;
} 

export default generateThemesFromContext;