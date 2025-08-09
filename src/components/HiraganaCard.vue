<template>
  <div
    v-if="hiragana"
    class="hiragana-card group"
    :class="{
      'playing': isPlaying,
      'hover-enabled': enableHover
    }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Main hiragana character -->
    <div class="hiragana-char">
      {{ hiragana.char }}
    </div>
    
    <!-- Romaji reading -->
    <div 
      v-if="showRomaji" 
      class="romaji-reading"
      :class="{ 'hidden': !showRomaji }"
    >
      {{ hiragana.romaji }}
    </div>
    
    <!-- Audio indicator -->
    <div class="audio-indicator" :class="{ 'active': isPlaying }">
      <UIcon 
        :name="isPlaying ? 'i-heroicons-speaker-wave' : 'i-heroicons-volume-up'" 
        class="audio-icon"
      />
    </div>
    
    <!-- Interaction overlay -->
    <div class="interaction-overlay">
      <UIcon name="i-heroicons-play" class="play-icon" />
    </div>
  </div>
  
  <!-- Empty cell -->
  <div v-else class="hiragana-card empty"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hiragana: {
    type: Object,
    default: null
  },
  showRomaji: {
    type: Boolean,
    default: true
  },
  enableHover: {
    type: Boolean,
    default: false
  },
  currentPlaying: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['play', 'hover-enter', 'hover-leave'])

// Playing state
const isPlaying = computed(() => 
  props.currentPlaying === props.hiragana?.char
)

// Click handling
const handleClick = () => {
  if (props.hiragana) {
    emit('play', props.hiragana)
  }
}

// Hover handling
const handleMouseEnter = () => {
  if (props.hiragana && props.enableHover) {
    emit('hover-enter', props.hiragana)
  }
}

const handleMouseLeave = () => {
  if (props.hiragana) {
    emit('hover-leave', props.hiragana)
  }
}
</script>

<style scoped>
.hiragana-card {
  position: relative;
  width: 5rem;
  height: 5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
  transition: all 200ms ease-in-out;
}

.hiragana-card:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-color: #93c5fd;
  transform: translateY(-0.25rem);
}

.hiragana-card:active {
  transform: scale(0.95);
}

.hiragana-card.empty {
  background: #f3f4f6;
  border-color: #f3f4f6;
  cursor: default;
}

.hiragana-card.empty:hover {
  box-shadow: none;
  border-color: #f3f4f6;
  transform: translateY(0);
}

.hiragana-card.playing {
  background: #eff6ff;
  border-color: #60a5fa;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  box-shadow: 0 0 0 2px #bfdbfe;
}

.hiragana-card.hover-enabled:hover {
  background: #f0fdf4;
  border-color: #86efac;
}

/* Main character */
.hiragana-char {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
}

.playing .hiragana-char {
  color: #1d4ed8;
}

/* Romaji reading */
.romaji-reading {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: opacity 200ms;
}

.romaji-reading.hidden {
  opacity: 0;
}

.playing .romaji-reading {
  color: #2563eb;
}

/* Audio indicator */
.audio-indicator {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  opacity: 0;
  transition: opacity 200ms;
}

.hiragana-card:hover .audio-indicator {
  opacity: 0.6;
}

.audio-indicator.active {
  opacity: 1;
}

.audio-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #3b82f6;
}

.audio-indicator.active .audio-icon {
  color: #2563eb;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Interaction overlay */
.interaction-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0);
  border-radius: 0.75rem;
  transition: all 200ms;
  opacity: 0;
  pointer-events: none;
}

.hiragana-card:hover .interaction-overlay {
  background: rgba(59, 130, 246, 0.1);
  opacity: 1;
}

.play-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #2563eb;
  opacity: 0;
  transition: opacity 200ms;
}

.hiragana-card:hover .play-icon {
  opacity: 0.8;
}

/* Special animations */
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.125rem); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hiragana-card.playing {
  animation: bounce-gentle 0.6s ease-in-out;
}

/* Responsive */
@media (max-width: 640px) {
  .hiragana-card {
    width: 4rem;
    height: 4rem;
  }
  
  .hiragana-char {
    font-size: 1.5rem;
  }
  
  .romaji-reading {
    font-size: 0.75rem;
  }
}
</style>