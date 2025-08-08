<template>
  <div class="mt-6 border border-neutral-200 p-4 rounded-lg">
    <div v-for="n in 3" :key="n" class="mb-6">
      <USkeleton class="h-3 w-[250px] mb-4" />
      <div class="grid gap-2">
        <USkeleton class="h-2 w-3xl" />
        <USkeleton class="h-2 w-3xl" />
      </div>
    </div>
    
    <div class="mt-4 border border-neutral-200 p-4 rounded-lg">
      <USkeleton class="h-3 w-[250px] mb-4" />
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="n in 6" :key="n">
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
</template>