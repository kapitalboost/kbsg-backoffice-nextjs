export const drawSign = (
  ctx: CanvasRenderingContext2D,
  circleDims: {
    radius: number
    lineWidth: number
    strokeStyle: string
    colorFill?: string
    startX: number
    startY: number
  }
  // rectDims: { w: number; h: number } = { w: 400, h: 3500 }
) => {
  const { radius, strokeStyle, startX, startY, lineWidth, colorFill } =
    circleDims
  // ctx?.clearRect(0, 0, rectDims.w, rectDims.h)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = strokeStyle

  ctx?.beginPath()
  // ctx?.arc(startX, startY, radius, 100, 50, true)
  ctx.fillRect(startX, startY, 260, 120)
  ctx?.stroke()
  if (colorFill) {
    ctx.fillStyle = colorFill
    ctx.fill()
  }
}
