import React from 'react'

class Canvas extends React.Component {
  state = {
    mouseDown: false,
    context: null
  }

  componentDidMount () {
    this.initCanvas()
  }

  initCanvas = () => {
    const context = this.refs.canvas.getContext('2d')
    this.setState({
      context
    })
    const imageData = context.createImageData(500, 500)

    // const updatedImageData = this.setBackgroundRandom(imageData)
    const updatedImageData = this.setBackground(imageData)

    context.putImageData(updatedImageData, 0, 0)
  }

  updateCanvas = (x, y) => {
    const imageData = this.state.context.getImageData(0, 0, 500, 500)
    const updatedImageData = this.paintPixels(imageData, x, y, 10)
    this.state.context.putImageData(updatedImageData, 0, 0)
  }

  // Sets background colour, default is black
  setBackground = (imageData, r = 0, g = 0, b = 0, a = 255) => {
    const { data } = imageData
    for (let i = 0; i < imageData.data.length; i += 4) {
      data[i + 0] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }
    return imageData
  }

  // Changes colour for a square of size x size pixels
  paintPixels (imageData, x, y, size, r = 0, g = 255, b = 0, a = 255) {
    const { width, data } = imageData
    const centreIndex = (x + y * width) * 4
    const topLeft = centreIndex - (size / 2 * 4)

    const pixelsToPaint = []
    for (let i = 0; i < size; i++) {
      const top = (topLeft + 4 * i)
      for (let j = 0; j < size; j++) {
        pixelsToPaint.push(top - (width * 4 * j))
      }
    }

    pixelsToPaint.forEach(i => {
      data[i + 0] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    })

    return imageData
  }

  // Sets background to random pixel colours
  setBackgroundRandom = (imageData) => {
    function getRandomNum (min, max) {
      return Math.random() * (max - min) + min
    }
    const { data } = imageData
    for (let i = 0; i < imageData.data.length; i += 4) {
      data[i + 0] = getRandomNum(255, 0)
      data[i + 1] = getRandomNum(255, 0)
      data[i + 2] = getRandomNum(255, 0)
      data[i + 3] = getRandomNum(255, 0)
    }
    return imageData
  }

  reset = e => {
    this.initCanvas()
  }

  mouseDownHandler = e => {
    this.setState({
      mouseDown: true
    })
    const { offsetX: x, offsetY: y } = e.nativeEvent
    this.updateCanvas(x, y)
  }

  mouseUpHandler = e => {
    this.setState({
      mouseDown: false
    })
  }

  mouseMoveHandler = e => {
    if (this.state.mouseDown) {
      const { offsetX: x, offsetY: y } = e.nativeEvent
      this.updateCanvas(x, y)
    }
  }

  render () {
    return (
      <div>
        <canvas
          ref="canvas"
          width={500}
          height={500}
          onMouseDown={this.mouseDownHandler}
          onMouseMove={this.mouseMoveHandler}
          onMouseUp={this.mouseUpHandler}/>
        <button
          onClick={this.reset}>
            Reset
        </button>
      </div>
    )
  }
}

export default Canvas

// The ImageData interface represents the underlying pixel data of an area of a <canvas> element

// ImageData()
// Creates an ImageData object from a given Uint8ClampedArray and the size of the image it contains.
