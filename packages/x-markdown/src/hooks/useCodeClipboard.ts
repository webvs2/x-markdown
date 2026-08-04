import { onUnmounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'

export function useCodeClipboard(copiedDuring = 2000) {
  const { copy: clipboardCopy } = useClipboard({ legacy: true })
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const setCopied = (value: boolean, duration = copiedDuring) => {
    copied.value = value
    clearTimer()
    if (value && duration > 0) {
      timer = setTimeout(() => {
        copied.value = false
        timer = null
      }, duration)
    }
  }

  const copy = async (text: string) => {
    await clipboardCopy(text)
    setCopied(true)
  }

  onUnmounted(clearTimer)

  return {
    copy,
    copied,
    setCopied,
  }
}
