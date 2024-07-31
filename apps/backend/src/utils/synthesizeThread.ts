import mongoose from "mongoose"
import { ThreadItem, User } from "../config/schema"
import nunjucks from 'nunjucks'

const synthesizeThread = async (tid: string, option='default') => {
  const threadItem = await ThreadItem.findById(tid).populate('questions')
  
  const synthesis = nunjucks.renderString(`
  Theme: {{ theme }}\n
  {% if questions.length > 0 %}
    {% for set in questions %}
      {% if set.selected %}
        Q: {{ set.question.content }}\n
        {% if option == "keyword" and set.keywords %}
          Provided Keywords: {{ set.keywords.join(', ')}}\n
        {% elif option == "comment" and set.aiGuides %}
          Previously provided comments: {{ set.aiGuides.join('| ')}}\n
        {% endif %}
        A: {{ set.response }}\n
      {% endif %}
      {% if not set.selected %}
        {% if option == "question" %}
          [Unselected question] set.question.content
        {% endif %}
      {% endif %}
    {% endfor %}
  {% else %}
    The session doesn't have log yet.\n
  {% endif %}
  `,{theme: threadItem.theme, questions: threadItem.questions, option: option})

  return synthesis
}

const synthesizePrevThreads = async (uid: mongoose.Types.ObjectId, option='default') => {
  const user = await User.findById(uid);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const threadRefs = user.threadRef;
  if (threadRefs.length) {
    const syntheses = await Promise.all(threadRefs.map(async (ref) => {
      return synthesizeThread(ref.toString(), option);
    }));
    
    return syntheses.join();
  } else {
    return ''
  }
}

export  {synthesizePrevThreads, synthesizeThread};