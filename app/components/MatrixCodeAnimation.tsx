'use client'

import { useEffect, useRef } from 'react'

const codeSnippets = [
  `def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a)
        a, b = b, a + b`,
  `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance`,
  `import json

def parse_json(data):
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        print("Invalid JSON:", e)`,
  `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
  `from collections import defaultdict

def count_words(text):
    word_count = defaultdict(int)
    for word in text.split():
        word_count[word] += 1
    return word_count`,
]

export default function MatrixCodeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const columns = Math.floor(canvas.width / 10)
    const drops: number[] = new Array(columns).fill(1)

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(0, 255, 65, 0.1)'
      ctx.font = '10px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)][Math.floor(Math.random() * 50)]
        ctx.fillText(text, i * 10, drops[i] * 10)

        if (drops[i] * 10 > canvas.height && Math.random() > 0.99) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    let animationFrameId: number

    function animate() {
      draw()
      draw()
      draw()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}