'use client'

import { useState, useEffect, useRef } from 'react'

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
]

export default function CodeAnimation() {
  const [currentSnippet, setCurrentSnippet] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [snippetIndex, setSnippetIndex] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= codeSnippets[snippetIndex].length) {
          setSnippetIndex((prevSnippetIndex) => (prevSnippetIndex + 1) % codeSnippets.length)
          return 0
        }
        return prevIndex + 1
      })
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [snippetIndex])

  useEffect(() => {
    setCurrentSnippet(codeSnippets[snippetIndex].slice(0, currentIndex))
  }, [currentIndex, snippetIndex])

  return (
    <pre className="text-green-500 text-xs sm:text-sm whitespace-pre-wrap break-words">
      {currentSnippet}
    </pre>
  )
}