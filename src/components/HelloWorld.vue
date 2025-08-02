<script setup lang="ts">
// Font testing component
defineProps<{ msg: string }>()
</script>

<template>
  <div class="font-test-page">
    <header class="header">
      <h1>{{ msg }}</h1>
      <p class="subtitle">Testing SansSerifFLF font implementation</p>
    </header>

    <main class="content">
      <section class="font-samples">
        <h2>Font Samples</h2>
        
        <div class="sample-block">
          <h3>Headings</h3>
          <h1 class="test-h1">Heading 1 - Large Title</h1>
          <h2 class="test-h2">Heading 2 - Section Title</h2>
          <h3 class="test-h3">Heading 3 - Subsection</h3>
          <h4 class="test-h4">Heading 4 - Minor Heading</h4>
        </div>

        <div class="sample-block">
          <h3>Font Weight & Style Variations</h3>
          <p class="normal">Normal weight text</p>
          <p class="italic">Italic text</p>
          <p class="demibold">Demibold text (font-weight: 600)</p>
          <p class="demibold-italic">Demibold italic text</p>
        </div>

        <div class="sample-block">
          <h3>Paragraph Text</h3>
          <p class="test-paragraph">
            This is a paragraph of text using the SansSerifFLF font. 
            The quick brown fox jumps over the lazy dog. 
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
          </p>
          <p class="test-paragraph-small">
            This is smaller text to test readability at different sizes.
          </p>
        </div>

        <div class="sample-block">
          <h3>Special Characters & Numbers</h3>
          <p class="test-special">
            !@#$%^&amp;*()_+-=[]{}|;':&quot;,./?
          </p>
          <p class="test-numbers">
            1234567890 $123.45 €456.78 £789.01
          </p>
        </div>

        <div class="sample-block">
          <h3>Tailwind CSS Font Classes</h3>
          <p class="text-xs">Tailwind text-xs (12px)</p>
          <p class="text-sm">Tailwind text-sm (14px)</p>
          <p class="text-base">Tailwind text-base (16px)</p>
          <p class="text-lg">Tailwind text-lg (18px)</p>
          <p class="text-xl">Tailwind text-xl (20px)</p>
          <p class="text-2xl">Tailwind text-2xl (24px)</p>
          <p class="text-3xl">Tailwind text-3xl (30px)</p>
          <p class="text-4xl">Tailwind text-4xl (36px)</p>
        </div>

        <div class="sample-block">
          <h3>Tailwind Font Weight Classes</h3>
          <p class="font-thin">font-thin (100) - may fallback to system font</p>
          <p class="font-extralight">font-extralight (200) - may fallback to system font</p>
          <p class="font-light">font-light (300) - may fallback to system font</p>
          <p class="font-normal">font-normal (400) - SansSerifFLF normal</p>
          <p class="font-medium">font-medium (500) - may fallback to system font</p>
          <p class="font-semibold">font-semibold (600) - SansSerifFLF demibold</p>
          <p class="font-bold">font-bold (700) - may fallback to system font</p>
          <p class="font-extrabold">font-extrabold (800) - may fallback to system font</p>
          <p class="font-black">font-black (900) - may fallback to system font</p>
        </div>

        <div class="sample-block">
          <h3>Tailwind Typography Classes</h3>
          <p class="italic">Tailwind italic class</p>
          <p class="not-italic">Tailwind not-italic class</p>
          <p class="uppercase">tailwind uppercase class</p>
          <p class="lowercase">TAILWIND LOWERCASE CLASS</p>
          <p class="capitalize">tailwind capitalize class</p>
          <p class="underline">Tailwind underline class</p>
          <p class="line-through">Tailwind line-through class</p>
          <p class="tracking-tight">Tailwind tracking-tight (letter spacing)</p>
          <p class="tracking-wide">Tailwind tracking-wide (letter spacing)</p>
          <p class="leading-tight">Tailwind leading-tight (line height)</p>
          <p class="leading-loose">Tailwind leading-loose (line height)</p>
        </div>

        <div class="sample-block">
          <h3>Tailwind Color Classes</h3>
          <p class="text-gray-600">Gray text color</p>
          <p class="text-blue-600">Blue text color</p>
          <p class="text-red-600">Red text color</p>
          <p class="text-green-600">Green text color</p>
          <p class="bg-yellow-100 p-2 rounded">Background with padding</p>
        </div>

        <div class="sample-block">
          <h3>Different Sizes</h3>
          <p class="size-12">12px text size</p>
          <p class="size-14">14px text size</p>
          <p class="size-16">16px text size</p>
          <p class="size-18">18px text size</p>
          <p class="size-24">24px text size</p>
          <p class="size-32">32px text size</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.font-test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "SansSerifFLF", sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 2rem;
}

.header h1 {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.content {
  display: grid;
  gap: 2rem;
}

.sample-block {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.sample-block h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.test-h1 { font-size: 2.5rem; margin: 1rem 0; }
.test-h2 { font-size: 2rem; margin: 1rem 0; }
.test-h3 { font-size: 1.5rem; margin: 1rem 0; }
.test-h4 { font-size: 1.25rem; margin: 1rem 0; }

/* Font weight and style variations */
.normal { 
  font-weight: normal; 
  font-style: normal; 
  margin: 0.5rem 0;
}

.italic { 
  font-weight: normal; 
  font-style: italic; 
  margin: 0.5rem 0;
}

.demibold { 
  font-weight: 600; 
  font-style: normal; 
  margin: 0.5rem 0;
}

.demibold-italic { 
  font-weight: 600; 
  font-style: italic; 
  margin: 0.5rem 0;
}

.test-paragraph {
  font-size: 1rem;
  line-height: 1.6;
  margin: 1rem 0;
}

.test-paragraph-small {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 1rem 0;
  color: #666;
}

.test-special {
  font-size: 1.2rem;
  letter-spacing: 2px;
  margin: 1rem 0;
}

.test-numbers {
  font-size: 1.1rem;
  margin: 1rem 0;
}

.size-12 { font-size: 12px; }
.size-14 { font-size: 14px; }
.size-16 { font-size: 16px; }
.size-18 { font-size: 18px; }
.size-24 { font-size: 24px; }
.size-32 { font-size: 32px; }

/* Add some spacing between size examples */
.size-12, .size-14, .size-16, .size-18, .size-24, .size-32 {
  margin: 0.5rem 0;
}
</style>
