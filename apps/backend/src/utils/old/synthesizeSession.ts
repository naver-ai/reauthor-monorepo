import { ThreadItem } from "../../config/schema"
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "@langchain/core/prompts"
import {z} from "zod";
import { chatModel } from '../../config/config';
import synthesizePrevInput from "./synthesizePrevInput";
import mongoose from "mongoose";

const synthesizeSession = async (tid: string, uid: mongoose.Types.ObjectId) => {
  const threadItem = await ThreadItem.findById(tid)
  if(!threadItem){
    console.log("Err in fetching threadItdm")
  }
  const theme = threadItem.theme

  //TODO fix new schema error
  const orientingInput = "" // threadItem.orientingInput
  const question = "" // threadItem.question
  const response = "" // threadItem.response

  const system_message=`
  [Role] You are a assistant of counselor that synthesizes the counseling session. 
  
  [Description of the context]
  In this counseling session, the counseler is using 'cards' (with themes/apsects to navigate) to help the user navigate different themes and aspects of their narrative. The session consists of a batch of interactions: 
  1) The counseler present a set of 'cards' based on the client's narrative provided.
  2) The client selects one 'card' and provides a detailed description related to it.
  3) Based on the client's description, you pose a reflexive question to prompt deeper reflection.
  4) The client responds to the question.

  [Task]
  Your task is to synthesize the session so that the counseler can refer to this for the next session. 

  [Input]
  <previous_input/>: Client's narrative and background of the previous sessions. 
  <card/>: The card that the user selected for the session
  <client_description/>: Client's description of one's narrative, related to the card
  <question/>: The question that the counseler asked to the client
  <user_response/>: Client's response of the question

  [Output]
  The counseler already has the record of the <previous_input/>, so you don't need to include information of the <previous_input>, outside of this session in synthesizing.
  Generate the synthesis of the session by text string. Also, don't convert or paraphrase expressions, but directly use the user's language and expressions. 
  `

  const human_template = `
  <previous_input/>: {previous_input}
  <card/>: {theme}
  <client_description/>: {orientingInput}
  <question/>: {question}
  <user_response/>: {response}
  `
  const previous_input = await synthesizePrevInput(uid)

  const systemMessage = SystemMessagePromptTemplate.fromTemplate(system_message)
  const humanMessage = HumanMessagePromptTemplate.fromTemplate(human_template)

  const summarySchema = z.object({
      "synthesis": z.string().describe("Synthesis of the session, well capturing user's detailed expressions.")
    })

  const finalPromptTemplate = ChatPromptTemplate.fromMessages([
    systemMessage,
    humanMessage
  ])

  const structuredLlm = chatModel.withStructuredOutput(summarySchema);

  const chain = finalPromptTemplate.pipe(structuredLlm);
  const result = await chain.invoke({previous_input: previous_input, theme: theme, orientingInput: orientingInput, question: question, response: response});
  return result.synthesis

}

export default synthesizeSession;