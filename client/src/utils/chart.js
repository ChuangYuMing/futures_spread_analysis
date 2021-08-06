export const zoomToAll = chart => {
  const series = chart.series[0]
  const xAxis = chart.xAxis[0]
  const newStart = series.xData[0]
  const newEnd = series.xData[series.xData.length - 1]

  xAxis.setExtremes(newStart, newEnd)
}

export const temp = () => {}
