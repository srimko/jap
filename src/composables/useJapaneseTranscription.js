import { ref } from 'vue'
import { functionSchema } from '@/llm/functionSchema'
import { messages } from '@/llm/messages'

export function useJapaneseTranscription() {
  const { VITE_OPENAI_API_KEY } = import.meta.env

  const file = ref(null)
  const textTranscription = ref('')
  const transcriptionLoading = ref(false)
  const textCompletion = ref(null)
  const textCompletionLoading = ref(false)

  const getTranscription = async () => {
    const formData = new FormData()
    formData.append('file', file.value, file.value.name)
    formData.append('model', 'whisper-1')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${VITE_OPENAI_API_KEY}` },
      body: formData,
    })
    
    if (!response.ok) throw new Error(await response.text())
    const result = await response.json()

    transcriptionLoading.value = false
    textTranscription.value = result.text
  }

  const getCompletion = async () => {
    messages.push({
      role: 'user',
      content: textTranscription.value,
    })

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.2,
        functions: [functionSchema],
        function_call: { name: 'segmentJapanese' },
        messages,
      }),
    })

    const json = await completion.json()
    textCompletion.value = JSON.parse(json.choices[0].message.function_call.arguments)
    textCompletionLoading.value = false
  }

  const processTranscription = async () => {
    try {
      transcriptionLoading.value = true
      await getTranscription()

      textCompletionLoading.value = true
      await getCompletion()
    } catch (err) {
      console.error(err)
      transcriptionLoading.value = false
      textCompletionLoading.value = false
      throw err
    }
  }

  return {
    file,
    textTranscription,
    transcriptionLoading,
    textCompletion,
    textCompletionLoading,
    processTranscription
  }
}