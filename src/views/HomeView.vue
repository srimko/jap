<template>
  <UContainer>
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Transcription &amp; segmentation (JP)</h2>

      <div class="flex justify-between mb-4">
        <UInput type="file" placeholder="fzefezr" size="xl" accept="audio/*" :loading="transcriptionLoading"
          @change="file = $event.target.files[0]" />

        <UButton label="Transcription" color="neutral" variant="outline" size="xl" @click="transcription"
          :disabled="!file || transcriptionLoading || textCompletionLoading"></UButton>
      </div>

      <div v-if="textTranscription" class="mt-6">
        <h3 class="text-2xl font-bold">Transcription</h3>
        <p>{{ textTranscription }}</p>
      </div>

      <div v-else-if="transcriptionLoading" class="gap-4">
        <USkeleton class="h-3 w-[250px] mb-4" />

        <div class="grid gap-2">
          <USkeleton class="h-2 w-4xl" />
          <USkeleton class="h-2 w-4xl" />
          <USkeleton class="h-2 w-4xl" />
          <USkeleton class="h-2 w-4xl" />
        </div>
      </div>

      <div v-if="textCompletion" class="mt-6 border border-neutral-200 p-4 rounded-lg">
        <p class="font-bold">hirgana :</p>
        <p>{{ textCompletion.hiragana }}</p>

        <p class="font-bold">kanji :</p>
        <p>{{ textCompletion.kanji }}</p>

        <p class="font-bold">romaji :</p>
        <p>{{ textCompletion.romaji }}</p>

        <div class="mt-4 border border-neutral-200 p-4 rounded-lg">
          <h3 class="mb-6">
            <div class="w-2xl h-3 text-2xl">{{ directRomaji }}</div>
          </h3>

          <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li v-for="(item, index) in textCompletion.split" :key="index">
              <UCard class="mb-4">
                <template #header>
                  <p class="">
                    {{ item.hiragana }}
                  </p>
                  <p>{{ item.translation }}</p>
                </template>
                <ul class="flex gap-2">
                  <li v-for="(p, key, index) in item.parts" @mouseenter="displayRomaji(p)" @mouseleave="hideRomaji"
                    class="mb-4">
                    <span class="border rounded-2xl px-1 py-2 m-0.5">{{ p.kanji }}</span>
                    <span></span>
                  </li>
                </ul>
              </UCard>
            </li>
          </ul>
        </div>
      </div>

      <div v-else-if="textCompletionLoading" class="mt-6 border border-neutral-200 p-4 rounded-lg">
        <div v-for="n in 3" class="mb-6">
          <USkeleton class="h-3 w-[250px] mb-4" />

          <div class="grid gap-2">
            <USkeleton class="h-2 w-3xl" />
            <USkeleton class="h-2 w-3xl" />
          </div>
        </div>
        <div class="mt-4 border border-neutral-200 p-4 rounded-lg">
          <USkeleton class="h-3 w-[250px] mb-4" />

          <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li v-for="n in 6">
              <UCard class="mb-4">
                <template #header>
                  <span class="text-gray-200">#</span>
                </template>
                <div class="flex flex-col gap-2">
                  <USkeleton class="h-2 w-full" />
                  <USkeleton class="h-2 w-full" />
                  <USkeleton class="h-2 w-full" />
                </div>
              </UCard>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'
import { functionSchema } from '@/llm/functionSchema'
import { messages } from '@/llm/messages'

const { VITE_OPENAI_API_KEY } = import.meta.env

const file = ref(null)
const textTranscription = ref('')
const transcriptionLoading = ref(false)
const textCompletion = ref(null)
const textCompletionLoading = ref(false)
const directRomaji = ref('')

const getTranscription = async () => {
  // Transcription via API Whisper
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

  console.log('Transcription:', textTranscription.value)
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
  console.log('Completion:', json)

  // Parse the function_call arguments
  textCompletion.value = JSON.parse(json.choices[0].message.function_call.arguments)
  console.log(textCompletion)
  textCompletionLoading.value = false
}

const transcription = async () => {
  console.log('transcription')
  try {
    transcriptionLoading.value = true
    await getTranscription()

    textCompletionLoading.value = true
    await getCompletion()
  } catch (err) {
    console.error(err)
    alert('Erreur lors du traitement : ' + err.message)
  }
}
const displayRomaji = (part) => {
  console.log('displayRomaji', part)
  console.log('displayRomaji', part.romaji_syllables)
  directRomaji.value = part.romaji_syllables.join(' ')
  // const romajiElement = event.target.querySelector('.hidden')
  // if (romajiElement) {
  //   romajiElement.classList.remove('hidden')
  // }
}

const hideRomaji = () => {
  directRomaji.value = ''
  // const romajiElement = event.target.querySelector('.hidden')
  // if (romajiElement) {
  //   romajiElement.classList.add('hidden')
  // }
}
</script>
