<template>
  <div class="mt-6 border border-neutral-200 p-4 rounded-lg">
    <div class="mb-4">
      <p class="font-bold">hiragana :</p>
      <p>{{ textCompletion.hiragana }}</p>
    </div>
    
    <div class="mb-4">
      <p class="font-bold">kanji :</p>
      <p>{{ textCompletion.kanji }}</p>
    </div>
    
    <div class="mb-4">
      <p class="font-bold">romaji :</p>
      <p>{{ textCompletion.romaji }}</p>
    </div>

    <div class="mt-4 border border-neutral-200 p-4 rounded-lg">
      <h3 class="mb-6">
        <div class="w-2xl h-3 text-2xl">{{ directRomaji }}</div>
      </h3>

      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="(item, index) in textCompletion.split" :key="index">
          <JapaneseWordCard 
            :item="item"
            @show-romaji="displayRomaji"
            @hide-romaji="hideRomaji"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JapaneseWordCard from './JapaneseWordCard.vue'

defineProps({
  textCompletion: {
    type: Object,
    required: true
  }
})

const directRomaji = ref('')

const displayRomaji = (part) => {
  directRomaji.value = part.romaji_syllables.join(' ')
}

const hideRomaji = () => {
  directRomaji.value = ''
}
</script>