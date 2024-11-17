'use client'

import { useState, useEffect } from 'react'

export default function MemoryColor() {
  const [gameStarted, setGameStarted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showingPattern, setShowingPattern] = useState(true)
  const [colors, setColors] = useState<string[]>([])
  const [shuffledColors, setShuffledColors] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gameEndReason, setGameEndReason] = useState<
    'success' | 'failure' | null
  >(null)

  const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 31) + 70
    const lightness = Math.floor(Math.random() * 31) + 35
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const generateColors = () => {
    const newColors: string[] = []
    const usedHues = new Set<number>()

    while (newColors.length < 4) {
      const color = generateRandomColor()
      const hue = parseInt(color.match(/hsl\((\d+)/)?.[1] || '0')

      if (
        [...usedHues].every(
          (usedHue) =>
            Math.abs(usedHue - hue) > 30 || Math.abs(usedHue - hue) > 330
        )
      ) {
        usedHues.add(hue)
        newColors.push(color)
      }
    }

    let shuffled = [...newColors]
    do {
      shuffled = [...newColors].sort(() => Math.random() - 0.5)
    } while (shuffled.every((color, index) => color === newColors[index]))

    setColors(newColors)
    setShuffledColors(shuffled)
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setRound(1)
    setGameEndReason(null)
    startNewRound()
  }

  const startNewRound = () => {
    generateColors()
    setShowingPattern(true)
    setCountdown(5)
    setCurrentIndex(0)
  }

  const handleColorClick = (color: string) => {
    if (showingPattern) return

    if (color === colors[currentIndex]) {
      setScore(score + 1)

      if (currentIndex === colors.length - 1) {
        // 完成当前轮
        if (round === 10) {
          setGameStarted(false)
          setGameEndReason('success')
          return
        }
        setRound(round + 1)
        startNewRound()
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    } else {
      // 游戏结束
      setGameStarted(false)
      setGameEndReason('failure')
    }
  }

  useEffect(() => {
    if (gameStarted && showingPattern && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0) {
      setShowingPattern(false)
    }
  }, [countdown, gameStarted, showingPattern])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {!gameStarted ? (
        <>
          {round > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl font-bold">
                {gameEndReason === 'success' ? (
                  <span className="text-green-600">游戏成功！</span>
                ) : (
                  <span className="text-red-600">游戏失败</span>
                )}
              </div>
              <div className="text-xl">最终得分: {score}</div>
              {gameEndReason === 'success' && (
                <div className="text-green-600">恭喜你完成了所有10轮！</div>
              )}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={startGame}>
                重新开始
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 max-w-md text-center">
              <h1 className="text-2xl font-bold">颜色记忆游戏</h1>
              <div className="space-y-3">
                <p className="text-gray-700">游戏规则：</p>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>1. 游戏开始后会显示4个不同颜色的色块</li>
                  <li>2. 你有5秒钟的时间记住这些色块的顺序</li>
                  <li>3. 倒计时结束后，色块顺序会被打乱</li>
                  <li>4. 按照原始顺序点击色块，每点对一个得1分</li>
                  <li>5. 点错则游戏结束</li>
                  <li>6. 完成10轮后游戏结束</li>
                </ul>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={startGame}>
                开始游戏
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="text-xl">
            分数: {score} | 第 {round}/10 轮
            {showingPattern && <div>记忆时间: {countdown}秒</div>}
          </div>
          <div className="flex gap-4">
            {(showingPattern ? colors : shuffledColors).map((color, index) => (
              <div
                key={index}
                onClick={() => handleColorClick(color)}
                className="w-24 h-24 cursor-pointer transition-transform hover:scale-105 rounded-xl"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
