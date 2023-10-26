<template>
  <div class="h-full flex flex-col justify-center items-center w-full">
    <img width="400" height="400" class="absolute top-5" src="../assets/error-404-4344461-3613889.webp" alt="">
    <h1 class="text-2xl font-bold mt-36">
      404 - Page Not Found
    </h1>
    <h1 class="text-xl font-bold mt-5">
      Λυπούμαστε, η σελίδα που αναζητάτε δεν υπάρχει, κατευθυνθείται στην <span class="text-cyan-600 cursor-pointer underline" @click="$router.push('/')">αρχική</span>.
    </h1>
  </div>
</template>
