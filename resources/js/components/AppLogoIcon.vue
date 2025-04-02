<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineOptions({
    inheritAttrs: false,
});

interface Props {
    className?: HTMLAttributes['class'];
}

defineProps<Props>();
</script>
<template>
    <img src="https://pub-0ba7663f83bf4e0fa2794be6289b11bd.r2.dev/logo_CryptoSchool-2147x2147.png" :class="className"
        v-bind="$attrs" />
</template>
